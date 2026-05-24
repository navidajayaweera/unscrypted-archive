import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET all survivors (with optional ?skill= filter)
export async function GET(req: NextRequest) {
  const skill = req.nextUrl.searchParams.get('skill')

  const survivors = await db.survivor.findMany({
    include: { skills: true },
    where: skill ? {
      skills: {
        some: { category: skill }
      }
    } : undefined
  })

  return NextResponse.json(survivors)
}

// POST register new survivor + skills
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, age, sector, skills } = body

  const survivor = await db.survivor.create({
    data: {
      name,
      age,
      sector,
      skills: {
        create: skills.map((s: { name: string; category: string }) => ({
          name: s.name,
          category: s.category
        }))
      }
    },
    include: { skills: true }
  })

  return NextResponse.json(survivor, { status: 201 })
}