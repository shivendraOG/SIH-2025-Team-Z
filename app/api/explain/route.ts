import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { paragraph } = await request.json();
    if (!paragraph || typeof paragraph !== "string") {
      return NextResponse.json(
        { success: false, message: "No paragraph provided." },
        { status: 400 }
      );
    }

    // Call OpenAI API (replace with your API key and endpoint)
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { success: false, message: "OpenAI API key not set." },
        { status: 500 }
      );
    }

    const openaiRes = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are a helpful assistant that explains book paragraphs in simple terms.",
            },
            { role: "user", content: `Explain this paragraph: ${paragraph}` },
          ],
          max_tokens: 300,
        }),
      }
    );

    const result = await openaiRes.json();
    const explanation = result.choices?.[0]?.message?.content;
    if (!explanation) {
      return NextResponse.json(
        { success: false, message: "Failed to get explanation from AI." },
        { status: 500 }
      );
    }
    return NextResponse.json({ success: true, explanation });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
