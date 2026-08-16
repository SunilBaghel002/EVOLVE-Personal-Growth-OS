import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { createInterviewSchema } from '@/lib/validations/interview'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const applicationId = searchParams.get('applicationId')
    const status = searchParams.get('status')

    const user = await prisma.user.findFirst()
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'USER_NOT_FOUND', message: 'User not initialized' } },
        { status: 404 }
      )
    }

    const whereClause: Record<string, unknown> = {
      application: {
        userId: user.id,
      },
    }

    if (applicationId) {
      whereClause.applicationId = applicationId
    }

    if (status && status !== 'ALL') {
      whereClause.status = status
    }

    const interviews = await prisma.interview.findMany({
      where: whereClause,
      include: {
        application: {
          select: {
            companyName: true,
            role: true,
          },
        },
        questions: true,
      },
      orderBy: [{ scheduledAt: 'asc' }, { createdAt: 'desc' }],
    })

    return NextResponse.json({
      success: true,
      data: interviews,
    })
  } catch (error) {
    console.error('GET /api/interviews error:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch interviews' } },
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
    const validatedData = createInterviewSchema.parse(body)

    const application = await prisma.application.findFirst({
      where: {
        id: validatedData.applicationId,
        userId: user.id,
      },
    })

    if (!application) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Application not found' } },
        { status: 404 }
      )
    }

    const interview = await prisma.interview.create({
      data: {
        applicationId: validatedData.applicationId,
        roundName: validatedData.roundName,
        roundNumber: validatedData.roundNumber,
        scheduledAt: validatedData.scheduledAt ? new Date(validatedData.scheduledAt) : null,
        completedAt: validatedData.completedAt ? new Date(validatedData.completedAt) : null,
        status: validatedData.status,
        feedback: validatedData.feedback || null,
      },
      include: {
        application: {
          select: {
            companyName: true,
            role: true,
          },
        },
      },
    })

    return NextResponse.json(
      { success: true, data: interview },
      { status: 201 }
    )
  } catch (error) {
    console.error('POST /api/interviews error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Validation failed', details: error.issues } },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to create interview round' } },
      { status: 500 }
    )
  }
}
