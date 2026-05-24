import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const category = request.nextUrl.searchParams.get("category");

    const tutorials = await prisma.tutorial.findMany({
      where: category ? { category: category.toLowerCase() } : undefined,
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

    const tutorial = await prisma.tutorial.create({
      data: { title, category, content, difficulty },
    });

    return NextResponse.json(tutorial, { status: 201 });
  } catch (error) {
    console.error("POST /api/tutorials error:", error);
    return NextResponse.json({ error: "Failed to create tutorial" }, { status: 500 });
  }
}
