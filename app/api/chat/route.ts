import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { message } = await req.json();

  const apiKey = process.env.LANGDB_API_KEY;
  const projectId = process.env.LANGDB_PROJECT_ID;

  console.log("Using Project ID:", projectId);

  if (!apiKey || !projectId) {
    return NextResponse.json(
      { reply: "API Key or Project ID is not configured." },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      "https://api.us-east-1.langdb.ai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "x-project-id": projectId,
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: message }
          ],
          max_tokens: 150,
          temperature: 0.7,
        }),
      }
    );

    const text = await response.text();
    console.log("AI API raw response:", text);

    if (!response.ok) {
      return NextResponse.json(
        { reply: `AI API error: ${response.statusText}`, raw: text },
        { status: response.status }
      );
    }

    const data = JSON.parse(text);
    const reply =
      data?.choices?.[0]?.message?.content || "Sorry, I didn’t get that.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { reply: "Error connecting to AI." },
      { status: 500 }
    );
  }
}
