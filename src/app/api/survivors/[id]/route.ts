import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

type RouteContext = { params: Promise<{ id: string }> }

// GET one survivor with all skills
export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params

    const survivor = await prisma.survivor.findUnique({
      where: { id },
      include: { skills: true },
    })

    if (!survivor) {
      return NextResponse.json({ error: 'Survivor not found' }, { status: 404 })
    }

    return NextResponse.json(survivor)
  } catch (error) {
    console.error('GET /api/survivors/[id] error:', error)
    return NextResponse.json({ error: 'Failed to fetch survivor' }, { status: 500 })
  }
}
