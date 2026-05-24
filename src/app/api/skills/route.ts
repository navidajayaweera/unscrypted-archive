import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET all skills (with optional ?category= filter)
export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get('category')

  const skills = await db.skill.findMany({
    where: category ? { category } : undefined
  })

  return NextResponse.json(skills)
}