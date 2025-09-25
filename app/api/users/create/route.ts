import { NextRequest, NextResponse } from "next/server";

import { createOrGetUser } from "@/lib/userService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firebaseToken } = body;

    if (!firebaseToken) {
      return NextResponse.json(
        { error: "Firebase token is required" },
        { status: 400 }
      );
    }

    const result = await createOrGetUser(firebaseToken);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Error creating/getting user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
