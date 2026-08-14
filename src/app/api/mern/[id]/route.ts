import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { updateMERNTopicSchema } from '@/lib/validations/mern'

// PATCH /api/mern/[id] - Update a MERN topic's completion status, confidence, or notes
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await req.json()

    const parseResult = updateMERNTopicSchema.safeParse(body)
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid topic update payload',
            details: parseResult.error.flatten(),
          },
        },
        { status: 400 }
      )
    }

    const user = await prisma.user.findFirst()
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'USER_NOT_FOUND', message: 'User not initialized' } },
        { status: 404 }
      )
    }

    const existingTopic = await prisma.mERNTopic.findFirst({
      where: { id, userId: user.id },
    })

    if (!existingTopic) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'MERN Topic not found' } },
        { status: 404 }
      )
    }

    const updateData: Record<string, unknown> = {}
    if (parseResult.data.completed !== undefined) {
      updateData.completed = parseResult.data.completed
      if (parseResult.data.completed) {
        updateData.lastRevisedAt = new Date()
      }
    }

    if (parseResult.data.confidence !== undefined) {
      updateData.confidence = parseResult.data.confidence
      updateData.lastRevisedAt = new Date()
    }

    if (parseResult.data.notes !== undefined) {
      updateData.notes = parseResult.data.notes
    }

    const updatedTopic = await prisma.mERNTopic.update({
      where: { id: existingTopic.id },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      data: updatedTopic,
    })
  } catch (error) {
    console.error('Error updating MERN topic:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update MERN topic' } },
      { status: 500 }
    )
  }
}
