"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { StreamClient } from "@stream-io/node-sdk";

export const getCallData = async(callId: string) => {
    try {
        const {userId} = await auth()
        if(!userId) return {error: "Unauthorized"}

        const user = await prisma.user.findUnique({
            where: {
                clerkUserId: userId
            },
        })
        if(!user) return {error: "User not found"}

        const booking = await prisma.booking.findUnique({
            where: {
                streamCallId: callId
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
                        clerkUserId: true
                    }
                }
            }
        })

        if(!booking) return {error: "No booking found"}

        const isInterviewer = booking.interviewer.clerkUserId === userId
        const isInterviewee = booking.interviewee.clerkUserId === userId

        if(!isInterviewer && !isInterviewee) return {error: "Forbidden"}

        const streamClient = new StreamClient(
            process.env.NEXT_PUBLIC_STREAM_API_KEY!,
            process.env.STREAM_API_SECRET!
        )
        
        const token = streamClient.generateUserToken({
            user_id: user.id,
            validity_in_seconds: 60 * 60
        })

        return {
            token,
            isInterviewer,
            currentUser: {
                id: user.id,
                name: user.name,
                imageUrl: user.imageUrl
            },
            booking: {
                id: booking.id,
                interviewer: booking.interviewer,
                interviewee: booking.interviewee,
                categories: booking.interviewer.categories,
                startTime: booking.startTime.toISOString(),
                endTime: booking.endTime.toISOString()
            }
        }
    }catch(err) {
        return {error: err}
    }
}