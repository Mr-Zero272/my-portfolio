// app/api/keywords/route.ts
import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, title } = body;

    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid content' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const prompt = `Extract up to 10 relevant keywords or phrases from the following blog post content and title. Return them as a comma-separated list without any additional text.
Title: ${title}
Content: ${content}
Keywords:`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        maxOutputTokens: 200, // Tăng lên để an toàn, tránh MAX_TOKENS
        temperature: 0.2,
        topP: 0.8,
        topK: 40,
        stopSequences: ['\n'],
        thinkingConfig: {
          // Disable thinking để tiết kiệm token và tránh output dài dòng
          thinkingBudget: 0,
        },
      },
    });

    // Extract text từ response (SDK tự động parse từ candidates[0].content.parts[0].text)
    const generatedText = response.text;
    if (!generatedText) {
      return NextResponse.json({ error: 'No generated text' }, { status: 500 });
    }

    // Parse thành array keywords (trim spaces)
    const keywords = generatedText
      .split(',')
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    return NextResponse.json({ keywords }, { status: 200 });
  } catch (error) {
    console.error('Error generating keywords:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
