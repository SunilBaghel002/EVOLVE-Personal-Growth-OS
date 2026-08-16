import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { updateInterviewSchema } from '@/lib/validations/interview'

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

    const body = await req.json()
    const validatedData = updateInterviewSchema.parse(body)

    const existingInterview = await prisma.interview.findFirst({
      where: {
        id: params.id,
        application: {
          userId: user.id,
        },
      },
    })

    if (!existingInterview) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Interview round not found' } },
        { status: 404 }
      )
    }

    const updatedInterview = await prisma.interview.update({
      where: { id: params.id },
      data: {
        ...(validatedData.roundName && { roundName: validatedData.roundName }),
        ...(validatedData.roundNumber !== undefined && { roundNumber: validatedData.roundNumber }),
        ...(validatedData.scheduledAt !== undefined && {
          scheduledAt: validatedData.scheduledAt ? new Date(validatedData.scheduledAt) : null,
        }),
        ...(validatedData.completedAt !== undefined && {
          completedAt: validatedData.completedAt ? new Date(validatedData.completedAt) : null,
        }),
        ...(validatedData.status && { status: validatedData.status }),
        ...(validatedData.feedback !== undefined && { feedback: validatedData.feedback }),
      },
      include: {
        application: {
          select: {
            companyName: true,
            role: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: updatedInterview,
    })
  } catch (error) {
    console.error('PATCH /api/interviews/[id] error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Validation failed', details: error.issues } },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to update interview round' } },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _req: Request,
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

    const existingInterview = await prisma.interview.findFirst({
      where: {
        id: params.id,
        application: {
          userId: user.id,
        },
      },
    })

    if (!existingInterview) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Interview round not found' } },
        { status: 404 }
      )
    }

    await prisma.interview.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      success: true,
      data: { message: 'Interview round deleted' },
    })
  } catch (error) {
    console.error('DELETE /api/interviews/[id] error:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to delete interview round' } },
      { status: 500 }
    )
  }
}
