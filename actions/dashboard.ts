"use server";

import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { render } from "@react-email/render";
import { createRateLimitor, checkRateLimit } from "@/lib/arcjet";
import { request } from "@arcjet/next";
import { WithdrawalRequestEmail } from "@/emails/WithdrawalRequestEmail";
import { FormData } from "@/components/dashboard/types/types";

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;

const withdrawalLimiter = createRateLimitor({
  refillRate: 1,
  interval: "1h",
  capacity: 3,
});

export const setAvailability = async ({
  date,
  slots,
}: {
  date: string;
  slots: { startTime: string; endTime: string }[];
}) => {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({ where: { clerkUserId: userId } });
    if (!user) throw new Error("User not found");
    if (user.role !== "INTERVIEWER") throw new Error("Only interviewers can set availability");

    if (!date || !slots?.length) throw new Error("Missing required fields");

    // Enforce 7-day window using UTC to avoid timezone mismatch
    const [y, m, d] = date.split("-").map(Number);
    const slotDate = new Date(Date.UTC(y, m - 1, d));

    const todayUTC = new Date();
    todayUTC.setUTCHours(0, 0, 0, 0);
    const maxDateUTC = new Date(todayUTC);
    maxDateUTC.setUTCDate(todayUTC.getUTCDate() + 6);

    if (slotDate < todayUTC || slotDate > maxDateUTC) {
      throw new Error("Date must be within the next 7 days");
    }

    // Validate each slot
    for (const { startTime, endTime } of slots) {
      if (new Date(startTime) >= new Date(endTime)) {
        throw new Error("Each slot's end time must be after its start time");
      }
    }

    // Use UTC-based day boundaries to match the date key
    const dayStart = new Date(Date.UTC(y, m - 1, d));
    const dayEnd   = new Date(Date.UTC(y, m - 1, d, 23, 59, 59, 999));

    await prisma.availability.deleteMany({
      where: {
        interviewerId: user.id,
        status: "AVAILABLE",
        startTime: { gte: dayStart, lte: dayEnd },
      },
    });

    await prisma.availability.createMany({
      data: slots.map(({ startTime, endTime }) => ({
        interviewerId: user.id,
        startTime: new Date(startTime),
        endTime:   new Date(endTime),
        status:    "AVAILABLE" as const,
      })),
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (err) {
    console.error("SOMETHING WENT WRONG SETTING AVAILABILITY", err);
    throw new Error("Something went wrong setting availability");
  }
};

export const getAvailability = async () => {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) throw new Error("User not found");
    if (user.role !== "INTERVIEWER")
      throw new Error("Only interviewers can get availability");

    // Get next 7 days window
    const todayUTC = new Date();
    todayUTC.setUTCHours(0, 0, 0, 0);
    const maxDateUTC = new Date(todayUTC);
    maxDateUTC.setUTCDate(todayUTC.getUTCDate() + 6);

    const availabilities = await prisma.availability.findMany({
      where: {
        interviewerId: user.id,
        status: "AVAILABLE",
        startTime: { gte: todayUTC, lte: maxDateUTC },
      },
      orderBy: { startTime: "asc" },
    });

    // Group by date key so the frontend gets Record<string, {startTime, endTime}[]>
    const grouped = availabilities.reduce(
      (acc, slot) => {
        const key = slot.startTime.toISOString().slice(0, 10);
        if (!acc[key]) acc[key] = [];
        acc[key].push({
          startTime: slot.startTime.toISOString(),
          endTime: slot.endTime.toISOString(),
        });
        return acc;
      },
      {} as Record<string, { startTime: string; endTime: string }[]>
    );

    return grouped;
  } catch (err) {
    console.error("SOMETHING WENT WRONG GETTING AVAILABILITY", err);
    throw new Error("Something went wrong getting availability");
  }
};

