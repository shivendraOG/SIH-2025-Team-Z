import ChatBot from "../components/ChatBot";
import "./globals.css";
import { AuthProvider } from "@/context/authContext";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Gamified Learning Platform",
  description: "Learning made fun, for every child, everywhere.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
        <ChatBot />
      </body>
    </html>
  );
}
