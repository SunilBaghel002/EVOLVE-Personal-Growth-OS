import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const user = await prisma.user.findFirst({
      include: {
        applications: true,
        dsaProblems: true,
        dailyLogs: true,
        mernTopics: true,
        weeklyGoals: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'USER_NOT_FOUND', message: 'User not found' } },
        { status: 404 }
      )
    }

    const interviewRounds = await prisma.interview.findMany()
    const interviewQuestions = await prisma.interviewQuestion.findMany()

    const exportData = {
      exportedAt: new Date().toISOString(),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      applications: user.applications,
      dsaProblems: user.dsaProblems,
      dailyLogs: user.dailyLogs,
      mernTopics: user.mernTopics,
      weeklyGoals: user.weeklyGoals,
      interviews: interviewRounds,
      interviewQuestions: interviewQuestions,
    }

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="EVOLVE_Backup_${new Date().toISOString().split('T')[0]}.json"`,
      },
    })
  } catch (error) {
    console.error('GET /api/settings/export error:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to generate data export' } },
      { status: 500 }
    )
  }
}
