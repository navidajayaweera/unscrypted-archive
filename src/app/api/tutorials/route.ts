import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const TUTORIAL_CATEGORIES = ["first-aid", "survival", "shelter", "food", "defense"] as const;
const TUTORIAL_DIFFICULTIES = ["beginner", "intermediate", "advanced"] as const;

export async function GET(request: NextRequest) {
  try {
    const category = request.nextUrl.searchParams.get("category")?.toLowerCase();

    if (category && !TUTORIAL_CATEGORIES.includes(category as (typeof TUTORIAL_CATEGORIES)[number])) {
      return NextResponse.json(
        { error: "Invalid category. Use first-aid, survival, shelter, food, or defense" },
        { status: 400 }
      );
    }

    const tutorials = await prisma.tutorial.findMany({
      where: category ? { category } : undefined,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(tutorials);
  } catch (error) {
    console.error("GET /api/tutorials error:", error);
    return NextResponse.json({ error: "Failed to fetch tutorials" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const title = body.title?.toString().trim();
    const category = body.category?.toString().trim().toLowerCase();
    const content = body.content?.toString().trim() ?? "";
    const difficulty = body.difficulty?.toString().trim().toLowerCase() ?? "beginner";

    if (!title || !category || !content) {
      return NextResponse.json(
        { error: "Title, category, and content are required" },
        { status: 400 }
      );
    }

    if (!TUTORIAL_CATEGORIES.includes(category as (typeof TUTORIAL_CATEGORIES)[number])) {
      return NextResponse.json(
        { error: "Category must be first-aid, survival, shelter, food, or defense" },
        { status: 400 }
      );
    }

    if (!TUTORIAL_DIFFICULTIES.includes(difficulty as (typeof TUTORIAL_DIFFICULTIES)[number])) {
      return NextResponse.json(
        { error: "Difficulty must be beginner, intermediate, or advanced" },
        { status: 400 }
      );
    }

    const tutorial = await prisma.tutorial.create({
      data: { title, category, content, difficulty },
    });

    return NextResponse.json(tutorial, { status: 201 });
  } catch (error) {
    console.error("POST /api/tutorials error:", error);
    return NextResponse.json({ error: "Failed to create tutorial" }, { status: 500 });
  }
}
