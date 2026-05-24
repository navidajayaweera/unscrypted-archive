import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET all survivors (with optional ?skill= filter)
export async function GET(req: NextRequest) {
  try {
    const skill = req.nextUrl.searchParams.get('skill')

    const survivors = await prisma.survivor.findMany({
      include: { skills: true },
      where: skill
        ? { skills: { some: { category: skill } } }
        : undefined,
      orderBy: { registeredAt: 'desc' },
    })

    return NextResponse.json(survivors)
  } catch (error) {
    console.error('GET /api/survivors error:', error)
    return NextResponse.json({ error: 'Failed to fetch survivors' }, { status: 500 })
  }
}

// POST register new survivor + skills
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, age, sector, skills } = body

    if (!name || !age || !sector) {
      return NextResponse.json({ error: 'Name, age, and sector are required' }, { status: 400 })
    }

    const survivor = await prisma.survivor.create({
      data: {
        name,
        age: Number(age),
        sector,
        skills: {
          create: (skills ?? []).map((s: { name: string; category: string }) => ({
            name: s.name,
            category: s.category,
          })),
        },
      },
      include: { skills: true },
    })

    return NextResponse.json(survivor, { status: 201 })
  } catch (error) {
    console.error('POST /api/survivors error:', error)
    return NextResponse.json({ error: 'Failed to register survivor' }, { status: 500 })
  }
}
