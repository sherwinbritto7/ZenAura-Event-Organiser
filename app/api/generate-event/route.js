import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const systemPrompt = `You are an event planning assistant. Generate event details based on the user's description.

CRITICAL: Return ONLY valid JSON with properly escaped strings. No newlines in string values - use spaces instead.

Return this exact JSON structure:
{
  "title": "Event title (catchy and professional, single line)",
  "description": "Detailed event description in a single paragraph. Use spaces instead of line breaks. Make it 2-3 sentences describing what attendees will learn and experience.",
  "category": "One of: tech, music, sports, art, food, business, health, education, gaming, networking, outdoor, community",
  "suggestedCapacity": 50,
  "suggestedTicketType": "free"
}

User's event idea: ${prompt}

Rules:
- Return ONLY the JSON object, no markdown, no explanation
- All string values must be on a single line with no line breaks
- Use spaces instead of \\n or line breaks in description
- Make title catchy and under 80 characters
- Description should be 2-3 sentences, informative, single paragraph
- suggestedTicketType should be either "free" or "paid"
`;

    try {
      const result = await model.generateContent(systemPrompt);
      const text = result.response.text();

      return NextResponse.json({ text, provider: "gemini" });
    } catch (geminiError) {
      console.error("Gemini failed, falling back:", geminiError);
    }

    // 2️⃣ Fallback to OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an expert event planner." },
        { role: "user", content: systemPrompt },
      ],
      temperature: 0.7,
    });

    return NextResponse.json({
      text: completion.choices[0].message.content,
      provider: "openai",
    });
  } catch (error) {
    console.error("Error generating event:", error);

    if (error.status === 429) {
      return NextResponse.json(
        { error: "AI quota exceeded. Please try again later." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate event" },
      { status: 500 }
    );
  }
}
