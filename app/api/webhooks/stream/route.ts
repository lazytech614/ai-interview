import prisma from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: any) {
    const body = await req.json(); 
    const eventType = body.type; 

    if(eventType !== "call.transcription_ready" && eventType !== "call.recording_ready" && eventType !== "call.ended") return Response.json({ok: true})
    
    const callCid = body.call_cid ?? ""
    const streamCallId = callCid.includes(":") ? callCid.split(":")[1] : callCid

    if(!streamCallId) return Response.json({ok: true})

    try {
        const booking = await prisma.booking.findUnique({
            where: {
                streamCallId
            },
            include: {
                interviewer: {
                    select: {
                        id: true,
                        name: true,
                        imageUrl: true,
                        clerkUserId: true,
                        categories: true
                    }
                },
                interviewee: {
                    select: {
                        id: true,
                        name: true,
                        imageUrl: true,
                        clerkUserId: true,
                    }
                },
                feedback: {
                    select: {
                        id: true
                    }
                }
            }
        })

        if(!booking) return Response.json({ok: true})

        // CALL ENDED
        if(eventType === "call.ended") {
            await prisma.booking.update({
                where: { id: booking.id },
                data: { status: "COMPLETED" }
            })
            return Response.json({ok: true})
        }

        // RECORDING READY 
        if(eventType === "call.recording_ready") {
            const recordingUrl = body.call_recording?.url

            if(!recordingUrl) return Response.json({ok: true})

            await prisma.booking.update({
                where: {
                    id: booking.id
                },
                data: {
                    recordingUrl
                }
            })

            return Response.json({ok: true})
        }

        // TRANSCRIPTION READY 
        if(eventType === "call.transcription_ready") {
            if(booking.feedback) return Response.json({ok: true})

            const transcriptionUrl = body.call_transcription?.url

            if(!transcriptionUrl) return Response.json({ok: true})

            // 1. DOWNLOAD JSON FROM STREAM CDN 
            const transcriptionRes = await fetch(transcriptionUrl)
            const transcriptionText = await transcriptionRes.text()

            // 2. PARSE JSON INTO READABLE CONVERSATION 
            const lines = transcriptionText
                .trim()
                .split("\n")
                .filter(Boolean)
                .map((line: any) => {
                    try {
                        return JSON.parse(line)
                    }catch(err) {
                        return null
                    }
                })
                .filter((entry: any) => entry?.type === "speech")

            if(lines.length === 0) return Response.json({ok: true})
            
            const speakerMap = {
                [booking.interviewee.clerkUserId]: booking.interviewee.name ?? "interviewee",
                [booking.interviewer.clerkUserId]: booking.interviewer.name ?? "Interviewer"
            }

            const transcript = lines
                .map((line: any) => `${speakerMap[line.speaker_id] ?? line.speaker_id}: ${line.text}`)
                .join("\n")

            // 3. GENERATE FEEDBACK VIA GEMINI 
            console.log(
                `[stream-webhook] Sending transcript to Gemini (gemini-2.5-flash-lite)...`
            );
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
            const model = genAI.getGenerativeModel({
                model: "gemini-2.5-flash-lite",
            });
            const categories =
                booking.interviewer.categories?.join(", ") ?? "General";
            
            const prompt = `You are an expert technical interviewer evaluating a mock interview.

            Interview categories: ${categories}
            Interviewer: ${booking.interviewer.name}
            Candidate: ${booking.interviewee.name}

            TRANSCRIPT:
            ${transcript}

            Analyze the candidate's performance. Respond ONLY with a valid JSON object, no markdown, no backticks, no explanation:
            {
            "summary": "2-3 sentence overall summary of the session",
            "technical": "Assessment of technical knowledge and accuracy",
            "communication": "Assessment of clarity, structure, and communication style",
            "problemSolving": "Assessment of problem-solving approach and thought process",
            "recommendation": "HIRE / CONSIDER / NO_HIRE with a one-sentence reason",
            "strengths": ["strength 1", "strength 2", "strength 3"],
            "improvements": ["improvement 1", "improvement 2", "improvement 3"],
            "overallRating": "POOR or AVERAGE or GOOD or EXCELLENT"
            }`;

            const result = await model.generateContent(prompt);
            const raw = result.response
                .text()
                .trim()
                .replace(/^```json|^```|```$/gm, "")
                .trim();

            console.log(
                `[stream-webhook] Gemini raw response:\n${raw.slice(0, 500)}${
                raw.length > 500 ? "..." : ""
                }`
            );

            const feedbackData = JSON.parse(raw);
            console.log(
                `[stream-webhook] Feedback parsed — overallRating: ${feedbackData.overallRating} | recommendation: ${feedbackData.recommendation}`
            );

            // 4. Write to DB — upsert handles concurrent webhook retries cleanly (no P2002)
            console.log(`[stream-webhook] Writing feedback to DB...`);
            await prisma.$transaction([
                prisma.feedback.upsert({
                where: { bookingId: booking.id },
                create: {
                    bookingId: booking.id,
                    summary: feedbackData.summary,
                    technical: feedbackData.technical,
                    communication: feedbackData.communication,
                    problemSolving: feedbackData.problemSolving,
                    recommendation: feedbackData.recommendation,
                    strengths: feedbackData.strengths,
                    improvements: feedbackData.improvements,
                    overallRating: feedbackData.overallRating,
                },
                update: {}, // already exists — no-op, keep the original
                }),
            ]);
            console.log(
                `[stream-webhook] Feedback upserted`
            );

            // Credit transaction is outside the main transaction so we can check first
            const earnExists = await prisma.creditTransaction.findFirst({
                where: { bookingId: booking.id, type: "BOOKING_EARNING" },
            });
            if (!earnExists) {
                await prisma.creditTransaction.create({
                data: {
                    userId: booking.interviewer.id,
                    amount: booking.creditsCharged,
                    type: "BOOKING_EARNING",
                    bookingId: booking.id,
                },
                });
                console.log(
                `[stream-webhook] Credit earning transaction created (+${booking.creditsCharged} credits for interviewer)`
                );
            } else {
                console.log(
                `[stream-webhook] Earning transaction already exists, skipping`
                );
            }

            console.log(`[stream-webhook] ✓ All done for booking ${booking.id}`);

            return Response.json({ ok: true });
        }
    }catch(err) {
        console.error(`[stream-webhook] ✗ ${eventType} error:`, err);
        // Always 200 — non-2xx triggers Stream retries, making the race worse
        return Response.json({ ok: true });
    }
}