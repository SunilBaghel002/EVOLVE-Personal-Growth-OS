import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const user = await prisma.user.findFirst()
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'USER_NOT_FOUND', message: 'User not initialized' } },
        { status: 404 }
      )
    }

    const body = await req.json().catch(() => ({}))
    if (body.confirmText !== 'RESET DATA') {
      return NextResponse.json(
        { success: false, error: { code: 'BAD_REQUEST', message: 'Invalid confirmation text. Must send "RESET DATA"' } },
        { status: 400 }
      )
    }

    // Delete user-created logs, apps, dsa, goals, interviews, questions
    await prisma.interviewQuestion.deleteMany()
    await prisma.interview.deleteMany()
    await prisma.application.deleteMany({ where: { userId: user.id } })
    await prisma.dSAProblem.deleteMany({ where: { userId: user.id } })
    await prisma.dailyLog.deleteMany({ where: { userId: user.id } })
    await prisma.weeklyGoal.deleteMany({ where: { userId: user.id } })

    return NextResponse.json({
      success: true,
      data: { message: 'All custom user tracking data has been safely reset.' },
    })
  } catch (error) {
    console.error('POST /api/settings/reset error:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to reset data' } },
      { status: 500 }
    )
  }
}
