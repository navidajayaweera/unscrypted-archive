import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { supabase } from '@/lib/supabase'

export async function GET() {
  // Get counts from SQLite
  const [totalSurvivors, totalSkills, totalShelters, totalTutorials] = await Promise.all([
    db.survivor.count(),
    db.skill.count(),
    db.shelterLocation.count(),
    db.tutorial.count()
  ])

  // Get recent survivors from SQLite
  const recentSurvivors = await db.survivor.findMany({
    take: 5,
    orderBy: { registeredAt: 'desc' },
    include: { skills: true }
  })

  // Get knowledge count + recent from Supabase
  const { data: knowledgeData } = await supabase
    .from('knowledge')
    .select('*')
    .order('uploadedAt', { ascending: false })
    .limit(5)

  const { count: totalDocuments } = await supabase
    .from('knowledge')
    .select('*', { count: 'exact', head: true })

  return NextResponse.json({
    totalDocuments: totalDocuments ?? 0,
    totalSurvivors,
    totalSkills,
    totalShelters,
    totalTutorials,
    recentDocuments: knowledgeData ?? [],
    recentSurvivors
  })
}