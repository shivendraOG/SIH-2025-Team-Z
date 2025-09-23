import { NextRequest, NextResponse } from "next/server";
import { verifyTokenAndGetUser, updateUserProfile } from "@/lib/userService";

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) return NextResponse.json({ success: false, message: "No token" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    const { xp } = await request.json();

    const userRes = await verifyTokenAndGetUser(token);
    if (!userRes.success || !userRes.user) return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });

    const currentUser = userRes.user;
    await updateUserProfile(currentUser.firebaseUid, { xp: (currentUser.xp || 0) + xp });

    return NextResponse.json({ success: true, newXp: (currentUser.xp || 0) + xp });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
