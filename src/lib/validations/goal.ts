import { z } from 'zod'

export const createWeeklyGoalSchema = z.object({
  weekNumber: z.number().int().min(1, 'Week number must be at least 1').max(52, 'Week number cannot exceed 52'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  studyHoursTarget: z.number().min(0, 'Study hours target cannot be negative').default(77),
  appsTarget: z.number().int().min(0, 'Applications target cannot be negative').default(35),
  dsaTarget: z.number().int().min(0, 'DSA target cannot be negative').default(15),
  mernTopicsTarget: z.number().int().min(0, 'MERN topics target cannot be negative').default(5),
  notes: z.string().optional().nullable(),
})

export type CreateWeeklyGoalInput = z.infer<typeof createWeeklyGoalSchema>
