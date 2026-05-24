import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET all skills (with optional ?category= filter)
export async function GET(req: NextRequest) {
  try {
    const category = req.nextUrl.searchParams.get('category')

    const skills = await prisma.skill.findMany({
      where: category ? { category } : undefined,
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(skills)
  } catch (error) {
    console.error('GET /api/skills error:', error)
    return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 })
  }
}
