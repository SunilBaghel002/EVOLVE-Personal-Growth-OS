import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    let user = await prisma.user.findFirst()
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: 'Sunil Baghel',
          email: 'sunilbaghel002@gmail.com',
        },
      })
    }

    const startDateObj = new Date('2026-08-12T00:00:00.000Z')

    // Fetch existing challenge days or initialize 21 days
    let challengeDays = await prisma.challengeDay.findMany({
      where: { userId: user.id },
      orderBy: { dayNumber: 'asc' },
    })

    if (challengeDays.length < 21) {
      for (let i = 1; i <= 21; i++) {
        const dayDate = new Date(startDateObj)
        dayDate.setUTCDate(startDateObj.getUTCDate() + (i - 1))

        await prisma.challengeDay.upsert({
          where: {
            userId_dayNumber: {
              userId: user.id,
              dayNumber: i,
            },
          },
          update: {},
          create: {
            userId: user.id,
            dayNumber: i,
            date: dayDate,
            targetHours: 11,
            achievedHours: 0,
            targetApps: 5,
            achievedApps: 0,
            targetDSA: 2,
            achievedDSA: 0,
            completed: false,
          },
        })
      }

      challengeDays = await prisma.challengeDay.findMany({
        where: { userId: user.id },
        orderBy: { dayNumber: 'asc' },
      })
    }

    // Live update challenge days with actual counts from DailyLog, Application, and DSAProblem
    const logs = await prisma.dailyLog.findMany({ where: { userId: user.id } })
    const apps = await prisma.application.findMany({ where: { userId: user.id } })
    const dsaProblems = await prisma.dSAProblem.findMany({ where: { userId: user.id } })

    const updatedChallengeDays = []
    let currentStudyStreak = 0
    let currentAppStreak = 0
    let currentDSAStreak = 0
    let currentExerciseStreak = 0

    let totalHoursLogged = 0
    let totalAppsSubmitted = 0
    let totalDSASolved = 0
    let totalDaysCompleted = 0

    const todayDateStr = new Date().toISOString().split('T')[0]

    for (const cDay of challengeDays) {
      const cDateStr = cDay.date.toISOString().split('T')[0]

      // Find matching log for day
      const dayLog = logs.find((l) => l.date.toISOString().split('T')[0] === cDateStr)
      const achievedHours = dayLog?.totalHours || 0
      const exerciseDone = !!dayLog?.exerciseDone

      // Count apps on date
      const achievedApps = apps.filter((a) => a.appliedDate.toISOString().split('T')[0] === cDateStr).length

      // Count DSA on date
      const achievedDSA = dsaProblems.filter((d) => d.solvedDate.toISOString().split('T')[0] === cDateStr).length

      const isHoursMet = achievedHours >= 11
      const isAppsMet = achievedApps >= 5
      const isDSAMet = achievedDSA >= 2
      const isFullyCompleted = isHoursMet && isAppsMet && isDSAMet

      totalHoursLogged += achievedHours
      totalAppsSubmitted += achievedApps
      totalDSASolved += achievedDSA
      if (isFullyCompleted) totalDaysCompleted += 1

      // Streak logic (for past or today dates)
      if (cDateStr <= todayDateStr) {
        if (isHoursMet) currentStudyStreak += 1
        else currentStudyStreak = 0

        if (isAppsMet) currentAppStreak += 1
        else currentAppStreak = 0

        if (isDSAMet) currentDSAStreak += 1
        else currentDSAStreak = 0

        if (exerciseDone) currentExerciseStreak += 1
        else currentExerciseStreak = 0
      }

      updatedChallengeDays.push({
        ...cDay,
        achievedHours,
        achievedApps,
        achievedDSA,
        exerciseDone,
        completed: isFullyCompleted,
        isToday: cDateStr === todayDateStr,
        isPast: cDateStr < todayDateStr,
        isFuture: cDateStr > todayDateStr,
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        challengeDays: updatedChallengeDays,
        metrics: {
          totalHoursLogged,
          targetHoursTotal: 21 * 11, // 231 hours
          totalAppsSubmitted,
          targetAppsTotal: 21 * 5, // 105 apps
          totalDSASolved,
          targetDSATotal: 21 * 2, // 42 DSA problems
          totalDaysCompleted,
          streaks: {
            studyHoursStreak: currentStudyStreak,
            appsStreak: currentAppStreak,
            dsaStreak: currentDSAStreak,
            exerciseStreak: currentExerciseStreak,
          },
        },
      },
    })
  } catch (error) {
    console.error('Error fetching challenge data:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch challenge data' } },
      { status: 500 }
    )
  }
}
