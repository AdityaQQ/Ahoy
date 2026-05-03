import Groq from "groq-sdk";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const { query, username, tier, score, archetype, top_language, strengths, weaknesses } = await req.json();

  if (!process.env.GROQ_API_KEY) {
    return new Response("GROQ_API_KEY not configured.", { status: 503 });
  }

  const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const stream = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: 400,
    temperature: 0.5,
    stream: true,
    messages: [
      {
        role: "system",
        content: `You are an elite developer career coach inside Ahoy, a GitHub intelligence platform.
You are advising ${username}, a ${tier}-tier developer (score: ${score}/100).
Archetype: ${archetype}. Primary language: ${top_language}.
Strengths: ${(strengths as string[])?.join(", ")}.
Gaps: ${(weaknesses as string[])?.join(", ")}.
Respond with specific numbered advice. Max 200 words. Use → for bullets. No markdown, no asterisks.`,
      },
      { role: "user", content: query },
    ],
  });

  const enc = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content ?? "";
        if (text) controller.enqueue(enc.encode(`data: ${text}\n\n`));
      }
      controller.enqueue(enc.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" },
  });
}
