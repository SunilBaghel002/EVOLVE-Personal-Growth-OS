import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { createApplicationSchema } from '@/lib/validations/application'

// GET /api/applications - List applications with search/status filters
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''

    const user = await prisma.user.findFirst()
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'USER_NOT_FOUND', message: 'User not initialized' } },
        { status: 404 }
      )
    }

    const whereClause: Record<string, unknown> = {
      userId: user.id,
    }

    if (search) {
      whereClause.OR = [
        { companyName: { contains: search, mode: 'insensitive' } },
        { role: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (status && status !== 'ALL') {
      whereClause.status = status
    }

    const applications = await prisma.application.findMany({
      where: whereClause,
      orderBy: { appliedDate: 'desc' },
      include: {
        interviews: {
          orderBy: { roundNumber: 'asc' },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: applications,
    })
  } catch (error) {
    console.error('GET /api/applications error:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch applications' } },
      { status: 500 }
    )
  }
}

// POST /api/applications - Create a new job application
export async function POST(req: Request) {
  try {
    const user = await prisma.user.findFirst()
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'USER_NOT_FOUND', message: 'User not initialized' } },
        { status: 404 }
      )
    }

    const body = await req.json()
    const validatedData = createApplicationSchema.parse(body)

    const application = await prisma.application.create({
      data: {
        companyName: validatedData.companyName,
        role: validatedData.role,
        platform: validatedData.platform,
        status: validatedData.status,
        jobUrl: validatedData.jobUrl || null,
        location: validatedData.location || null,
        salaryRange: validatedData.salaryRange || null,
        contactPerson: validatedData.contactPerson || null,
        contactEmail: validatedData.contactEmail || null,
        usedReferral: validatedData.usedReferral,
        appliedDate: validatedData.appliedDate ? new Date(validatedData.appliedDate) : new Date(),
        followUpDate: validatedData.followUpDate ? new Date(validatedData.followUpDate) : null,
        notes: validatedData.notes || null,
        userId: user.id,
      },
    })

    return NextResponse.json(
      { success: true, data: application },
      { status: 201 }
    )
  } catch (error) {
    console.error('POST /api/applications error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Validation failed', details: error.issues } },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to create application' } },
      { status: 500 }
    )
  }
}
