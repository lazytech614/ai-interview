"use server";

import { BookSlotResponse } from "@/components/interviewers/slot-picker";
import { checkRateLimit, createRateLimitor } from "@/lib/arcjet";
import prisma from "@/lib/prisma";
import { request } from "@arcjet/next";
import { auth } from "@clerk/nextjs/server";
import {StreamClient} from "@stream-io/node-sdk"
import { revalidatePath } from "next/cache";

const bookingLimiter = createRateLimitor({
    refillRate: 2,
    interval: "1h",
    capacity: 5
})

export const getInterviewerProfile = async (id: string) => {
    try {
        const {userId} = await auth()
        if(!userId) throw new Error("Unauthorized")

        const user = await prisma.user.findUnique({
            where: {
                clerkUserId: userId
            },
        })
        if(!user) throw new Error("User not found")

        if(!id) throw new Error("Missing required fields")

        const interviewer = await prisma.user.findUnique({
            where: {
                id,
                role: "INTERVIEWER"
            },
            select: {
                id: true,
                name: true,
                imageUrl: true,
                title: true,
                company: true,
                yearsExp: true,
                bio: true,
                categories: true,
                sessionRates: {
                    select: {
                        duration: true,
                        credits: true
                    }
                },
                availabilities: {
                    where: {
                        status: "AVAILABLE"
                    },
                    select: {
                        startTime: true,
                        endTime: true
                    },
                },
                bookingsAsInterviewer: {
                    where: {
                        status: "SCHEDULED"
                    },
                    select: {
                        startTime: true,
                        endTime: true
                    }
                }
            }
        })

        return interviewer ?? null
    }catch(err) {
        console.error("SOMETHING WENT WRONG GETTING INTERVIEWER PROFILE", err)
        return null
    }
};

export const bookSlot = async ({interviewerId, startTime, endTime, duration}: {interviewerId: string, startTime: string, endTime: string, duration: 45 | 60 | 90;}): Promise<BookSlotResponse> => {
    try {
        const {userId} = await auth()
        if(!userId) throw new Error("Unauthorized")

        const start = new Date(startTime);
        const end   = new Date(endTime);

        // Verify the endTime actually matches the chosen duration
        // This prevents a tampered client from sending a wrong endTime
        const expectedEnd = new Date(start.getTime() + duration * 60 * 1000);
        if (end.getTime() !== expectedEnd.getTime()) {
        throw new Error("Invalid slot duration");
        }

        // Collision check — reject if any SCHEDULED booking overlaps this window
        const collision = await prisma.booking.findFirst({
        where: {
            interviewerId,
            status: "SCHEDULED",
            AND: [
            { startTime: { lt: end   } },   // existing starts before new ends
            { endTime:   { gt: start } },   // existing ends after new starts
            ],
        },
        });
        if (collision) throw new Error("This slot has just been booked. Please choose another.");
            
        //  ARCJET RATE LIMITING 
        const req = await request()
        const rateLimitError = await checkRateLimit(bookingLimiter, req, userId)
        if(rateLimitError) throw new Error(rateLimitError)

        const user = await prisma.user.findUnique({
            where: {
                clerkUserId: userId
            },
        })
        if(!user) throw new Error("User not found")
        if(user.role !== "INTERVIEWEE") throw new Error("Only interviewees can book slots")


        const interviewer = await prisma.user.findUnique({
            where: {
                id: interviewerId,
                role: "INTERVIEWER"
            },
            include: {
                sessionRates: true
            }
        })
        if(!interviewer) throw new Error("Interviewer not found")

        const rate = interviewer.sessionRates.find(
            (r) => r.duration === duration
        )

        if (!rate) throw new Error("Pricing not set for this duration")

        const credits = rate.credits

        if(user.credits < credits) throw new Error("Insufficient credits. Please upgrade your plan.")

        const conflict = await prisma.booking.findFirst({
            where: {
                interviewerId,
                status: "SCHEDULED",
                startTime: {lt: new Date(endTime)},
                endTime: {gt: new Date(startTime)}
            }
        })

        if(conflict) throw new Error("This slot is already booked. Please choose another time.")


        // STREM CALL 
        let streamCallId 
        try {
            const streamClient = new StreamClient(
                process.env.NEXT_PUBLIC_STREAM_API_KEY!,
                process.env.STREAM_API_SECRET!
            )
            
            await streamClient.upsertUsers([
                {
                    id: user.clerkUserId,
                    name: user.name ?? "Interviewee",
                    image: user.imageUrl ?? undefined,
                    role: "user"
                },
                {
                    id: interviewer.clerkUserId,
                    name: interviewer.name ?? "Interviewer",
                    image: interviewer.imageUrl ?? undefined,
                    role: "user"
                }
            ])

            streamCallId = `mock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`

            const call = streamClient.video.call("default", streamCallId)

            await call.getOrCreate({
                data: {
                    created_by_id: user.clerkUserId,
                    members: [
                        {user_id: user.clerkUserId, role: "host"},
                        {user_id: interviewer.clerkUserId, role: "host"}
                    ],
                    settings_override: {
                        recording: {mode: "available", quality: "1080p"},
                        screensharing: {enabled: true},
                        transcription: {mode: "auto-on"}
                    }
                }
            })
        }catch(err) {
            console.error("SOMETHING WENT WRONG WITH STREAM CALL", err)
            throw new Error("Something went wrong with call. Please try again.")
        }

        try {
            const booking = await prisma.$transaction(async (tx) => {
                const newBooking = await tx.booking.create({
                    data: {
                        interviewerId,
                        intervieweeId: user.id,
                        startTime: new Date(startTime),
                        endTime: new Date(endTime),
                        status: "SCHEDULED",
                        creditsCharged: credits,
                        streamCallId,
                    }
                })

                await tx.creditTransaction.create({
                    data: {
                        userId: user.id,
                        amount: -credits,
                        type: "BOOKING_DEDUCTION",
                        bookingId: newBooking.id
                    }
                })

                await tx.user.update({
                    where: {
                        id: user.id
                    },
                    data: {
                        credits: {
                            decrement: credits
                        }
                    }
                })

                await tx.user.update({
                    where: {
                        id: interviewerId
                    },
                    data: {
                        creditBalance: {
                            increment: credits
                        }
                    }
                })

                return newBooking
            })

            revalidatePath(`/interviewers/${interviewerId}`)
            revalidatePath(`/dashboard`)

            return {success: true, bookingId: booking.id, streamCallId}
        }catch(err) {
            console.error("SOMETHING WENT WRONG WITH BOOKING SLOT TRANSACTION", err)
            throw new Error("Something went wrong while booking slot transaction")
        }

    }catch(err) {
        console.error("SOMETHING WENT WRONG WHILE BOOKING SLOT", err)
        throw new Error("Something went wrong while booking slot", (err as any).message)
    }
};