"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export const getCurrentUser = async () => {
    try {
        const user = await currentUser();
        if(!user) return null
        
        return prisma.user.findUnique({
            where: {
                clerkUserId: user.id
            },
            select: {
                role: true,
                name: true,
                title: true,
                company: true,
                imageUrl: true,
                credits: true
            }
        })
    }catch(err) {
        console.error("SOMETHING WENT WRONG GETTING CURRENT USER", err)
        return null
    }
};