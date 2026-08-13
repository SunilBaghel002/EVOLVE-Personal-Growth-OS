# EVOLVE — AI Agent Instructions & Operating Manual

Welcome to **EVOLVE — Personal Growth OS**, built by and for Sunil Baghel.
This document serves as the **mandatory entry point and operating manual** for any AI coding agent (Antigravity, Cursor, Claude, Copilot, etc.) working on this codebase.

---

## 1. Project Context & Purpose

EVOLVE is a full-stack personal productivity system created to track daily study hours, job applications, DSA problem-solving, MERN stack revision, and daily reflections during Sunil's 21-Day Evolution Challenge (Aug 12 – Sep 2, 2026) and beyond.

- **Stack:** Next.js 14+ (App Router), TypeScript (Strict), Tailwind CSS, shadcn/ui, PostgreSQL (Neon), Prisma ORM, NextAuth.js v5 (Google OAuth).
- **Target Audience:** Single-user (Sunil Baghel only).
- **Hosting:** Vercel serverless deployment.

---

## 2. Mandatory PRD Documents

Before starting work on any task, you **MUST** consult the relevant PRD files in the local workspace or project context:

1. [`PRD/project-overview.md`](file:///c:/Users/lenovo/OneDrive/Desktop/Projects/EVOLVE-Personal-Growth-OS/PRD/project-overview.md) — Vision, problem statement, key metrics, and schedule context.
2. [`PRD/architecture.md`](file:///c:/Users/lenovo/OneDrive/Desktop/Projects/EVOLVE-Personal-Growth-OS/PRD/architecture.md) — System architecture, stack rules, database entity design, folder structure layout.
3. [`PRD/code-standard.md`](file:///c:/Users/lenovo/OneDrive/Desktop/Projects/EVOLVE-Personal-Growth-OS/PRD/code-standard.md) — Strict coding standards, naming conventions, max file length (300 lines), Tailwind ordering.
4. [`PRD/context.md`](file:///c:/Users/lenovo/OneDrive/Desktop/Projects/EVOLVE-Personal-Growth-OS/PRD/context.md) — Sunil's daily routine, domain knowledge (job pipelines, DSA confidence ratings, MERN topics).
5. [`PRD/progress-track.md`](file:///c:/Users/lenovo/OneDrive/Desktop/Projects/EVOLVE-Personal-Growth-OS/PRD/progress-track.md) — Master phase breakdown, day-by-day development tasks, and completed item tracker.
6. [`PRD/ui.md`](file:///c:/Users/lenovo/OneDrive/Desktop/Projects/EVOLVE-Personal-Growth-OS/PRD/ui.md) — UI/UX design specifications, dark mode color palette (`#0A0A0A`), component specs.
7. [`PRD/ai-workflow-rules.md`](file:///c:/Users/lenovo/OneDrive/Desktop/Projects/EVOLVE-Personal-Growth-OS/PRD/ai-workflow-rules.md) — Strict rules governing AI code generation and communication.

---

## 3. Golden Rules for AI Coding Agents

1. **NEVER Generate Code Without Context:** Always review `progress-track.md` and related PRDs before implementing anything.
2. **ONE Task at a Time:** Complete one atomic task, run checks, commit, and update `progress-track.md`.
3. **TypeScript Strict Mode Always:** No `any` type (use `unknown` if truly generic), explicit return types for functions, no implicit `undefined`.
4. **Server Components by Default:** Use React Server Components unless client interactivity (hooks, event handlers, browser APIs) is required. Mark client components with `'use client'` explicitly.
5. **Approved Dependencies Only:**
   - **Allowed:** Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, Prisma, NextAuth v5, Zod, React Hook Form, Recharts, Lucide React, date-fns, clsx, tailwind-merge.
   - **Forbidden:** Redux, MUI, Chakra UI, Axios (use `fetch`), Moment.js.
6. **API Response Standard:** Always return standard response wrapper:
   - Success: `{ success: true, data: ... }`
   - Error: `{ success: false, error: { code: '...', message: '...' } }`
7. **No Hardcoded Secrets:** Store secrets strictly in `.env.local` and environment variables.
8. **Follow Tailwind Class Ordering:** Layout -> Position -> Box Model -> Typography -> Bg -> Borders -> Effects -> Transitions -> States -> Responsive.

---

## 4. Expected Project Architecture

Refer to [`PRD/architecture.md`](file:///c:/Users/lenovo/OneDrive/Desktop/Projects/EVOLVE-Personal-Growth-OS/PRD/architecture.md) for full details:

```
src/
├── app/
│   ├── (auth)/login/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx          # Dashboard home
│   │   ├── applications/     # Application Tracker
│   │   ├── dsa/              # DSA Problem Tracker
│   │   ├── logs/             # Daily Reflection Logs
│   │   ├── mern/             # MERN Revision Checklist
│   │   ├── analytics/        # Analytics & Charts
│   │   └── settings/         # Settings Page
│   ├── api/                  # Route Handlers
│   ├── layout.tsx            # Root Layout
│   ├── globals.css           # Global Styles & Theme Variables
│   └── providers.tsx        # React Context Providers
├── components/
│   ├── ui/                   # shadcn components
│   ├── layout/               # Sidebar, Header, MobileNav
│   ├── dashboard/            # StatsCard, TodayLogger, etc.
│   ├── applications/         # ApplicationForm, Table, etc.
│   ├── dsa/                  # DSAForm, DSAList, etc.
│   └── charts/               # Recharts components
├── lib/
│   ├── prisma.ts             # Prisma client singleton
│   ├── auth.ts               # NextAuth configuration
│   ├── utils.ts              # Helper functions (cn, etc.)
│   ├── constants.ts          # Constants & Enums
│   └── validations/          # Zod validation schemas
├── hooks/                    # Custom React hooks
├── types/                    # TypeScript interfaces & types
└── middleware.ts             # Route protection middleware
```

---

## 5. Workflow Execution Checklist for Agents

When assigned a task from `progress-track.md`:

1. **Verify Current Phase & Task:** Confirm which phase/task is currently active.
2. **Review Code Standards:** Ensure imports, file paths, and function signatures adhere to standard guidelines.
3. **Write/Edit Code:** Make precise edits, maintaining clean modularity (<300 lines per file).
4. **Run Verification:** Execute `npx tsc --noEmit` and check for clean compilation.
5. **Update Progress:** Mark completed items in `PRD/progress-track.md`.
6. **Commit & Push:** Commit with semantic commit messages (e.g., `feat(applications): add application table component`).

---

*EVOLVE — Track > Guess | Simple > Clever | Ship > Perfect*
