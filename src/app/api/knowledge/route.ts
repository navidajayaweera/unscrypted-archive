import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const tag = request.nextUrl.searchParams.get("tag");

    const knowledge = await prisma.knowledge.findMany({
      where: tag
        ? {
            tags: {
              contains: tag,
            },
          }
        : undefined,
      orderBy: { uploadedAt: "desc" },
    });

    return NextResponse.json(knowledge);
  } catch (error) {
    console.error("GET /api/knowledge error:", error);
    return NextResponse.json({ error: "Failed to fetch knowledge" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const title = formData.get("title")?.toString().trim();
    const description = formData.get("description")?.toString().trim() ?? "";
    const tags = formData.get("tags")?.toString().trim() ?? "";
    const file = formData.get("file");

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    let filePath = "";

    if (file instanceof File && file.size > 0) {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadsDir, { recursive: true });

      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const uniqueName = `${Date.now()}-${safeName}`;
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(path.join(uploadsDir, uniqueName), buffer);
      filePath = `/uploads/${uniqueName}`;
    }

    const knowledge = await prisma.knowledge.create({
      data: { title, description, filePath, tags },
    });

    return NextResponse.json(knowledge, { status: 201 });
  } catch (error) {
    console.error("POST /api/knowledge error:", error);
    return NextResponse.json({ error: "Failed to create knowledge" }, { status: 500 });
  }
}
