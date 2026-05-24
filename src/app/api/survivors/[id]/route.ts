import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET one survivor with all skills
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const survivor = await db.survivor.findUnique({
    where: { id: params.id },
    include: { skills: true }
  })

  if (!survivor) return NextResponse.json({ error: 'Survivor not found' }, { status: 404 })

  return NextResponse.json(survivor)
}