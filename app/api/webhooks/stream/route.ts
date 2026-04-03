import prisma from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ── Constants ────────────────────────────────────────────────────────────────
// Minimum number of speech lines required to consider an interview "real"
// Guards against accidental joins, echo tests, or 10-second drops
const MIN_SPEECH_LINES = 3;

export async function POST(req: any) {
  const body = await req.json();
  const eventType = body.type;

  if (
    eventType !== "call.transcription_ready" &&
    eventType !== "call.recording_ready" &&
    eventType !== "call.ended" &&
    eventType !== "call.session_ended" &&
    eventType !== "call.session_participant_joined"
  )
    return Response.json({ ok: true });

  const callCid = body.call_cid ?? "";
  const streamCallId = callCid.includes(":")
    ? callCid.split(":")[1]
    : callCid;

  if (!streamCallId) return Response.json({ ok: true });

  try {
    const booking = await prisma.booking.findUnique({
      where: { streamCallId },
      include: {
        interviewer: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
            clerkUserId: true,
            categories: true,
          },
        },
        interviewee: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
            clerkUserId: true,
          },
        },
        feedback: { select: { id: true } },
      },
    });

    if (!booking) return Response.json({ ok: true });

    // ── Time helpers ──────────────────────────────────────────────────────────
    const now = new Date();
    const isPastEndTime = booking.endTime
      ? now >= new Date(booking.endTime)
      : false;

    // How far into the scheduled slot are we?
    // e.g. 0.5 = call dropped halfway through
    const scheduledDurationMs = booking.endTime && booking.startTime
      ? new Date(booking.endTime).getTime() - new Date(booking.startTime).getTime()
      : null;
    const elapsedMs = booking.startTime
      ? now.getTime() - new Date(booking.startTime).getTime()
      : null;
    const completionRatio =
      scheduledDurationMs && elapsedMs
        ? elapsedMs / scheduledDurationMs
        : null;

    // Consider the interview "substantially complete" if at least 50% of the
    // scheduled slot elapsed — even if endTime hasn't been reached yet.
    // This handles early-but-intentional endings (both parties agreed to finish).
    const isSubstantiallyComplete = (completionRatio !== null && completionRatio >= 0.5);

    console.log(
      `[stream-webhook] ${eventType} | booking=${booking.id} | status=${booking.status} | isPastEndTime=${isPastEndTime} | completionRatio=${completionRatio?.toFixed(2) ?? "n/a"}`
    );

    // ── Participant joined (rejoin after accidental drop) ─────────────────────
    // If the booking was marked COMPLETED prematurely and someone rejoins,
    // this is a signal the earlier end was accidental — reopen it.
    if (eventType === "call.session_participant_joined") {
      if ((booking.status === "COMPLETED" || booking.status === "UPCOMING" || booking.status === "PROCESSING") && !isPastEndTime) {
        await prisma.booking.update({
          where: { id: booking.id },
          data: { status: "UPCOMING" },
        });
        console.log(
          `[stream-webhook] Rejoin before end time detected — reopened booking ${booking.id}`
        );
      }
      return Response.json({ ok: true });
    }

    // ── Call / session ended ──────────────────────────────────────────────────
    if (eventType === "call.session_ended" || eventType === "call.ended") {
      // Already fully processed — nothing to do
      if (booking.status === "COMPLETED") return Response.json({ ok: true });

      if (isPastEndTime) {
        // Clean finish — scheduled slot is over
        await prisma.booking.update({
          where: { id: booking.id },
          data: { status: "COMPLETED" },
        });
        console.log(
          `[stream-webhook] Clean finish — marked COMPLETED for booking ${booking.id}`
        );
      } else if (isSubstantiallyComplete) {
        // Call ended a bit early but enough of the interview happened.
        // Mark PROCESSING so transcription/recording handlers can run normally.
        await prisma.booking.update({
          where: { id: booking.id },
          data: { status: "PROCESSING" },
        });
        console.log(
          `[stream-webhook] Early but substantial finish (${((completionRatio ?? 0) * 100).toFixed(0)}% elapsed) — marked PROCESSING for booking ${booking.id}`
        );
      } else {
        // Too early — likely an accidental drop or network issue.
        // Keep UPCOMING so both participants can rejoin.
        console.log(
          `[stream-webhook] Premature end (${((completionRatio ?? 0) * 100).toFixed(0)}% elapsed) — keeping UPCOMING for booking ${booking.id}, participants can rejoin`
        );
      }

      return Response.json({ ok: true });
    }

    // ── Recording ready ───────────────────────────────────────────────────────
    if (eventType === "call.recording_ready") {
      const recordingUrl = body.call_recording?.url;
      if (!recordingUrl) return Response.json({ ok: true });

      // Only saved the URL 
      // Status is managed by call.ended (end time logic) and
      // transcription_ready (real speech confirmed). 
      await prisma.booking.update({
        where: { id: booking.id },
        data: {
          recordingUrl
        },
      });
      console.log(
        `[stream-webhook] Recording saved + COMPLETED for booking ${booking.id}`
      );
      return Response.json({ ok: true });
    }

    // ── Transcription ready ───────────────────────────────────────────────────
    if (eventType === "call.transcription_ready") {
      // Already has feedback — idempotency guard
      if (booking.feedback) {
        console.log(
          `[stream-webhook] Feedback already exists for booking ${booking.id} — skipping`
        );
        return Response.json({ ok: true });
      }

      const transcriptionUrl = body.call_transcription?.url;
      if (!transcriptionUrl) return Response.json({ ok: true });

      // 1. Download transcript ────────────────────────────────────────────────
      const transcriptionRes = await fetch(transcriptionUrl);
      if (!transcriptionRes.ok) {
        console.error(
          `[stream-webhook] Failed to fetch transcription: ${transcriptionRes.status}`
        );
        return Response.json({ ok: true });
      }
      const transcriptionText = await transcriptionRes.text();

      const lines = transcriptionText
        .trim()
        .split("\n")
        .filter(Boolean)
        .map((line: any) => {
          try {
            return JSON.parse(line);
          } catch {
            return null;
          }
        })
        .filter((entry: any) => entry?.type === "speech");

      // Not enough speech to be a real interview — could be an accidental
      // join, mic test, or a call that dropped in the first few seconds
      if (lines.length < MIN_SPEECH_LINES) {
        console.log(
          `[stream-webhook] Only ${lines.length} speech line(s) — not enough for a real interview, skipping feedback for booking ${booking.id}`
        );
        return Response.json({ ok: true });
      }

      // 2. Build readable transcript ──────────────────────────────────────────
      const speakerMap: Record<string, string> = {
        [booking.interviewee.clerkUserId]:
          booking.interviewee.name ?? "Interviewee",
        [booking.interviewer.clerkUserId]:
          booking.interviewer.name ?? "Interviewer",
      };

      const transcript = lines
        .map(
          (line: any) =>
            `${speakerMap[line.speaker_id] ?? line.speaker_id}: ${line.text}`
        )
        .join("\n");

      // 3. Generate feedback via Gemini ───────────────────────────────────────
      console.log(`[stream-webhook] Sending transcript to Gemini...`);
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

      let feedbackData: any;
      try {
        feedbackData = JSON.parse(raw);
      } catch (parseErr) {
        console.error(
          `[stream-webhook] Failed to parse Gemini response:\n${raw}`
        );
        // Return 200 so Stream doesn't retry — a retry would just hit the same
        // bad Gemini response. The booking status will still be updated below.
        return Response.json({ ok: true });
      }

      console.log(
        `[stream-webhook] Feedback parsed — overallRating: ${feedbackData.overallRating} | recommendation: ${feedbackData.recommendation}`
      );

      // 4. Persist feedback ───────────────────────────────────────────────────
      await prisma.feedback.upsert({
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
        update: {},
      });
      console.log(`[stream-webhook] Feedback upserted for booking ${booking.id}`);

      // 5. Mark booking COMPLETED ─────────────────────────────────────────────
      // Transcription arriving with real speech is the strongest signal the
      // interview actually happened — mark COMPLETED unconditionally here.
      // This also covers the case where the call ended early but legitimately.
      await prisma.booking.update({
        where: { id: booking.id },
        data: { status: "COMPLETED" },
      });
      console.log(`[stream-webhook] Marked COMPLETED for booking ${booking.id}`);

      // 6. Credit the interviewer ─────────────────────────────────────────────
      // Same reasoning as above — real transcript = interview happened =
      // interviewer earned their credits. The findFirst guard prevents
      // double-crediting on webhook retries.
      const earnExists = await prisma.creditTransaction.findFirst({
        where: { bookingId: booking.id, type: "BOOKING_EARNING" },
      });
      if (!earnExists) {
        await prisma.$transaction([
            prisma.creditTransaction.create({
                data: {
                    userId: booking.interviewer.id,
                    amount: booking.creditsCharged,
                    type: "BOOKING_EARNING",
                    bookingId: booking.id,
                },
            }),
            prisma.user.update({
                where: { id: booking.interviewer.id },
                data: { credits: { increment: booking.creditsCharged } },
            }),
        ]);
        console.log(
          `[stream-webhook] Credit earning created (+${booking.creditsCharged} for interviewer ${booking.interviewer.id})`
        );
      } else {
        console.log(
          `[stream-webhook] Credit earning already exists for booking ${booking.id} — skipping`
        );
      }

      console.log(`[stream-webhook] ✓ All done for booking ${booking.id}`);
      return Response.json({ ok: true });
    }
  } catch (err) {
    console.error(`[stream-webhook] ✗ ${eventType} error:`, err);
    // Always return 200 — non-2xx triggers Stream retries which can cause
    // duplicate processing (double credits, double feedback, etc.)
    return Response.json({ ok: true });
  }
}