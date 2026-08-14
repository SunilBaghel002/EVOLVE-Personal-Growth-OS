import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const DEFAULT_MERN_TOPICS = [
  // MongoDB (5 topics)
  { category: 'MongoDB', title: 'CRUD Operations & Document Schema Design', order: 1 },
  { category: 'MongoDB', title: 'Aggregation Pipeline (match, group, project, lookup)', order: 2 },
  { category: 'MongoDB', title: 'Indexing Strategies & Query Performance', order: 3 },
  { category: 'MongoDB', title: 'MongoDB Transactions & ACID Compliance', order: 4 },
  { category: 'MongoDB', title: 'Data Modeling: Embedding vs Referencing', order: 5 },

  // Express.js (5 topics)
  { category: 'Express', title: 'Middleware Architecture & Custom Error Handlers', order: 6 },
  { category: 'Express', title: 'Authentication: JWT vs Session-based Auth', order: 7 },
  { category: 'Express', title: 'RESTful API Design & Input Validation with Zod', order: 8 },
  { category: 'Express', title: 'Rate Limiting, CORS, and Helmet Security', order: 9 },
  { category: 'Express', title: 'Async Error Handling & Express v5 Changes', order: 10 },

  // React (6 topics)
  { category: 'React', title: 'React Hooks Deep Dive (useState, useEffect, useMemo, useCallback)', order: 11 },
  { category: 'React', title: 'State Management: Context API vs Zustand vs Redux', order: 12 },
  { category: 'React', title: 'React Fiber, Reconciliation & Virtual DOM Mechanics', order: 13 },
  { category: 'React', title: 'Custom Hooks Architecture & Reusability Patterns', order: 14 },
  { category: 'React', title: 'Rendering Strategies: CSR, SSR, SSG, and ISR', order: 15 },
  { category: 'React', title: 'Performance Optimization & React Suspense / Lazy Loading', order: 16 },

  // Node.js (5 topics)
  { category: 'Node', title: 'Node.js Event Loop, Timers & Microtask Queue', order: 17 },
  { category: 'Node', title: 'Streams, Buffers, and File System Operations', order: 18 },
  { category: 'Node', title: 'Cluster Mode & Worker Threads for Concurrency', order: 19 },
  { category: 'Node', title: 'Asynchronous Programming: Promises, Async/Await & EventEmitters', order: 20 },
  { category: 'Node', title: 'Memory Management, Garbage Collection & Leak Debugging', order: 21 },
]

// GET /api/mern - Fetch all MERN topics for the authenticated user
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search') || ''

    const user = await prisma.user.findFirst()
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'USER_NOT_FOUND', message: 'User not initialized' } },
        { status: 404 }
      )
    }

    let topics = await prisma.mERNTopic.findMany({
      where: { userId: user.id },
      orderBy: { order: 'asc' },
    })

    // Auto-seed default topics if user has no MERN topics yet (atomic & idempotent createMany)
    if (topics.length === 0) {
      await prisma.mERNTopic.createMany({
        data: DEFAULT_MERN_TOPICS.map((t) => ({
          userId: user.id,
          category: t.category,
          title: t.title,
          order: t.order,
          completed: false,
          confidence: 1,
        })),
        skipDuplicates: true,
      })

      topics = await prisma.mERNTopic.findMany({
        where: { userId: user.id },
        orderBy: { order: 'asc' },
      })
    }

    // Apply filtering if provided
    let filteredTopics = topics
    if (category && category !== 'ALL') {
      filteredTopics = filteredTopics.filter((t) => t.category.toLowerCase() === category.toLowerCase())
    }
    if (search) {
      filteredTopics = filteredTopics.filter(
        (t) =>
          t.title.toLowerCase().includes(search.toLowerCase()) ||
          t.category.toLowerCase().includes(search.toLowerCase()) ||
          (t.notes && t.notes.toLowerCase().includes(search.toLowerCase()))
      )
    }

    // Metrics summary
    const totalCount = topics.length
    const completedCount = topics.filter((t) => t.completed).length
    const overallProgressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

    const categoryStats = ['MongoDB', 'Express', 'React', 'Node'].map((cat) => {
      const catTopics = topics.filter((t) => t.category === cat)
      const catCompleted = catTopics.filter((t) => t.completed).length
      return {
        category: cat,
        total: catTopics.length,
        completed: catCompleted,
        percent: catTopics.length > 0 ? Math.round((catCompleted / catTopics.length) * 100) : 0,
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        topics: filteredTopics,
        allTopics: topics,
        totalCount,
        completedCount,
        overallProgressPercent,
        categoryStats,
      },
    })
  } catch (error) {
    console.error('Error fetching MERN topics:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch MERN topics' } },
      { status: 500 }
    )
  }
}
