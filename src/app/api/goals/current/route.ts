import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/auth'
import { CHALLENGE_START_DATE } from '@/lib/constants'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      )
    }

    const userId = user.id

    // Compute current week relative to challenge start date (Aug 12, 2026)
    const challengeStartObj = new Date(`${CHALLENGE_START_DATE}T00:00:00.000Z`)
    const now = new Date()

    const diffDays = Math.max(0, Math.floor((now.getTime() - challengeStartObj.getTime()) / (1000 * 60 * 60 * 24)))
    const currentWeekNumber = Math.min(3, Math.floor(diffDays / 7) + 1) // Challenge spans 3 weeks (21 days)

    // Calculate start and end date for current week
    const weekStart = new Date(challengeStartObj)
    weekStart.setUTCDate(challengeStartObj.getUTCDate() + (currentWeekNumber - 1) * 7)

    const weekEnd = new Date(weekStart)
    weekEnd.setUTCDate(weekStart.getUTCDate() + 6)
    weekEnd.setUTCHours(23, 59, 59, 999)

    // Fetch existing goal or create default goal for current week
    let goal = await prisma.weeklyGoal.findFirst({
      where: {
        userId,
        weekNumber: currentWeekNumber,
      },
    })

    if (!goal) {
      goal = await prisma.weeklyGoal.create({
        data: {
          userId,
          weekNumber: currentWeekNumber,
          startDate: weekStart,
          endDate: weekEnd,
          studyHoursTarget: 77,
          appsTarget: 35,
          dsaTarget: 15,
          mernTopicsTarget: 5,
          achieved: false,
        },
      })
    }

    // Compute live actuals from database
    const [logs, applications, dsaProblems, mernTopics] = await Promise.all([
      prisma.dailyLog.findMany({
        where: {
          userId,
          date: { gte: weekStart, lte: weekEnd },
        },
      }),
      prisma.application.findMany({
        where: {
          userId,
          appliedDate: { gte: weekStart, lte: weekEnd },
        },
      }),
      prisma.dSAProblem.findMany({
        where: {
          userId,
          solvedDate: { gte: weekStart, lte: weekEnd },
        },
      }),
      prisma.mERNTopic.findMany({
        where: {
          userId,
          completed: true,
          lastRevisedAt: { gte: weekStart, lte: weekEnd },
        },
      }),
    ])

    const studyHoursActual = Number(logs.reduce((acc, log) => acc + log.totalHours, 0).toFixed(1))
    const appsActual = applications.length
    const dsaActual = dsaProblems.length
    const mernTopicsActual = mernTopics.length

    const isGoalAchieved =
      studyHoursActual >= goal.studyHoursTarget &&
      appsActual >= goal.appsTarget &&
      dsaActual >= goal.dsaTarget &&
      mernTopicsActual >= goal.mernTopicsTarget

    if (goal.achieved !== isGoalAchieved) {
      goal = await prisma.weeklyGoal.update({
        where: { id: goal.id },
        data: { achieved: isGoalAchieved },
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        goal,
        actuals: {
          studyHours: studyHoursActual,
          apps: appsActual,
          dsa: dsaActual,
          mernTopics: mernTopicsActual,
        },
      },
    })
  } catch (error) {
    console.error('GET /api/goals/current error:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch current weekly goal' } },
      { status: 500 }
    )
  }
}
