"use client";

import { auth } from "./firebase";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";

let recaptchaVerifier: RecaptchaVerifier | null = null;

export const setupRecaptcha = (elementId: string) => {
  if (!auth) {
    throw new Error("Firebase auth is not initialized.");
  }
  if (!recaptchaVerifier) {
    recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
      size: "invisible", // or 'normal' if you want visible captcha
      callback: () => console.log("Recaptcha verified"),
    });
  }
  return recaptchaVerifier;
};

export const sendOTP = async (phone: string): Promise<ConfirmationResult> => {
  if (!auth) {
    throw new Error("Firebase auth is not initialized.");
  }
  const appVerifier = setupRecaptcha("recaptcha-container");
  return signInWithPhoneNumber(auth, phone, appVerifier);
};
