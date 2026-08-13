import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { updateApplicationSchema } from '@/lib/validations/application'

interface RouteParams {
  params: {
    id: string
  }
}

// GET /api/applications/[id] - Fetch single application
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const application = await prisma.application.findUnique({
      where: { id: params.id },
      include: {
        interviews: {
          orderBy: { roundNumber: 'asc' },
        },
      },
    })

    if (!application) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Application not found' } },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: application,
    })
  } catch (error) {
    console.error(`GET /api/applications/${params.id} error:`, error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch application' } },
      { status: 500 }
    )
  }
}

// PATCH /api/applications/[id] - Update application
export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const body = await req.json()
    const validatedData = updateApplicationSchema.parse(body)

    const existingApp = await prisma.application.findUnique({
      where: { id: params.id },
    })

    if (!existingApp) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Application not found' } },
        { status: 404 }
      )
    }

    const updatePayload: Record<string, unknown> = {}

    if (validatedData.companyName !== undefined) updatePayload.companyName = validatedData.companyName
    if (validatedData.role !== undefined) updatePayload.role = validatedData.role
    if (validatedData.platform !== undefined) updatePayload.platform = validatedData.platform
    if (validatedData.status !== undefined) updatePayload.status = validatedData.status
    if (validatedData.jobUrl !== undefined) updatePayload.jobUrl = validatedData.jobUrl || null
    if (validatedData.location !== undefined) updatePayload.location = validatedData.location || null
    if (validatedData.salaryRange !== undefined) updatePayload.salaryRange = validatedData.salaryRange || null
    if (validatedData.contactPerson !== undefined) updatePayload.contactPerson = validatedData.contactPerson || null
    if (validatedData.contactEmail !== undefined) updatePayload.contactEmail = validatedData.contactEmail || null
    if (validatedData.usedReferral !== undefined) updatePayload.usedReferral = validatedData.usedReferral
    if (validatedData.appliedDate !== undefined) updatePayload.appliedDate = new Date(validatedData.appliedDate)
    if (validatedData.followUpDate !== undefined) {
      updatePayload.followUpDate = validatedData.followUpDate ? new Date(validatedData.followUpDate) : null
    }
    if (validatedData.notes !== undefined) updatePayload.notes = validatedData.notes || null

    const updatedApp = await prisma.application.update({
      where: { id: params.id },
      data: updatePayload,
    })

    return NextResponse.json({
      success: true,
      data: updatedApp,
    })
  } catch (error) {
    console.error(`PATCH /api/applications/${params.id} error:`, error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Validation failed', details: error.issues } },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to update application' } },
      { status: 500 }
    )
  }
}

// DELETE /api/applications/[id] - Delete application
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const existingApp = await prisma.application.findUnique({
      where: { id: params.id },
    })

    if (!existingApp) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Application not found' } },
        { status: 404 }
      )
    }

    await prisma.application.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      success: true,
      message: 'Application deleted successfully',
    })
  } catch (error) {
    console.error(`DELETE /api/applications/${params.id} error:`, error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to delete application' } },
      { status: 500 }
    )
  }
}
