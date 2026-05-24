import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

type RouteContext = { params: Promise<{ id: string }> }

// GET one document by id
export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params
    const document = await prisma.knowledge.findUnique({ where: { id } })

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    return NextResponse.json(document)
  } catch (error) {
    console.error('GET /api/knowledge/[id] error:', error)
    return NextResponse.json({ error: 'Failed to fetch document' }, { status: 500 })
  }
}

// DELETE one document by id
export async function DELETE(_req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params
    const document = await prisma.knowledge.findUnique({ where: { id } })

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Remove file from disk if it exists
    if (document.filePath) {
      try {
        const { unlink } = await import('fs/promises')
        const { join }   = await import('path')
        await unlink(join(process.cwd(), 'public', document.filePath))
      } catch {
        // File may already be gone — not fatal
      }
    }

    await prisma.knowledge.delete({ where: { id } })

    return NextResponse.json({ message: 'Deleted successfully' })
  } catch (error) {
    console.error('DELETE /api/knowledge/[id] error:', error)
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 })
  }
}