export const getInterviewerAppointments = async() => {
    try {
        const {userId} = await auth()
        if(!userId) throw new Error("Unauthorized")
        
        const user = await prisma.user.findUnique({
            where: {
                clerkUserId: userId
            }
        })
        if(!user) throw new Error("User not found")
        if(user.role !== "INTERVIEWER") throw new Error("Only interviewers can get appointments")

        const appointments = await prisma.booking.findMany({
            where: {
                interviewerId: user.id
            },
            include: {
                interviewee: {
                    select: {
                        name: true,
                        imageUrl: true,
                        email: true,
                    }
                },
                feedback: true
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        return appointments
    }catch(err) {
        console.error("SOMETHING WENT WRONG GETTING APPOINTMENTS", err) 
        throw new Error("Something went wrong getting appointments")
    }
}

export const getInterviewerStats = async () => {
    try {
        const { userId } = await auth()
        if (!userId) throw new Error("Unauthorized")
        
        const user = await prisma.user.findUnique({
            where: {
                clerkUserId: userId
            },
            select: {
                creditBalance: true,
                sessionRates: {
                    select: {
                        duration: true,
                        credits: true
                    }
                },
                bookingsAsInterviewer: {
                    where: {
                        status: "COMPLETED"
                    },
                    select: {
                        creditsCharged: true
                    }
                }
            }
        })

        if (!user) throw new Error("User not found")

        const totalEarned = user.bookingsAsInterviewer.reduce(
            (acc, booking) => acc + booking.creditsCharged,
            0
        )

        // convert rates → easy object
        const ratesMap = user.sessionRates.reduce((acc, rate) => {
            acc[rate.duration] = rate.credits
            return acc
        }, {} as Record<number, number>)

        return {
            creditBalance: user.creditBalance,
            sessionRates: ratesMap,
            totalEarned,
            completedSessions: user.bookingsAsInterviewer.length
        }

    } catch (err) {
        console.error("SOMETHING WENT WRONG GETTING STATS", err) 
        throw new Error("Something went wrong getting stats")
    }
}

export const requestWithdrawal = async ({
  credits,
  paymentMethod,
  paymentDetail,
}: {
  credits: number;
  paymentMethod: string;
  paymentDetail: string;
}) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const req = await request();
  const rateLimitError = await checkRateLimit(withdrawalLimiter, req, user.id);
  if (rateLimitError) throw new Error(rateLimitError);

  const dbUser = await prisma.user.findUnique({ where: { clerkUserId: user.id } });
  if (!dbUser || dbUser.role !== "INTERVIEWER") throw new Error("Forbidden");

  if (!credits || credits <= 0) throw new Error("Invalid credit amount");
  if (credits > dbUser.creditBalance)
    throw new Error("Insufficient credit balance");
  if (!paymentMethod || !paymentDetail)
    throw new Error("Payment details required");

  const PLATFORM_FEE = 0.2;
  const netAmount = credits * (1 - PLATFORM_FEE) * 5;
  const platformFee = credits * PLATFORM_FEE * 5;

  try {
    const [payout] = await prisma.$transaction([
      prisma.payout.create({
        data: {
          interviewerId: dbUser.id,
          credits,
          platformFee,
          netAmount,
          paymentMethod,
          paymentDetail,
          status: "PROCESSING",
        },
      }),
      prisma.user.update({
        where: { id: dbUser.id },
        data: { creditBalance: { decrement: credits } },
      }),
    ]);

    // Fire admin email — non-blocking, failure won't affect the user
    try {
      const reviewUrl = `${process.env.NEXT_PUBLIC_APP_URL}/payout/${payout.id}`;
      const html = await render(
        WithdrawalRequestEmail({
          interviewerName: dbUser.name ?? "Unknown",
          interviewerEmail: dbUser.email,
          credits,
          platformFee,
          netAmount,
          paymentMethod,
          paymentDetail,
          reviewUrl,
        })
      );
      await resend.emails.send({
        from: "Prept <onboarding@resend.dev>",
        to: ADMIN_EMAIL,
        subject: `Withdrawal Request — ${dbUser.name} · ${credits} credits`,
        html,
      });
    } catch (emailErr) {
      console.error("Withdrawal email failed:", emailErr);
    }

    revalidatePath("/dashboard");
    return { success: true, netAmount };
  } catch (err) {
    console.error(err);
    throw new Error("Withdrawal request failed");
  }
};

export const getWithdrawalHistory = async() => {
    try {
        const {userId} = await auth()
        if(!userId) throw new Error("Unauthorized")
        
        const user = await prisma.user.findUnique({
            where: {
                clerkUserId: userId
            }
        })
        if(!user) throw new Error("User not found")
        if(user.role !== "INTERVIEWER") throw new Error("Only interviewers can get withdrawal history")

        const withdrawals = await prisma.payout.findMany({
            where: {
                interviewerId: user.id
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        return withdrawals
    }catch(err) {
        console.error("SOMETHING WENT WRONG GETTING WITHDRAWAL HISTORY", err) 
        throw new Error("Something went wrong getting withdrawal history")
    }
}

export const updateInterviewerProfile = async (data: any) => {
  try {
    const {userId} = await auth()
    if(!userId) throw new Error("Unauthorized")

    const user = await prisma.user.findUnique({
        where: {
            clerkUserId: userId
        }
    })
    if(!user) throw new Error("User not found")
    if(user.role !== "INTERVIEWER") throw new Error("Only interviewers can update profile")

    const {
      bio,
      title,
      company,
      yearsExp,
      categories,
      sessionRates
    } = data

    if(!bio || !title || !company || !yearsExp || !categories?.length || !sessionRates) throw new Error("Missing required fields")
    if (sessionRates[45] !== 1) throw new Error("45 min must be 1 credit")
    if (![1, 2, 3].includes(sessionRates[60])) throw new Error("60 min must be 1, 2, or 3 credits")
    if (![1, 2, 3, 4, 5].includes(sessionRates[90])) throw new Error("90 min must be 1–5 credits")

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: {
          id: user.id
        },
        data: {
          bio,
          title,
          company,
          yearsExp,
          categories
        }
      })

      const rates = [
        { duration: 45, credits: sessionRates[45] },
        { duration: 60, credits: sessionRates[60] },
        { duration: 90, credits: sessionRates[90] }
      ]

      for (const { duration, credits } of rates) {
        await tx.sessionRate.update({
          where: {
            userId_duration: {
              userId: user.id,
              duration
            }
          },
          data: {
            credits
          }
        })
      }
    })
    
    revalidatePath("/dashboard")
    return { success: true }
  }catch(err) {
    console.error("SOMETHING WENT WRONG UPDATING INTERVIEWER PROFILE", err)
    throw new Error("Something went wrong updating interviewer profile")
  }
}
