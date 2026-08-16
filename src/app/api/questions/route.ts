import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { createQuestionSchema } from '@/lib/validations/interview'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const difficulty = searchParams.get('difficulty') || ''
    const applicationId = searchParams.get('applicationId') || ''

    const user = await prisma.user.findFirst()
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'USER_NOT_FOUND', message: 'User not initialized' } },
        { status: 404 }
      )
    }

    const whereClause: Record<string, unknown> = {}

    if (search) {
      whereClause.OR = [
        { question: { contains: search, mode: 'insensitive' } },
        { answer: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (category && category !== 'ALL') {
      whereClause.category = category
    }

    if (difficulty && difficulty !== 'ALL') {
      whereClause.difficulty = difficulty
    }

    if (applicationId) {
      whereClause.applicationId = applicationId
    }

    const questions = await prisma.interviewQuestion.findMany({
      where: whereClause,
      include: {
        application: {
          select: {
            companyName: true,
            role: true,
          },
        },
        interview: {
          select: {
            roundName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      data: questions,
    })
  } catch (error) {
    console.error('GET /api/questions error:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch interview questions' } },
      { status: 500 }
    )
  }
}

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
    const validatedData = createQuestionSchema.parse(body)

    const question = await prisma.interviewQuestion.create({
      data: {
        applicationId: validatedData.applicationId || null,
        interviewId: validatedData.interviewId || null,
        question: validatedData.question,
        category: validatedData.category,
        difficulty: validatedData.difficulty,
        answer: validatedData.answer || null,
      },
      include: {
        application: {
          select: {
            companyName: true,
            role: true,
          },
        },
        interview: {
          select: {
            roundName: true,
          },
        },
      },
    })

    return NextResponse.json(
      { success: true, data: question },
      { status: 201 }
    )
  } catch (error) {
    console.error('POST /api/questions error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Validation failed', details: error.issues } },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to create interview question' } },
      { status: 500 }
    )
  }
}
