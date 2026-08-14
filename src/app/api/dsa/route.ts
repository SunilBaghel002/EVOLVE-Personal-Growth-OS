import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { createDSAProblemSchema } from '@/lib/validations/dsa'
import { calculateNextRevision } from '@/lib/utils/dsa'

// GET /api/dsa - List DSA problems with filters
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const topic = searchParams.get('topic') || ''
    const difficulty = searchParams.get('difficulty') || ''
    const dueRevision = searchParams.get('dueRevision') === 'true'

    const user = await prisma.user.findFirst()
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'USER_NOT_FOUND', message: 'User not initialized' } },
        { status: 404 }
      )
    }

    const whereClause: Record<string, unknown> = {
      userId: user.id,
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { platform: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (topic && topic !== 'ALL') {
      whereClause.topic = topic
    }

    if (difficulty && difficulty !== 'ALL') {
      whereClause.difficulty = difficulty
    }

    if (dueRevision) {
      whereClause.nextRevisionDate = {
        lte: new Date(),
      }
    }

    const problems = await prisma.dSAProblem.findMany({
      where: whereClause,
      orderBy: { solvedDate: 'desc' },
    })

    return NextResponse.json({
      success: true,
      data: problems,
    })
  } catch (error) {
    console.error('GET /api/dsa error:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch DSA problems' } },
      { status: 500 }
    )
  }
}

// POST /api/dsa - Log a new DSA problem
export async function POST(req: Request) {
  try {
    const user = await prisma.user.findFirst()
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'USER_NOT_FOUND', message: 'User not initialized' } },
        { status: 404 }
      )
    }

    const body = await req.json()
    const validatedData = createDSAProblemSchema.parse(body)

    const solvedDateObj = validatedData.solvedDate ? new Date(validatedData.solvedDate) : new Date()
    const nextRevisionDate = calculateNextRevision(solvedDateObj, validatedData.confidence)

    const problem = await prisma.dSAProblem.create({
      data: {
        userId: user.id,
        title: validatedData.title,
        problemUrl: validatedData.problemUrl || null,
        platform: validatedData.platform,
        topic: validatedData.topic,
        difficulty: validatedData.difficulty,
        timeTakenMinutes: validatedData.timeTakenMinutes !== undefined ? validatedData.timeTakenMinutes : null,
        confidence: validatedData.confidence,
        notes: validatedData.notes || null,
        solvedDate: solvedDateObj,
        nextRevisionDate,
      },
    })

    return NextResponse.json(
      { success: true, data: problem },
      { status: 201 }
    )
  } catch (error) {
    console.error('POST /api/dsa error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Validation failed', details: error.issues } },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to log DSA problem' } },
      { status: 500 }
    )
  }
}
