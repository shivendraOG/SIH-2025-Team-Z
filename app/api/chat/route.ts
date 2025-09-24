import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { message } = await req.json();

  try {
    const response = await fetch(
      "https://api.us-east-1.langdb.ai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.LANGDB_API_KEY}`,
          "X-Project-Id": process.env.LANGDB_PROJECT_ID || "",
        },
        body: JSON.stringify({
          model: "gpt-4o", // Replace with your desired model ID
          messages: [{ role: "user", content: message }],
          max_tokens: 128, // Add max_tokens if required by API
          temperature: 0.7, // Add temperature if required by API
        }),
      }
    );

    const text = await response.text(); // Read response as text first
    console.log("Raw Response:", text);

    if (!text) {
      return NextResponse.json({ reply: "No response from AI." }, { status: 500 });
    }

    const data = JSON.parse(text); // Parse JSON safely
    const reply =
      data?.choices?.[0]?.message?.content ||
      "Sorry, I didn’t get that.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { reply: "Error connecting to AI." },
      { status: 500 }
    );
  }
}
