import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { dailyLogSchema } from '@/lib/validations/log'

// GET /api/logs - List daily logs
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

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

    if (startDate || endDate) {
      const dateFilter: Record<string, Date> = {}
      if (startDate) dateFilter.gte = new Date(startDate)
      if (endDate) dateFilter.lte = new Date(endDate)
      whereClause.date = dateFilter
    }

    const logs = await prisma.dailyLog.findMany({
      where: whereClause,
      orderBy: { date: 'desc' },
    })

    return NextResponse.json({
      success: true,
      data: logs,
    })
  } catch (error) {
    console.error('GET /api/logs error:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch daily logs' } },
      { status: 500 }
    )
  }
}

// POST /api/logs - Upsert daily log entry for today or specified date
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
    const validatedData = dailyLogSchema.parse(body)

    // Calculate total study hours automatically
    const totalHours =
      (validatedData.interviewHours || 0) +
      (validatedData.mernHours || 0) +
      (validatedData.gateHours || 0) +
      (validatedData.projectHours || 0)

    // Parse date as midnight UTC or local date
    const targetDateStr = validatedData.date || new Date().toISOString().split('T')[0]
    const targetDate = new Date(`${targetDateStr}T00:00:00.000Z`)

    const log = await prisma.dailyLog.upsert({
      where: {
        userId_date: {
          userId: user.id,
          date: targetDate,
        },
      },
      create: {
        userId: user.id,
        date: targetDate,
        interviewHours: validatedData.interviewHours,
        mernHours: validatedData.mernHours,
        gateHours: validatedData.gateHours,
        projectHours: validatedData.projectHours,
        totalHours,
        exerciseDone: validatedData.exerciseDone,
        energyLevel: validatedData.energyLevel,
        focusLevel: validatedData.focusLevel,
        moodRating: validatedData.moodRating,
        whatWentWell: validatedData.whatWentWell || null,
        whatWentWrong: validatedData.whatWentWrong || null,
        blockers: validatedData.blockers || null,
        tomorrowPriority: validatedData.tomorrowPriority || null,
      },
      update: {
        interviewHours: validatedData.interviewHours,
        mernHours: validatedData.mernHours,
        gateHours: validatedData.gateHours,
        projectHours: validatedData.projectHours,
        totalHours,
        exerciseDone: validatedData.exerciseDone,
        energyLevel: validatedData.energyLevel,
        focusLevel: validatedData.focusLevel,
        moodRating: validatedData.moodRating,
        whatWentWell: validatedData.whatWentWell || null,
        whatWentWrong: validatedData.whatWentWrong || null,
        blockers: validatedData.blockers || null,
        tomorrowPriority: validatedData.tomorrowPriority || null,
      },
    })

    return NextResponse.json({
      success: true,
      data: log,
    })
  } catch (error) {
    console.error('POST /api/logs error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Validation failed', details: error.issues } },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to save daily log' } },
      { status: 500 }
    )
  }
}
