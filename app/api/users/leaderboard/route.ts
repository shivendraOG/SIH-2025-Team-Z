import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const topUsers = await prisma.user.findMany({
      orderBy: { points: "desc" },
      take: 10,
      select: { fullName: true, points: true, id: true },
    });

    return NextResponse.json({ success: true, leaderboard: topUsers });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Failed to fetch leaderboard" }, { status: 500 });
  }
}
