import { z } from 'zod'

export const createDSAProblemSchema = z.object({
  title: z.string().min(1, 'Problem title is required').max(150),
  problemUrl: z.string().url('Invalid URL format').or(z.literal('')).optional(),
  platform: z.string().default('LeetCode'),
  topic: z.string().min(1, 'Topic is required'),
  difficulty: z.string().min(1, 'Difficulty is required'),
  timeTakenMinutes: z.number().min(0).max(300).optional(),
  confidence: z.number().min(1).max(5).default(3),
  notes: z.string().max(3000).optional(),
  solvedDate: z.string().optional(),
})

export const updateDSAProblemSchema = createDSAProblemSchema.partial()

export type CreateDSAProblemInput = z.infer<typeof createDSAProblemSchema>
export type UpdateDSAProblemInput = z.infer<typeof updateDSAProblemSchema>
