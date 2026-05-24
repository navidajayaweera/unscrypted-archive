import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const category = request.nextUrl.searchParams.get("category");

    const skills = await prisma.skill.findMany({
      where: category
        ? {
            category: category.toLowerCase(),
          }
        : undefined,
      include: {
        survivor: {
          select: { id: true, name: true, sector: true },
        },
      },
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });

    return NextResponse.json(skills);
  } catch (error) {
    console.error("GET /api/skills error:", error);
    return NextResponse.json({ error: "Failed to fetch skills" }, { status: 500 });
  }
}
