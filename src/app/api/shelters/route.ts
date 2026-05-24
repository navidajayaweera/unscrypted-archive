import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const shelters = await prisma.shelterLocation.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(shelters);
  } catch (error) {
    console.error("GET /api/shelters error:", error);
    return NextResponse.json({ error: "Failed to fetch shelters" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = body.name?.toString().trim();
    const description = body.description?.toString().trim() ?? "";
    const lat = Number(body.lat);
    const lng = Number(body.lng);
    const capacity = Number(body.capacity);
    const status = body.status?.toString().trim() ?? "active";

    if (!name || Number.isNaN(lat) || Number.isNaN(lng) || Number.isNaN(capacity)) {
      return NextResponse.json(
        { error: "Name, lat, lng, and capacity are required" },
        { status: 400 }
      );
    }

    const shelter = await prisma.shelterLocation.create({
      data: { name, description, lat, lng, capacity, status },
    });

    return NextResponse.json(shelter, { status: 201 });
  } catch (error) {
    console.error("POST /api/shelters error:", error);
    return NextResponse.json({ error: "Failed to create shelter" }, { status: 500 });
  }
}
