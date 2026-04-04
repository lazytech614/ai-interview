import { auth, currentUser } from "@clerk/nextjs/server"
import prisma from "./prisma"

const PLAN_CREDITS = {
    free: 1,
    starter: 5,
    pro: 15
}

const getCurrentPlan = async () => {
    const {has} = await auth()

    if(has({plan: "pro"})) return "pro"
    if(has({plan: "starter"})) return "starter"
    return "free"
}

const shouldAllocateCredits = (dbUser: any, currentPlan: any) => {
    if(dbUser.currentPlan !== currentPlan) return true

    if(!dbUser.creditsLastAllocatedAt) return true

    const now = new Date()
    const last = new Date(dbUser.creditsLastAllocatedAt)
    const isNewMonth = now.getFullYear() > last.getFullYear() || now.getMonth() > last.getMonth()

    return isNewMonth
}

export const checkUser = async () => {
    const {userId} = await auth()
    const user = await currentUser()
    
    if(!userId) return null

    try{
        const currentPlan = await getCurrentPlan()
        const credits = PLAN_CREDITS[currentPlan]

        const loggedUser = await prisma.user.findUnique({
            where: {
                clerkUserId: userId
            }
        })

        if(loggedUser) {
            if(shouldAllocateCredits(loggedUser, currentPlan)) {
                const updatedUser = await prisma.user.update({
                    where: {
                        clerkUserId: userId
                    },
                    data: {
                        credits,
                        currentPlan,
                        creditsLastAllocatedAt: new Date()
                    }
                })

                return updatedUser
            }

            return loggedUser
        }

        return await prisma.user.create({
            data: {
                clerkUserId: userId,
                name: `${user?.firstName} ${user?.lastName}`,
                email: user?.emailAddresses[0].emailAddress!,
                imageUrl: user?.imageUrl,
                credits,
                currentPlan,
                creditsLastAllocatedAt: new Date()
            }
        })
    }catch(err) {
        console.error("CHECK USER ERROR: ", err)
        return null 
    }
}