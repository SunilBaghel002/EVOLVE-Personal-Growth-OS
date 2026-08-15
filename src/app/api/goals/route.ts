import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/auth'
import { createWeeklyGoalSchema } from '@/lib/validations/goal'

export const dynamic = 'force-dynamic'

// GET /api/goals - List historical weekly goals
export async function GET() {
  try {
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      )
    }

    const goals = await prisma.weeklyGoal.findMany({
      where: { userId: user.id },
      orderBy: { weekNumber: 'desc' },
    })

    return NextResponse.json({
      success: true,
      data: goals,
    })
  } catch (error) {
    console.error('GET /api/goals error:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch weekly goals' } },
      { status: 500 }
    )
  }
}

// POST /api/goals - Create or update a weekly goal
export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      )
    }

    const body = await req.json()
    const validatedData = createWeeklyGoalSchema.parse(body)

    const startDate = new Date(validatedData.startDate)
    const endDate = new Date(validatedData.endDate)

    // Upsert goal by userId and weekNumber if existing or create new
    const existingGoal = await prisma.weeklyGoal.findFirst({
      where: {
        userId: user.id,
        weekNumber: validatedData.weekNumber,
      },
    })

    let goal
    if (existingGoal) {
      goal = await prisma.weeklyGoal.update({
        where: { id: existingGoal.id },
        data: {
          startDate,
          endDate,
          studyHoursTarget: validatedData.studyHoursTarget,
          appsTarget: validatedData.appsTarget,
          dsaTarget: validatedData.dsaTarget,
          mernTopicsTarget: validatedData.mernTopicsTarget,
          notes: validatedData.notes || null,
        },
      })
    } else {
      goal = await prisma.weeklyGoal.create({
        data: {
          userId: user.id,
          weekNumber: validatedData.weekNumber,
          startDate,
          endDate,
          studyHoursTarget: validatedData.studyHoursTarget,
          appsTarget: validatedData.appsTarget,
          dsaTarget: validatedData.dsaTarget,
          mernTopicsTarget: validatedData.mernTopicsTarget,
          notes: validatedData.notes || null,
        },
      })
    }

    return NextResponse.json(
      { success: true, data: goal },
      { status: existingGoal ? 200 : 201 }
    )
  } catch (error) {
    console.error('POST /api/goals error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Validation failed', details: error.issues } },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to save weekly goal' } },
      { status: 500 }
    )
  }
}
