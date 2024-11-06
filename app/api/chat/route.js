// This API route handles server-side interactions for OpenAI API
// receives requests from frontend, and returns responses
// keeps the API key and SDK calls server-side

import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI();

export async function POST(request) {
  try {
    // parse the incoming request body
    const { prompt } = await request.json();

    // Check if a prompt is provided
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Call the OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 50,
    });
    console.log(response);

    // Respond with the completion data
    return NextResponse.json({ result: response.choices[0].message.content });
  } catch (error) {
    // Handle any errors from the API call
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}