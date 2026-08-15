import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/auth'
import { CHALLENGE_START_DATE, TOTAL_CHALLENGE_DAYS } from '@/lib/constants'

export const dynamic = 'force-dynamic'

const DEFAULT_DSA_TOPICS = [
  'Arrays & Hashing',
  'Two Pointers',
  'Sliding Window',
  'Stack & Queue',
  'Binary Search',
  'Linked List',
  'Trees & BST',
  'Graphs',
  'Dynamic Programming',
  'Heap / Priority Queue',
  'Greedy Algorithms',
  'Backtracking',
]

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

    // Fetch all logs, applications, and DSA problems for caller
    const [logs, applications, dsaProblems] = await Promise.all([
      prisma.dailyLog.findMany({
        where: { userId },
        orderBy: { date: 'asc' },
      }),
      prisma.application.findMany({
        where: { userId },
      }),
      prisma.dSAProblem.findMany({
        where: { userId },
      }),
    ])

    // 1. Weekly / Daily Hours Trend derived from shared challenge range constants
    const startDateObj = new Date(`${CHALLENGE_START_DATE}T00:00:00.000Z`)
    const hoursTrend = []

    for (let i = 1; i <= TOTAL_CHALLENGE_DAYS; i++) {
      const dayDate = new Date(startDateObj)
      dayDate.setUTCDate(startDateObj.getUTCDate() + (i - 1))
      const dateStr = dayDate.toISOString().split('T')[0]

      const dayLog = logs.find((l) => l.date.toISOString().split('T')[0] === dateStr)

      hoursTrend.push({
        dayNumber: i,
        label: `Day ${i}`,
        date: dateStr,
        gateHours: dayLog?.gateHours || 0,
        mernHours: dayLog?.mernHours || 0,
        projectHours: dayLog?.projectHours || 0,
        interviewHours: dayLog?.interviewHours || 0,
        totalHours: dayLog?.totalHours || 0,
        targetHours: 11,
      })
    }

    // 2. Category Distribution
    let totalGate = 0
    let totalMern = 0
    let totalProject = 0
    let totalInterview = 0

    logs.forEach((log) => {
      totalGate += log.gateHours
      totalMern += log.mernHours
      totalProject += log.projectHours
      totalInterview += log.interviewHours
    })

    const totalHoursLogged = totalGate + totalMern + totalProject + totalInterview

    const categoryDistribution = [
      { name: 'CS Core / GATE', hours: Number(totalGate.toFixed(1)), color: '#10B981', percentage: totalHoursLogged > 0 ? Math.round((totalGate / totalHoursLogged) * 100) : 0 },
      { name: 'MERN Stack', hours: Number(totalMern.toFixed(1)), color: '#3B82F6', percentage: totalHoursLogged > 0 ? Math.round((totalMern / totalHoursLogged) * 100) : 0 },
      { name: 'Projects', hours: Number(totalProject.toFixed(1)), color: '#8B5CF6', percentage: totalHoursLogged > 0 ? Math.round((totalProject / totalHoursLogged) * 100) : 0 },
      { name: 'Interview Prep', hours: Number(totalInterview.toFixed(1)), color: '#F59E0B', percentage: totalHoursLogged > 0 ? Math.round((totalInterview / totalHoursLogged) * 100) : 0 },
    ]

    // 3. Application Funnel
    const statusCounts = {
      SAVED: 0,
      APPLIED: 0,
      OA: 0,
      INTERVIEW: 0,
      OFFER: 0,
      REJECTED: 0,
      GHOSTED: 0,
    }

    applications.forEach((app) => {
      const status = app.status.toUpperCase()
      if (status === 'SAVED') statusCounts.SAVED++
      else if (status === 'APPLIED') statusCounts.APPLIED++
      else if (status.startsWith('OA_')) statusCounts.OA++
      else if (status.startsWith('INTERVIEW_')) statusCounts.INTERVIEW++
      else if (status === 'OFFER_RECEIVED' || status === 'ACCEPTED') statusCounts.OFFER++
      else if (status === 'REJECTED') statusCounts.REJECTED++
      else if (status === 'GHOSTED') statusCounts.GHOSTED++
      else statusCounts.APPLIED++
    })

    const totalApplications = applications.length
    const applicationFunnel = [
      { stage: 'Saved', count: statusCounts.SAVED, fill: '#64748B' },
      { stage: 'Applied', count: statusCounts.APPLIED, fill: '#3B82F6' },
      { stage: 'OA Stage', count: statusCounts.OA, fill: '#8B5CF6' },
      { stage: 'Interviews', count: statusCounts.INTERVIEW, fill: '#F59E0B' },
      { stage: 'Offers', count: statusCounts.OFFER, fill: '#10B981' },
      { stage: 'Rejected', count: statusCounts.REJECTED, fill: '#EF4444' },
      { stage: 'Ghosted', count: statusCounts.GHOSTED, fill: '#475569' },
    ]

    // 4. Platform Effectiveness
    const platformMap: Record<string, { total: number; interviewsOrOffers: number }> = {}

    applications.forEach((app) => {
      const platform = app.platform || 'Direct'
      if (!platformMap[platform]) {
        platformMap[platform] = { total: 0, interviewsOrOffers: 0 }
      }
      platformMap[platform].total += 1

      const st = app.status.toUpperCase()
      if (st.startsWith('INTERVIEW_') || st === 'OFFER_RECEIVED' || st === 'ACCEPTED' || st.startsWith('OA_')) {
        platformMap[platform].interviewsOrOffers += 1
      }
    })

    const platformEffectiveness = Object.entries(platformMap).map(([platform, data]) => ({
      platform,
      totalApps: data.total,
      positiveResponses: data.interviewsOrOffers,
      conversionRate: data.total > 0 ? Math.round((data.interviewsOrOffers / data.total) * 100) : 0,
    }))

    // 5. DSA Topic Coverage & Heatmap
    const topicStatsMap: Record<
      string,
      { total: number; easy: number; medium: number; hard: number; totalConfidence: number }
    > = {}

    DEFAULT_DSA_TOPICS.forEach((t) => {
      topicStatsMap[t] = { total: 0, easy: 0, medium: 0, hard: 0, totalConfidence: 0 }
    })

    dsaProblems.forEach((p) => {
      const topic = p.topic || 'General'
      if (!topicStatsMap[topic]) {
        topicStatsMap[topic] = { total: 0, easy: 0, medium: 0, hard: 0, totalConfidence: 0 }
      }
      topicStatsMap[topic].total += 1
      const diff = p.difficulty.toUpperCase()
      if (diff === 'EASY') topicStatsMap[topic].easy += 1
      else if (diff === 'MEDIUM') topicStatsMap[topic].medium += 1
      else if (diff === 'HARD') topicStatsMap[topic].hard += 1

      topicStatsMap[topic].totalConfidence += p.confidence || 3
    })

    const dsaTopicCoverage = Object.entries(topicStatsMap).map(([topic, stats]) => ({
      topic,
      totalSolved: stats.total,
      easy: stats.easy,
      medium: stats.medium,
      hard: stats.hard,
      avgConfidence: stats.total > 0 ? Number((stats.totalConfidence / stats.total).toFixed(1)) : 0,
    }))

    return NextResponse.json({
      success: true,
      data: {
        totalHoursLogged,
        totalApplications,
        totalDSASolved: dsaProblems.length,
        hoursTrend,
        categoryDistribution,
        applicationFunnel,
        platformEffectiveness,
        dsaTopicCoverage,
      },
    })
  } catch (error) {
    console.error('Error fetching analytics overview:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to compute analytics metrics' } },
      { status: 500 }
    )
  }
}
