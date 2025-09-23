// app/api/users/minigames/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Example mini-games data
    const miniGames = [
      {
        id: 1,
        title: "Math Challenge",
        color: "from-indigo-500 to-purple-500",
        icon: "🧮",
        players: 120,
      },
      {
        id: 2,
        title: "Word Puzzle",
        color: "from-green-400 to-teal-500",
        icon: "🧩",
        players: 85,
      },
      {
        id: 3,
        title: "Memory Match",
        color: "from-yellow-400 to-orange-500",
        icon: "🃏",
        players: 60,
      },
      {
        id: 4,
        title: "Reaction Test",
        color: "from-pink-400 to-red-500",
        icon: "⚡",
        players: 42,
      },
    ];

    return NextResponse.json({ success: true, miniGames });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch mini games",
    });
  }
}
