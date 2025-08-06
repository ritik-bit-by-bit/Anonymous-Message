import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST() {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemma-3-1b-it' });

    const prompt = `
Generate exactly 3 short anonymous messages.
Return them in this format:
"Just thinking about you||Hope your day is good||Sending you a smile"
No line breaks, no bullet points, no labels like Message 1. Only use '||' to separate.
`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    let text = response.text().trim();

    console.log("Gemini raw response:", text);

    // Clean up labels like "Message 1||"
    text = text
      .replace(/Message\s*\d+\s*\|\|/gi, '')  // remove "Message 1||", "Message 2||", etc.
      .replace(/\n/g, ' ')                    // remove newlines
      .replace(/\s*\|\|\s*/g, '||')           // normalize separators
      .trim();

    // Ensure valid format
    if (!text.includes('||')) {
      return new NextResponse('Failed to parse stream string. No separator found.', { status: 500 });
    }

    return new NextResponse(text, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  } catch (error) {
    console.error("Suggest error:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
