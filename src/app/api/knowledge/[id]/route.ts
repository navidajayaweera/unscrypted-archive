import { NextRequest, NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/db";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const knowledge = await prisma.knowledge.findUnique({ where: { id } });

    if (!knowledge) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    return NextResponse.json(knowledge);
  } catch (error) {
    console.error("GET /api/knowledge/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch document" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const knowledge = await prisma.knowledge.findUnique({ where: { id } });

    if (!knowledge) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    if (knowledge.filePath) {
      const filePath = path.join(process.cwd(), "public", knowledge.filePath.replace(/^\//, ""));
      try {
        await unlink(filePath);
      } catch {
        // File may already be missing
      }
    }

    await prisma.knowledge.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/knowledge/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete document" }, { status: 500 });
  }
}
