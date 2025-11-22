// app/api/excerpt/route.ts
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

    const prompt = `Generate an SEO-friendly excerpt for a blog post.
Rules:
- 120 to 180 characters.
- 1 concise sentence.
- No quotes, no introduction, no extra text.
- Summarize the core value of the article.
Title: ${title}
Content: ${content}
Excerpt:`; // AI phải trả về đúng câu tóm tắt.

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        maxOutputTokens: 150,
        temperature: 0.4,
        topP: 0.8,
        topK: 40,
        stopSequences: ['\n'],
        thinkingConfig: { thinkingBudget: 0 },
      },
    });

    const generatedText = response.text;
    if (!generatedText) {
      return NextResponse.json({ error: 'No generated text' }, { status: 500 });
    }

    // Clean output
    const excerpt = generatedText.trim().replace(/^"+|"+$/g, '');

    return NextResponse.json({ excerpt }, { status: 200 });
  } catch (error) {
    console.error('Error generating excerpt:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
