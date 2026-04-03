"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const submitSessionFeedback = async ({
    bookingId,
    rating,
    comment
}: {
    bookingId: string,
    rating: number,
    comment: string
}) => {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await prisma.user.findUnique({ where: { clerkUserId: userId } });
        if (!user) throw new Error("User not found");

        const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
        if (!booking) throw new Error("Booking not found");

        if (booking.intervieweeId !== user.id) {
            throw new Error("Unauthorized action");
        }

        await prisma.feedback.update({
            where: { bookingId },
            data: { 
                sessionRating: rating,
                sessionComment: comment
             },
        });

        return { success: true };

    }catch (error) {
        console.error("SOMETHING WENT WRONG SUBMITTING SESSION FEEDBACK", error);
        throw new Error("Something went wrong submitting session feedback");
    }
}

export const getSessionFeedback = async (bookingId: string) => {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await prisma.user.findUnique({ where: { clerkUserId: userId } });
        if (!user) throw new Error("User not found");

        const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
        if (!booking) throw new Error("Booking not found");

        return await prisma.feedback.findUnique({ where: { bookingId } });
    }catch(err) {
        console.error("SOMETHING WENT WRONG GETTING SESSION FEEDBACK", err);
        throw new Error("Something went wrong getting session feedback");
    }
}

export const getInterviewerFeedback = async (interviewerId: string) => {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await prisma.user.findUnique({ where: { clerkUserId: userId } });
        if (!user) throw new Error("User not found");

        const interviewer = await prisma.user.findUnique({ where: { id: interviewerId } });
        if (!interviewer) throw new Error("Interviewer not found");

        const feedback = await prisma.feedback.findMany({ 
            where: {
                booking: {
                    interviewerId
                }
            }, 
            include: {
                booking: {
                    select: {
                        id: true,
                        startTime: true,
                        endTime: true,
                        interviewee: {
                            select: {
                                id: true,
                                name: true,
                                imageUrl: true,
                            },
                        },
                    },
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        revalidatePath("/dashboard");
        revalidatePath(`/dashboard/${interviewerId}`);
        revalidatePath("/appointments");

        return feedback;
    }catch(err) {
        console.error("SOMETHING WENT WRONG GETTING INTERVIEWER FEEDBACK", err);
        throw new Error("Something went wrong getting interviewer feedback");
    }
}