import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const MERN_TOPICS = [
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

async function main() {
  console.log('🌱 Starting database seeding...')

  // 1. Create or upsert Default User (Sunil Baghel)
  const user = await prisma.user.upsert({
    where: { email: 'sunilbaghel002@gmail.com' },
    update: {},
    create: {
      name: 'Sunil Baghel',
      email: 'sunilbaghel002@gmail.com',
    },
  })
  console.log('✅ User verified successfully.')

  // 2. Seed 21 MERN Topics
  console.log('📦 Seeding 21 MERN Revision Topics...')
  for (const topic of MERN_TOPICS) {
    await prisma.mERNTopic.upsert({
      where: {
        userId_order: {
          userId: user.id,
          order: topic.order,
        },
      },
      update: {
        category: topic.category,
        title: topic.title,
      },
      create: {
        userId: user.id,
        category: topic.category,
        title: topic.title,
        order: topic.order,
        completed: false,
        confidence: 1,
      },
    })
  }
  console.log('✅ 21 MERN Revision Topics processed.')

  // 3. Seed 21 Challenge Days (Aug 12 - Sep 2, 2026)
  console.log('📅 Seeding 21 Challenge Days...')
  const startDate = new Date('2026-08-12')

  for (let i = 1; i <= 21; i++) {
    const dayDate = new Date(startDate)
    dayDate.setDate(startDate.getDate() + (i - 1))

    await prisma.challengeDay.upsert({
      where: {
        userId_dayNumber: {
          userId: user.id,
          dayNumber: i,
        },
      },
      update: {},
      create: {
        userId: user.id,
        dayNumber: i,
        date: dayDate,
        targetHours: 11,
        achievedHours: 0,
        targetApps: 5,
        achievedApps: 0,
        targetDSA: 2,
        achievedDSA: 0,
        completed: false,
      },
    })
  }
  console.log('✅ 21 Challenge Days initialized.')

  console.log('🎉 Database seeding completed successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
