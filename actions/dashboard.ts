"use server";

import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { render } from "@react-email/render";
import { createRateLimitor, checkRateLimit } from "@/lib/arcjet";
import { request } from "@arcjet/next";
import { WithdrawalRequestEmail } from "@/emails/WithdrawalRequestEmail";

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = "derupanjan2021@gmail.com";

const withdrawalLimiter = createRateLimitor({
  refillRate: 1,
  interval: "1h",
  capacity: 3,
});

export const setAvailability = async({startTime, endTime}: any) => {
    try {
        const {userId} = await auth()
        if(!userId) throw new Error("Unauthorized")
        
        const user = await prisma.user.findUnique({
            where: {
                clerkUserId: userId
            }
        })
        if(!user) throw new Error("User not found")
        if(user.role !== "INTERVIEWER") throw new Error("Only interviewers can set availability")

        if(!startTime || !endTime) throw new Error("Missing required fields")

        if(new Date(startTime) > new Date(endTime)) throw new Error("Start time must be before end time")
        
        const existing = await prisma.availability.findFirst({
            where: {
                interviewerId: user.id,
                status: "AVAILABLE"
            }
        })

        if(existing) {
            await prisma.availability.update({
                where: {
                    id: existing.id
                },
                data: {
                    startTime: new Date(startTime),
                    endTime: new Date(endTime)
                }
            })
        }else {
            await prisma.availability.create({
                data: {
                    interviewerId: user.id,
                    startTime: new Date(startTime),
                    endTime: new Date(endTime),
                    status: "AVAILABLE"
                }
            })
        }

        revalidatePath("/dashboard")
        return {success: true}
    }catch(err) {
        console.error("SOMETHING WENT WRONG SETTING AVAILABILITY", err)
        throw new Error("Something went wrong setting availability")
    }
}

export const getAvailability = async() => {
    try {
        const {userId} = await auth()
        if(!userId) throw new Error("Unauthorized")
        
        const user = await prisma.user.findUnique({
            where: {
                clerkUserId: userId
            }
        })
        if(!user) throw new Error("User not found")
        if(user.role !== "INTERVIEWER") throw new Error("Only interviewers can get availability")

        const availability = await prisma.availability.findFirst({
            where: {
                interviewerId: user.id,
                status: "AVAILABLE"
            }
        })

        return availability
    }catch(err) {
        console.error("SOMETHING WENT WRONG GETTING AVAILABILITY", err) 
        throw new Error("Something went wrong getting availability")
    }
}

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

export const getInterviewerStats = async() => {
    try {
        const {userId} = await auth()
        if(!userId) throw new Error("Unauthorized")
        
        const user = await prisma.user.findUnique({
            where: {
                clerkUserId: userId
            },
            select: {
                creditBalance: true,
                creditRate: true,
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
        if(!user) throw new Error("User not found")

        const totalEarned = user.bookingsAsInterviewer.reduce((acc, booking) => acc + booking.creditsCharged, 0)
        
        return {
            creditBalance: user.creditBalance,
            creditRate: user.creditRate,
            totalEarned,
            compltedSessions: user.bookingsAsInterviewer.length
        }
    }catch(err) {
        console.error("SOMETHING WENT WRONG GETTING STATS", err) 
        throw new Error("Something went wrong getting stats")
    }
}

export const requestWithdrawal = async ({
  credits,
  paymentMethod,
  paymentDetail,
}: any) => {
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
