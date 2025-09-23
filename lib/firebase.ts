import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase app safely
const app = typeof window !== "undefined"
  ? getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

// Singleton auth instance (can be null on SSR)
export const auth: Auth | null = typeof window !== "undefined" && app ? getAuth(app) : null;

// Getter function (lazy, always browser-safe)
export const getAuthInstance = (): Auth | null => {
  if (typeof window === "undefined") return null; // SSR safety
  const appInstance = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  return getAuth(appInstance);
};
