"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const getInterviewers = async () => {
    try {
        const {userId} = await auth()
        if(!userId) throw new Error("Unauthorized")

        const user = await prisma.user.findUnique({
            where: {
                clerkUserId: userId
            },
        })
        if(!user) throw new Error("User not found")

        // const interviewers = await prisma.user.findMany({
        //     where: {
        //         role: "INTERVIEWER"
        //     },
        //     select: {
        //         id: true,
        //         name: true,
        //         imageUrl: true,
        //         title: true,
        //         company: true,
        //         yearsExp: true,
        //         bio: true,
        //         categories: true,
        //         creditRate: true,
        //         availabilities: {
        //             where: {
        //                 status: "AVAILABLE"
        //             },
        //             select: {
        //                 startTime: true,
        //                 endTime: true
        //             },
        //             take: 1
        //         }
        //     },
        //     orderBy: {
        //         createdAt: "desc"
        //     }
        // })

        const interviewers = await prisma.user.findMany({
            where: {
                role: "INTERVIEWER",
                availabilities: {
                some: {
                    status: "AVAILABLE"
                    }
                },
                ...(user && {
                    clerkUserId: {
                        not: userId
                    }
                })
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
                creditRate: true,
                availabilities: {
                where: {
                    status: "AVAILABLE"
                },
                select: {
                    startTime: true,
                    endTime: true
                },
                take: 1
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        return interviewers
    }catch(err) {
        console.error("SOMETHING WENT WRONG GETTING INTERVIEWERS", err)
        return []
    }
};