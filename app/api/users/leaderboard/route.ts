import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const topUsers = await prisma.user.findMany({
      // Adjust the ordering field to an existing one (e.g., createdAt) since 'points' does not exist.
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { fullName: true, id: true },
    });

    return NextResponse.json({ success: true, leaderboard: topUsers });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Failed to fetch leaderboard" }, { status: 500 });
  }
}
