import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const tutorial = await prisma.tutorial.findUnique({ where: { id } });

    if (!tutorial) {
      return NextResponse.json({ error: "Tutorial not found" }, { status: 404 });
    }

    return NextResponse.json(tutorial);
  } catch (error) {
    console.error("GET /api/tutorials/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch tutorial" }, { status: 500 });
  }
}
