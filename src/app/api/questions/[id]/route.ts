import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { updateQuestionSchema } from '@/lib/validations/interview'

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
    const validatedData = updateQuestionSchema.parse(body)

    const existingQuestion = await prisma.interviewQuestion.findUnique({
      where: { id: params.id },
    })

    if (!existingQuestion) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Interview question not found' } },
        { status: 404 }
      )
    }

    const updatedQuestion = await prisma.interviewQuestion.update({
      where: { id: params.id },
      data: {
        ...(validatedData.question && { question: validatedData.question }),
        ...(validatedData.category && { category: validatedData.category }),
        ...(validatedData.difficulty && { difficulty: validatedData.difficulty }),
        ...(validatedData.answer !== undefined && { answer: validatedData.answer }),
        ...(validatedData.applicationId !== undefined && { applicationId: validatedData.applicationId }),
        ...(validatedData.interviewId !== undefined && { interviewId: validatedData.interviewId }),
      },
      include: {
        application: {
          select: {
            companyName: true,
            role: true,
          },
        },
        interview: {
          select: {
            roundName: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: updatedQuestion,
    })
  } catch (error) {
    console.error('PATCH /api/questions/[id] error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Validation failed', details: error.issues } },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to update question' } },
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

    const existingQuestion = await prisma.interviewQuestion.findUnique({
      where: { id: params.id },
    })

    if (!existingQuestion) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Question not found' } },
        { status: 404 }
      )
    }

    await prisma.interviewQuestion.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      success: true,
      data: { message: 'Question deleted successfully' },
    })
  } catch (error) {
    console.error('DELETE /api/questions/[id] error:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to delete question' } },
      { status: 500 }
    )
  }
}
