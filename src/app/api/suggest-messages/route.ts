import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

// Only require dotenv if we are in a Node.js environment, not in edge runtime
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 400,
    });

    // Fetch the completion message from the response
    const message = response.choices[0]?.message?.content;

    if (!message) {
      return new NextResponse('No response from OpenAI', { status: 500 });
    }

    return new NextResponse(message);
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
  }
}
