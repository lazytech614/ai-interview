"use server";

import prisma from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;

export async function submitSuggestion({
  type,
  message,
  page,
  userId,
}: {
  type: "BUG" | "FEATURE" | "OTHER";
  message: string;
  page?: string;
  userId?: string;
}) {
  try {
    let userEmail: string | undefined;
    if (userId) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      userEmail = user?.email ?? undefined;
    }

    if (!message.trim()) throw new Error("Message cannot be empty");

    await prisma.suggestions.create({
        data: { 
            type, 
            message, 
            page, 
            userId: userId ? String(userId) : null 
        },
    });

    try {
        const result = await resend.emails.send({
            from: "Prept <onboarding@resend.dev>",
            to: ADMIN_EMAIL,
            subject: `[Feedback] New ${type} report`,
            html: `
                <p><strong>Type:</strong> ${type}</p>
                <p><strong>From:</strong> ${userEmail ?? "anonymous"} (User ID: ${userId ?? "unknown"})</p>
                <p><strong>Page:</strong> ${page ?? "unknown"}</p>
                <p><strong>Message:</strong><br/>${message}</p>
            `,
        });

        if (result.error) {
            console.error("Resend error:", result.error);
            throw new Error(result.error.message);
        }
    }catch(err) {
        console.error("SOMETHING WENT WRONG SENDING EMAIL", err)
        throw new Error("Something went wrong sending email")
    }

    return { success: true };
  }catch(err) {
    console.error("SOMETHING WENT WRONG SUBMITTING SUGGESTION", err)
    throw new Error("Something went wrong submitting suggestion")
  }
}