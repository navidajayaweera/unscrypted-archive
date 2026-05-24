import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const [totalDocuments, totalSurvivors, totalSkills, sectors] = await Promise.all([
      prisma.knowledge.count(),
      prisma.survivor.count(),
      prisma.skill.count(),
      prisma.survivor.findMany({
        select: { sector: true },
        distinct: ["sector"],
      }),
    ]);

    return NextResponse.json({
      totalDocuments,
      totalSurvivors,
      totalSkills,
      activeSectors: sectors.length,
    });
  } catch (error) {
    console.error("GET /api/stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
