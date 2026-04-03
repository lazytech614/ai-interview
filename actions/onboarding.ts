"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const completeOnboarding = async (data: any) => {
    try {
        const { userId } = await auth()
        if (!userId) throw new Error("Unauthorized")

        console.log("🟢🟢🟢🟢UserId: ", userId)

        const user = await prisma.user.findUnique({
            where: {
                clerkUserId: userId
            },
        })
        if (!user) throw new Error("User not found")

        const {
            role,
            title,
            company,
            yearsExp,
            bio,
            categories,
            sessionRates
        } = data

        if (!role || !["INTERVIEWEE", "INTERVIEWER"].includes(role)) {
            throw new Error("Invalid role")
        }

        if (role === "INTERVIEWER") {
            if (!title || !company || !yearsExp || !bio || !categories?.length) {
                throw new Error("Missing required fields")
            }

            // Validate session rates
            if (!sessionRates) throw new Error("Session rates required")

            if (sessionRates[45] !== 1) {
                throw new Error("45 min must be 1 credit")
            }

            if (![1, 2, 3].includes(sessionRates[60])) {
                throw new Error("60 min must be 1, 2, or 3 credits")
            }

            if (![1, 2, 3, 4, 5].includes(sessionRates[90])) {
                throw new Error("90 min must be 1–5 credits")
            }
        }

        // Transaction (important)
        await prisma.$transaction(async (tx) => {

            // 1. Update user
            await tx.user.update({
                where: {
                    clerkUserId: userId
                },
                data: {
                    role,
                    ...(role === "INTERVIEWER" && {
                        title,
                        company,
                        yearsExp,
                        bio,
                        categories
                    })
                }
            })

            // 2. Upsert session rates
            if (role === "INTERVIEWER") {
                const rates = [
                    { duration: 45, credits: sessionRates[45] },
                    { duration: 60, credits: sessionRates[60] },
                    { duration: 90, credits: sessionRates[90] }
                ]

                for (const rate of rates) {
                    await tx.sessionRate.upsert({
                        where: {
                            userId_duration: {
                                userId: user.id,
                                duration: rate.duration
                            }
                        },
                        update: {
                            credits: rate.credits
                        },
                        create: {
                            userId: user.id,
                            duration: rate.duration,
                            credits: rate.credits
                        }
                    })
                }
            }
        })

        return { success: true }

    } catch (err) {
        console.error("ERROR COMPLETING ONBOARDING", err)
        throw new Error("ERROR COMPLETING ONBOARDING")
    }
}