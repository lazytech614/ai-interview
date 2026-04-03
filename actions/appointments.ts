"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const getIntervieweeAppointments = async () => {
    try {
        const {userId} = await auth()
        if(!userId) throw new Error("Unauthorized")

        const user = await prisma.user.findUnique({
            where: {
                clerkUserId: userId
            },
        })
        if(!user) throw new Error("User not found")

        return prisma.booking.findMany({
            where: {
                intervieweeId: user.id
            },
            include: {
                interviewer: {
                    select: {
                        name: true,
                        imageUrl: true,
                        email: true,
                        title: true,
                        company: true,
                        categories: true,
                        yearsExp: true
                    }
                },
                feedback: true,
            },
            orderBy: {
                createdAt: "desc"
            }
        })
    }catch(err) {
        console.error("SOMETHING WENT WRONG GETTING INTERVIEWEE APPOINTMENTS", err)
        throw new Error("Something went wrong")
    }
}