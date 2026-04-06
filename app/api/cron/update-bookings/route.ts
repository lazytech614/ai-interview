import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Secure it so only Vercel can call it
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();

  const result = await prisma.booking.updateMany({
    where: {
      endTime: { lt: now },
      status: { notIn: ["COMPLETED", "CANCELLED", "EXPIRED"] },
    },
    data: {
      status: "EXPIRED",
    },
  });

  return NextResponse.json({
    success: true,
    expiredCount: result.count,
    timestamp: now.toISOString(),
  });
}