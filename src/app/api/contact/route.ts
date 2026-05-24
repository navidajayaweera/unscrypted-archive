import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const VALID_SECTORS = ["governance", "health", "harvest", "signal"];
const VALID_TYPES = ["shelter", "medical", "supplies", "comms", "general"];

export async function GET(request: NextRequest) {
  try {
    const sector = request.nextUrl.searchParams.get("sector");
    const status = request.nextUrl.searchParams.get("status");

    const messages = await prisma.contactMessage.findMany({
      where: {
        ...(sector && VALID_SECTORS.includes(sector.toLowerCase())
          ? { sector: sector.toLowerCase() }
          : {}),
        ...(status ? { status: status.toLowerCase() } : {}),
      },
      orderBy: { submittedAt: "desc" },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("GET /api/contact error:", error);
    return NextResponse.json({ error: "Failed to fetch contact messages" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = body.name?.toString().trim();
    const sector = body.sector?.toString().trim().toLowerCase();
    const location = body.location?.toString().trim();
    const contactType = body.contactType?.toString().trim().toLowerCase();
    const message = body.message?.toString().trim();

    if (!name || !location || !message) {
      return NextResponse.json(
        { error: "Name, location, and message are required" },
        { status: 400 }
      );
    }

    if (!sector || !VALID_SECTORS.includes(sector)) {
      return NextResponse.json(
        { error: "Sector must be one of: governance, health, harvest, signal" },
        { status: 400 }
      );
    }

    if (!contactType || !VALID_TYPES.includes(contactType)) {
      return NextResponse.json(
        { error: "Contact type must be one of: shelter, medical, supplies, comms, general" },
        { status: 400 }
      );
    }

    const contact = await prisma.contactMessage.create({
      data: { name, sector, location, contactType, message },
    });

    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    console.error("POST /api/contact error:", error);
    return NextResponse.json({ error: "Failed to submit contact request" }, { status: 500 });
  }
}
