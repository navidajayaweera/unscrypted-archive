import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET all documents (with optional ?tag= filter)
export async function GET(req: NextRequest) {
  try {
    const tag = req.nextUrl.searchParams.get('tag')

    const documents = await prisma.knowledge.findMany({
      where: tag ? { tags: { contains: tag } } : undefined,
      orderBy: { uploadedAt: 'desc' },
    })

    return NextResponse.json(documents)
  } catch (error) {
    console.error('GET /api/knowledge error:', error)
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 })
  }
}

// POST upload new document
export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') ?? ''

    let title = '', description = '', filePath = '', tags = ''

    if (contentType.includes('multipart/form-data')) {
      const form = await req.formData()
      title       = form.get('title')?.toString().trim() ?? ''
      description = form.get('description')?.toString().trim() ?? ''
      tags        = form.get('tags')?.toString().trim() ?? ''

      const file = form.get('file') as File | null
      if (file && file.size > 0) {
        // Save file to /public/uploads/
        const { writeFile, mkdir } = await import('fs/promises')
        const { join }             = await import('path')
        const uploadDir = join(process.cwd(), 'public', 'uploads')
        await mkdir(uploadDir, { recursive: true })
        const bytes  = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const fileName = `${Date.now()}-${file.name}`
        await writeFile(join(uploadDir, fileName), buffer)
        filePath = `/uploads/${fileName}`
      }
    } else {
      const body  = await req.json()
      title       = body.title?.toString().trim() ?? ''
      description = body.description?.toString().trim() ?? ''
      filePath    = body.filePath?.toString().trim() ?? ''
      tags        = body.tags?.toString().trim() ?? ''
    }

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const document = await prisma.knowledge.create({
      data: { title, description, filePath, tags },
    })

    return NextResponse.json(document, { status: 201 })
  } catch (error) {
    console.error('POST /api/knowledge error:', error)
    return NextResponse.json({ error: 'Failed to create document' }, { status: 500 })
  }
}
