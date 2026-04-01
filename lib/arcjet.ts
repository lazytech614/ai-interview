import arcjet, { tokenBucket } from '@arcjet/next'

export const createRateLimitor = ({
    refillRate,
    interval,
    capacity
}: any) => {
    return arcjet({
        key: process.env.ARCJET_KEY!,
        characteristics: ["userId"],
        rules: [
            tokenBucket({
                mode: "LIVE",
                refillRate,
                interval,
                capacity
            })
        ]
    })
}

export const checkRateLimit = async (aj: any, req: any, userId: any) => {
    const decesion = await aj.protect(req, {userId, requested: 1})

    if(decesion.isDenied()) {
        return decesion.reason.isRateLimit()
            ? "Too many requests. Please try again later."
            : "Request blocked. Please try again later."
    }

    return null
}