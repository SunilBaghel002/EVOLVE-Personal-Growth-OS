import { z } from 'zod'

export const createInterviewSchema = z.object({
  applicationId: z.string().min(1, 'Application is required'),
  roundName: z.string().min(1, 'Round name is required'),
  roundNumber: z.number().int().min(1).default(1),
  scheduledAt: z.string().optional().nullable(),
  completedAt: z.string().optional().nullable(),
  status: z.enum(['SCHEDULED', 'COMPLETED', 'PASSED', 'FAILED', 'CANCELLED']).default('SCHEDULED'),
  feedback: z.string().optional().nullable(),
})

export const updateInterviewSchema = createInterviewSchema.partial()

export const createQuestionSchema = z.object({
  applicationId: z.string().optional().nullable(),
  interviewId: z.string().optional().nullable(),
  question: z.string().min(1, 'Question text is required'),
  category: z.enum(['DSA', 'System Design', 'Behavioral', 'Tech', 'React/MERN', 'CS Core']).default('DSA'),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).default('MEDIUM'),
  answer: z.string().optional().nullable(),
})

export const updateQuestionSchema = createQuestionSchema.partial()

export type CreateInterviewInput = z.infer<typeof createInterviewSchema>
export type UpdateInterviewInput = z.infer<typeof updateInterviewSchema>
export type CreateQuestionInput = z.infer<typeof createQuestionSchema>
export type UpdateQuestionInput = z.infer<typeof updateQuestionSchema>
