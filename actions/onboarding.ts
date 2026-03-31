"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const completeOnboarding = async (data: any) => {
    try {
        const {userId} = await auth()
        if(!userId) throw new Error("Unauthorized")

        const user = await prisma.user.findUnique({
            where: {
                clerkUserId: userId
            },
        })
        if(!user) throw new Error("User not found")

        const {role, title, company, yearsExp, bio, categories} = data

        if(!role || !["INTERVIEWEE", "INTERVIEWER"].includes(role)) throw new Error("Invalid role")
        
        if(role === "INTERVIEWER") {
            if(!title || !company || !yearsExp || !bio || !categories?.length) throw new Error("Missing required fields")
        }

        await prisma.user.update({
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

        return {success: true}
    }catch(err) {
        console.error("ERROR COMPLETING ONBOARDING", err)
        throw new Error("ERROR COMPLETING ONBOARDING")
    }
}