import { z } from 'zod'

const httpUrlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/i
const dateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/

export const createDSAProblemSchema = z.object({
  title: z.string().min(1, 'Problem title is required').max(150),
  problemUrl: z
    .string()
    .regex(httpUrlRegex, 'URL must be a valid http:// or https:// link')
    .or(z.literal(''))
    .optional(),
  platform: z.string().min(1, 'Platform is required'),
  topic: z.string().min(1, 'Topic is required'),
  difficulty: z.string().min(1, 'Difficulty is required'),
  timeTakenMinutes: z.number().min(0).max(300).optional(),
  confidence: z.number().min(1).max(5),
  notes: z.string().max(3000).optional(),
  solvedDate: z
    .string()
    .regex(dateOnlyRegex, 'Invalid date format (YYYY-MM-DD)')
    .or(z.literal(''))
    .optional(),
})

export const updateDSAProblemSchema = createDSAProblemSchema.partial()

export type CreateDSAProblemInput = z.infer<typeof createDSAProblemSchema>
export type UpdateDSAProblemInput = z.infer<typeof updateDSAProblemSchema>
