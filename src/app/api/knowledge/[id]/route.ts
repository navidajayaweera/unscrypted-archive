import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET one document by id
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { data, error } = await supabase
    .from('knowledge')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error) return NextResponse.json({ error: 'Document not found' }, { status: 404 })

  return NextResponse.json(data)
}

// DELETE one document by id
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await supabase
    .from('knowledge')
    .delete()
    .eq('id', params.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ message: 'Deleted successfully' })
}