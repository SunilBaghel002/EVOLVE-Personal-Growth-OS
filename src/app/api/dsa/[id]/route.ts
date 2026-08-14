import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { updateDSAProblemSchema } from '@/lib/validations/dsa'
import { calculateNextRevision } from '@/lib/utils/dsa'

interface RouteParams {
  params: {
    id: string
  }
}

// GET /api/dsa/[id] - Fetch single DSA problem
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const problem = await prisma.dSAProblem.findUnique({
      where: { id: params.id },
    })

    if (!problem) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'DSA problem not found' } },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: problem,
    })
  } catch (error) {
    console.error(`GET /api/dsa/${params.id} error:`, error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch DSA problem' } },
      { status: 500 }
    )
  }
}

// PATCH /api/dsa/[id] - Update problem or mark revised
export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const body = await req.json()

    // Handle special "markRevised" quick action
    if (body.markRevised) {
      const existingProblem = await prisma.dSAProblem.findUnique({
        where: { id: params.id },
      })

      if (!existingProblem) {
        return NextResponse.json(
          { success: false, error: { code: 'NOT_FOUND', message: 'DSA problem not found' } },
          { status: 404 }
        )
      }

      const newConfidence = body.confidence !== undefined ? Number(body.confidence) : existingProblem.confidence
      const nextRevDate = calculateNextRevision(new Date(), newConfidence)

      const updatedProblem = await prisma.dSAProblem.update({
        where: { id: params.id },
        data: {
          confidence: newConfidence,
          nextRevisionDate: nextRevDate,
          revisedCount: { increment: 1 },
        },
      })

      return NextResponse.json({
        success: true,
        data: updatedProblem,
      })
    }

    // Standard update flow
    const validatedData = updateDSAProblemSchema.parse(body)

    const existingProblem = await prisma.dSAProblem.findUnique({
      where: { id: params.id },
    })

    if (!existingProblem) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'DSA problem not found' } },
        { status: 404 }
      )
    }

    const updatePayload: Record<string, unknown> = {}

    if (validatedData.title !== undefined) updatePayload.title = validatedData.title
    if (validatedData.problemUrl !== undefined) updatePayload.problemUrl = validatedData.problemUrl || null
    if (validatedData.platform !== undefined) updatePayload.platform = validatedData.platform
    if (validatedData.topic !== undefined) updatePayload.topic = validatedData.topic
    if (validatedData.difficulty !== undefined) updatePayload.difficulty = validatedData.difficulty
    if (validatedData.timeTakenMinutes !== undefined) {
      updatePayload.timeTakenMinutes = validatedData.timeTakenMinutes !== undefined ? validatedData.timeTakenMinutes : null
    }
    if (validatedData.confidence !== undefined) updatePayload.confidence = validatedData.confidence
    if (validatedData.notes !== undefined) updatePayload.notes = validatedData.notes || null

    const solvedDateObj = validatedData.solvedDate
      ? new Date(validatedData.solvedDate)
      : existingProblem.solvedDate
    const finalConfidence = validatedData.confidence ?? existingProblem.confidence

    updatePayload.solvedDate = solvedDateObj
    updatePayload.nextRevisionDate = calculateNextRevision(solvedDateObj, finalConfidence)

    const updatedProblem = await prisma.dSAProblem.update({
      where: { id: params.id },
      data: updatePayload,
    })

    return NextResponse.json({
      success: true,
      data: updatedProblem,
    })
  } catch (error) {
    console.error(`PATCH /api/dsa/${params.id} error:`, error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Validation failed', details: error.issues } },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to update DSA problem' } },
      { status: 500 }
    )
  }
}

// DELETE /api/dsa/[id] - Delete DSA problem
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const existingProblem = await prisma.dSAProblem.findUnique({
      where: { id: params.id },
    })

    if (!existingProblem) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'DSA problem not found' } },
        { status: 404 }
      )
    }

    await prisma.dSAProblem.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      success: true,
      message: 'DSA problem deleted successfully',
    })
  } catch (error) {
    console.error(`DELETE /api/dsa/${params.id} error:`, error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to delete DSA problem' } },
      { status: 500 }
    )
  }
}
