"use server";

import { PrismaClient } from "@prisma/client";
import { admin } from "./fireBaseAdmin"; // default import

// Singleton PrismaClient
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};
const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

interface ProfileData {
  fullName?: string;
  email?: string;
  dateOfBirth?: string;
  gender?: string;
  schoolName?: string;
  className?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  fatherName?: string;
  motherName?: string;
}

interface ServiceResponse<T = any> {
  success: boolean;
  message?: string;
  user?: T;
  data?: T;
}

// ------------------- USER FUNCTIONS ------------------- //

// Create or get user after Firebase OTP verification
export async function createOrGetUser(
  firebaseToken: string
): Promise<ServiceResponse> {
  try {
    console.log("Received firebaseToken:", firebaseToken);
    const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
    console.log("Decoded token:", decodedToken);
    const { uid, phone_number } = decodedToken;

    if (!phone_number)
      throw new Error("Phone number not found in Firebase token");

    let user = await prisma.user.findUnique({ where: { firebaseUid: uid } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          firebaseUid: uid,
          phone: phone_number,
          isVerified: true,
          lastLoginAt: new Date(),
        },
      });
    } else {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });
    }

    await createUserSession(user.id, firebaseToken, decodedToken.exp);

    return { success: true, user };
  } catch (error: any) {
    console.error("Error creating/getting user:", error);
    return {
      success: false,
      message: error.message || "Failed to authenticate user",
    };
  }
}

// Create user session
export async function createUserSession(
  userId: string,
  firebaseToken: string,
  expiresAt: number
) {
  await prisma.userSession.updateMany({
    where: { userId, isActive: true },
    data: { isActive: false },
  });

  return prisma.userSession.create({
    data: {
      userId,
      firebaseToken,
      expiresAt: new Date(expiresAt * 1000),
      isActive: true,
    },
  });
}

// Update user profile
export async function updateUserProfile(
  firebaseUid: string,
  profileData: ProfileData
): Promise<ServiceResponse> {
  try {
    const {
      fullName,
      email,
      dateOfBirth,
      gender,
      schoolName,
      className,
      address,
      city,
      state,
      pincode,
      fatherName,
      motherName,
    } = profileData;

    if (!fullName || !email)
      return { success: false, message: "Full name and email are required" };

    const existingUser = await prisma.user.findFirst({
      where: { email, firebaseUid: { not: firebaseUid } },
    });

    if (existingUser)
      return { success: false, message: "Email already registered" };

    const updatedUser = await prisma.user.update({
      where: { firebaseUid },
      data: {
        fullName,
        email,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        gender,
        schoolName,
        className,
        address,
        city,
        state,
        pincode,
        fatherName,
        motherName,
        isProfileComplete: true,
      },
    });

    return {
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    };
  } catch (error: any) {
    console.error("Error updating user profile:", error);
    return {
      success: false,
      message: error.message || "Failed to update profile",
    };
  }
}

// Get user profile by Firebase UID
export async function getUserProfile(
  firebaseUid: string
): Promise<ServiceResponse> {
  try {
    const user = await prisma.user.findUnique({ where: { firebaseUid } });
    if (!user) return { success: false, message: "User not found" };
    return { success: true, user };
  } catch (error: any) {
    console.error("Error getting user profile:", error);
    return {
      success: false,
      message: error.message || "Failed to get user profile",
    };
  }
}

// Verify Firebase token and get user
export async function verifyTokenAndGetUser(
  firebaseToken: string
): Promise<ServiceResponse> {
  try {
    const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
    const result = await getUserProfile(decodedToken.uid);
    if (!result.success) return result;

    const session = await prisma.userSession.findFirst({
      where: { firebaseToken, isActive: true, expiresAt: { gt: new Date() } },
    });

    if (!session)
      return { success: false, message: "Session expired or invalid" };

    return {
      success: true,
      user: result.user,
      data: { firebaseUid: decodedToken.uid },
    };
  } catch (error: any) {
    console.error("Error verifying token:", error);
    return { success: false, message: "Invalid or expired token" };
  }
}

// Logout user
export async function logout(firebaseToken: string): Promise<ServiceResponse> {
  try {
    await prisma.userSession.updateMany({
      where: { firebaseToken },
      data: { isActive: false },
    });
    return { success: true, message: "Logged out successfully" };
  } catch (error: any) {
    console.error("Error logging out user:", error);
    return { success: false, message: error.message || "Failed to logout" };
  }
}

// Delete user account
export async function deleteUser(
  firebaseUid: string
): Promise<ServiceResponse> {
  try {
    await admin.auth().deleteUser(firebaseUid);
    await prisma.user.delete({ where: { firebaseUid } });
    return { success: true, message: "Account deleted successfully" };
  } catch (error: any) {
    console.error("Error deleting user:", error);
    return {
      success: false,
      message: error.message || "Failed to delete account",
    };
  }
}
