import { NextRequest, NextResponse } from "next/server";
import {
  getUserProfile,
  verifyTokenAndGetUser,
  updateUserProfile,
} from "@/lib/userService";

// GET /api/users/profile
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "No token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    // Verify token and get user UID
    const verifyResult = await verifyTokenAndGetUser(token);
    if (!verifyResult.success || !verifyResult.data?.firebaseUid) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Now fetch profile by UID
    const result = await getUserProfile(verifyResult.data.firebaseUid);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user: result.user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/users/profile
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "No token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const body = await request.json();

    // Verify Firebase token
    const verifyResult = await verifyTokenAndGetUser(token);
    if (!verifyResult.success || !verifyResult.data?.firebaseUid) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    // Update user profile in DB
    const result = await updateUserProfile(verifyResult.data.firebaseUid, body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, user: result.data });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
