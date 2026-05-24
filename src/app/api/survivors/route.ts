import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const skill = request.nextUrl.searchParams.get("skill");

    const survivors = await prisma.survivor.findMany({
      where: skill
        ? {
            skills: {
              some: {
                category: skill.toLowerCase(),
              },
            },
          }
        : undefined,
      include: { skills: true },
      orderBy: { registeredAt: "desc" },
    });

    return NextResponse.json(survivors);
  } catch (error) {
    console.error("GET /api/survivors error:", error);
    return NextResponse.json({ error: "Failed to fetch survivors" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = body.name?.toString().trim();
    const age = Number(body.age);
    const sector = body.sector?.toString().trim();
    const skills = Array.isArray(body.skills) ? body.skills : [];

    if (!name || !sector || Number.isNaN(age)) {
      return NextResponse.json(
        { error: "Name, age, and sector are required" },
        { status: 400 }
      );
    }

    const survivor = await prisma.survivor.create({
      data: {
        name,
        age,
        sector,
        skills: {
          create: skills.map((s: { name?: string; category?: string }) => ({
            name: s.name?.toString().trim() ?? "Unknown",
            category: s.category?.toString().trim().toLowerCase() ?? "tech",
          })),
        },
      },
      include: { skills: true },
    });

    return NextResponse.json(survivor, { status: 201 });
  } catch (error) {
    console.error("POST /api/survivors error:", error);
    return NextResponse.json({ error: "Failed to register survivor" }, { status: 500 });
  }
}
