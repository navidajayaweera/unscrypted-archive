import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const shelter = await prisma.shelterLocation.findUnique({ where: { id } });

    if (!shelter) {
      return NextResponse.json({ error: "Shelter not found" }, { status: 404 });
    }

    return NextResponse.json(shelter);
  } catch (error) {
    console.error("GET /api/shelters/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch shelter" }, { status: 500 });
  }
}
