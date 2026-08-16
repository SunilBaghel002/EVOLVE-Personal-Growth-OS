import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calculateNextRevision } from '@/lib/utils/dsa'

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.user.findFirst()
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'USER_NOT_FOUND', message: 'User not initialized' } },
        { status: 404 }
      )
    }

    const body = await req.json().catch(() => ({}))
    const { confidence: newConfidence } = body

    const existingProblem = await prisma.dSAProblem.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    })

    if (!existingProblem) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'DSA problem not found' } },
        { status: 404 }
      )
    }

    const confidenceToUse = typeof newConfidence === 'number' ? newConfidence : existingProblem.confidence
    const nextRevisionDate = calculateNextRevision(new Date(), confidenceToUse)

    const updatedProblem = await prisma.dSAProblem.update({
      where: { id: params.id },
      data: {
        revisedCount: existingProblem.revisedCount + 1,
        confidence: confidenceToUse,
        nextRevisionDate,
      },
    })

    return NextResponse.json({
      success: true,
      data: updatedProblem,
    })
  } catch (error) {
    console.error('PATCH /api/dsa/[id]/revise error:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to record revision' } },
      { status: 500 }
    )
  }
}
