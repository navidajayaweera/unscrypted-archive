import { NextRequest, NextResponse } from "next/server";
import { callArchiveAI, isArchiveAIConfigured } from "@/lib/archive-ai";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(request: NextRequest) {
  try {
    if (!isArchiveAIConfigured()) {
      return NextResponse.json(
        {
          error:
            "Archive AI is offline — set OPENAI_API_KEY in your .env file",
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    const messages = body.messages as ChatMessage[] | undefined;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 });
    }

    const sanitized = messages
      .filter(
        (m) =>
          m &&
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string" &&
          m.content.trim()
      )
      .slice(-20)
      .map((m) => ({
        role: m.role,
        content: m.content.trim().slice(0, 4000),
      }));

    if (sanitized.length === 0 || sanitized[sanitized.length - 1].role !== "user") {
      return NextResponse.json({ error: "Last message must be from the user" }, { status: 400 });
    }

    const reply = await callArchiveAI(sanitized);
    return NextResponse.json({ reply });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Archive AI relay error";
    console.error("POST /api/chat error:", error);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
