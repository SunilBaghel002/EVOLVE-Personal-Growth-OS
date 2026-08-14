import { z } from 'zod'

export const updateMERNTopicSchema = z.object({
  completed: z.boolean().optional(),
  confidence: z.number().int().min(1).max(5).optional(),
  notes: z.string().nullable().optional(),
})

export type UpdateMERNTopicInput = z.infer<typeof updateMERNTopicSchema>
