import { z } from 'zod'

const dateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/

export const dailyLogSchema = z.object({
  date: z
    .string()
    .regex(dateOnlyRegex, 'Invalid date format (YYYY-MM-DD)')
    .optional(),
  interviewHours: z.number().min(0).max(24).default(0), // DSA / Interview prep
  mernHours: z.number().min(0).max(24).default(0), // MERN Stack
  gateHours: z.number().min(0).max(24).default(0), // CS Core / GATE / Aptitude
  projectHours: z.number().min(0).max(24).default(0), // Build Projects
  exerciseDone: z.boolean().default(false),
  energyLevel: z.number().min(1).max(5).default(3),
  focusLevel: z.number().min(1).max(5).default(3),
  moodRating: z.number().min(1).max(5).default(3),
  whatWentWell: z.string().max(2000).optional(),
  whatWentWrong: z.string().max(2000).optional(),
  blockers: z.string().max(2000).optional(),
  tomorrowPriority: z.string().max(2000).optional(),
})

export type DailyLogInput = z.infer<typeof dailyLogSchema>
