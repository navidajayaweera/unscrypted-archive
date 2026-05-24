import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET all documents (with optional ?tag= filter)
export async function GET(req: NextRequest) {
  const tag = req.nextUrl.searchParams.get('tag')

  let query = supabase.from('knowledge').select('*')

  if (tag) {
    query = query.ilike('tags', `%${tag}%`)
  }

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}

// POST upload new document
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { title, description, filePath, tags } = body

  const { data, error } = await supabase
    .from('knowledge')
    .insert([{ title, description, filePath, tags }])
    .select()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data[0], { status: 201 })
}