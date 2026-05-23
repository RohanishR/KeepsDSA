import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';

// In-memory rate limiting map (IP -> { count, timestamp })
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 15; // Max 15 requests per minute

// Set a long timeout for AI generation
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate Limiting
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const now = Date.now();
    if (rateLimitMap.has(ip)) {
      const data = rateLimitMap.get(ip)!;
      if (now - data.timestamp < RATE_LIMIT_WINDOW) {
        if (data.count >= MAX_REQUESTS) {
          return NextResponse.json({ error: 'Rate limit exceeded. Please wait a minute.' }, { status: 429 });
        }
        data.count++;
      } else {
        rateLimitMap.set(ip, { count: 1, timestamp: now });
      }
    } else {
      rateLimitMap.set(ip, { count: 1, timestamp: now });
    }

    const { messages, data } = await req.json();
    const { codeContext, problemTitle, problemDescription } = data || {};

    const systemPrompt = `You are a world-class Data Structures and Algorithms (DSA) tutor and expert coding assistant.
Your goal is to help the user understand the problem, analyze complexity, and improve their code.

Context:
- Problem: ${problemTitle}
- Description: ${problemDescription ? problemDescription.substring(0, 1500) + '...' : 'Not provided'}
- User's Current Code:
\`\`\`
${codeContext || 'No code provided yet.'}
\`\`\`

Instructions:
1. Provide concise, structured explanations. Use markdown headers, bold text, and bullet points.
2. When analyzing complexity, explicitly state Time Complexity (O(X)) and Space Complexity (O(Y)) with a brief justification.
3. If comparing solutions, highlight the trade-offs (e.g., readability vs. performance).
4. Be encouraging but precise. Do not provide the full optimal code unprompted unless they explicitly ask for it. Prefer giving hints to guide them.
5. Format code blocks clearly.
`;

    // The user explicitly requested gemini-3.5-flash. Note: If the API rejects this model string, 
    // it will throw an error, which is caught below.
    const result = await streamText({
      model: google('gemini-2.5-flash'),
      system: systemPrompt,
      messages,
      temperature: 0.2, // Low temperature for more deterministic coding answers
    });

    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error('Chat API Error:', error);
    
    // Return the actual error message for easier debugging
    return NextResponse.json({ 
      error: error.message || 'Failed to generate AI response. Please check your API key.' 
    }, { status: 500 });
  }
}
