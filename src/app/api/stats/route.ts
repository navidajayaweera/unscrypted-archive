import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const [
      totalDocuments,
      totalSurvivors,
      totalSkills,
      totalShelters,
      totalTutorials,
      recentDocuments,
      recentSurvivors,
    ] = await Promise.all([
      prisma.knowledge.count(),
      prisma.survivor.count(),
      prisma.skill.count(),
      prisma.shelterLocation.count(),
      prisma.tutorial.count(),
      prisma.knowledge.findMany({
        orderBy: { uploadedAt: "desc" },
        take: 5,
      }),
      prisma.survivor.findMany({
        orderBy: { registeredAt: "desc" },
        take: 5,
        include: { skills: true },
      }),
    ]);

    return NextResponse.json({
      totalDocuments,
      totalSurvivors,
      totalSkills,
      totalShelters,
      totalTutorials,
      recentDocuments,
      recentSurvivors,
    });
  } catch (error) {
    console.error("GET /api/stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
