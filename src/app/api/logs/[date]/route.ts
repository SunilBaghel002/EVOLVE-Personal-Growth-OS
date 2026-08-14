import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: {
    date: string
  }
}

// GET /api/logs/[date] - Fetch daily log for a specific date (YYYY-MM-DD)
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const user = await prisma.user.findFirst()
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'USER_NOT_FOUND', message: 'User not initialized' } },
        { status: 404 }
      )
    }

    const targetDate = new Date(`${params.date}T00:00:00.000Z`)

    const log = await prisma.dailyLog.findUnique({
      where: {
        userId_date: {
          userId: user.id,
          date: targetDate,
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: log || null,
    })
  } catch (error) {
    console.error(`GET /api/logs/${params.date} error:`, error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch daily log' } },
      { status: 500 }
    )
  }
}
