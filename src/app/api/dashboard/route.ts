import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { CHALLENGE_START_DATE, CHALLENGE_END_DATE } from '@/lib/constants'
import { toLocalDateString, getTodayLocalDateString } from '@/lib/utils/dsa'

// GET /api/dashboard - Summary endpoint for home view
export async function GET() {
  try {
    const user = await prisma.user.findFirst()
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'USER_NOT_FOUND', message: 'User not initialized' } },
        { status: 404 }
      )
    }

    const todayStr = getTodayLocalDateString()
    const todayDateObj = new Date(`${todayStr}T00:00:00.000Z`)
    const tomorrowDateObj = new Date(todayDateObj)
    tomorrowDateObj.setDate(tomorrowDateObj.getDate() + 1)

    // 1. Calculate Challenge Day Number (Aug 12 - Sep 2)
    const startDateObj = new Date(CHALLENGE_START_DATE)
    const diffTime = todayDateObj.getTime() - startDateObj.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1
    const currentDayNumber = Math.min(Math.max(diffDays, 1), 21)

    // 2. Fetch Today's Daily Log
    const todayLog = await prisma.dailyLog.findUnique({
      where: {
        userId_date: {
          userId: user.id,
          date: todayDateObj,
        },
      },
    })

    // 3. Fetch Today's Applications count
    const todayAppsCount = await prisma.application.count({
      where: {
        userId: user.id,
        appliedDate: {
          gte: todayDateObj,
          lt: tomorrowDateObj,
        },
      },
    })

    // 4. Fetch Today's DSA problems count
    const todayDSACount = await prisma.dSAProblem.count({
      where: {
        userId: user.id,
        solvedDate: {
          gte: todayDateObj,
          lt: tomorrowDateObj,
        },
      },
    })

    // 5. Fetch DSA problems due for revision today or overdue
    const allDSA = await prisma.dSAProblem.findMany({
      where: {
        userId: user.id,
      },
      orderBy: { solvedDate: 'desc' },
    })

    const dueDSAProblems = allDSA.filter((prob) => {
      if (!prob.nextRevisionDate) return false
      return toLocalDateString(prob.nextRevisionDate) <= todayStr
    })

    // 6. Fetch MERN Topic of the Day (next uncompleted topic by order)
    const mernTopicOfDay = await prisma.mERNTopic.findFirst({
      where: {
        completed: false,
      },
      orderBy: { order: 'asc' },
    })

    // 7. Fetch Recent 5 Job Applications
    const recentApplications = await prisma.application.findMany({
      where: { userId: user.id },
      orderBy: { appliedDate: 'desc' },
      take: 5,
    })

    // 8. Fetch Upcoming Interviews or Applications in OA / Interview stages
    const upcomingInterviews = await prisma.application.findMany({
      where: {
        userId: user.id,
        status: {
          in: ['OA_RECEIVED', 'INTERVIEW_SCHEDULED', 'OA_COMPLETED'],
        },
      },
      orderBy: { updatedAt: 'desc' },
      take: 5,
      include: {
        interviews: {
          orderBy: { roundNumber: 'asc' },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        challenge: {
          dayNumber: currentDayNumber,
          startDate: CHALLENGE_START_DATE,
          endDate: CHALLENGE_END_DATE,
          targetHours: 11,
          achievedHours: todayLog?.totalHours || 0,
          targetApps: 5,
          achievedApps: todayAppsCount,
          targetDSA: 2,
          achievedDSA: todayDSACount,
        },
        todayLog,
        dueDSAProblems,
        dueDSACount: dueDSAProblems.length,
        mernTopicOfDay,
        recentApplications,
        upcomingInterviews,
      },
    })
  } catch (error) {
    console.error('GET /api/dashboard error:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch dashboard summary' } },
      { status: 500 }
    )
  }
}
