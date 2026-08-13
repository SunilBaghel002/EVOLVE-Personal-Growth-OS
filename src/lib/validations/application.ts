import { z } from 'zod'

export const createApplicationSchema = z.object({
  companyName: z.string().min(1, 'Company name is required').max(100),
  role: z.string().min(1, 'Role title is required').max(100),
  platform: z.string().min(1, 'Platform is required'),
  status: z.string().min(1, 'Status is required'),
  jobUrl: z.string().url('Invalid URL format').or(z.literal('')).optional(),
  location: z.string().max(100).optional(),
  salaryRange: z.string().max(100).optional(),
  contactPerson: z.string().max(100).optional(),
  contactEmail: z.string().email('Invalid email address').or(z.literal('')).optional(),
  usedReferral: z.boolean().default(false),
  appliedDate: z.string().optional(),
  followUpDate: z.string().optional(),
  notes: z.string().max(2000).optional(),
})

export const updateApplicationSchema = createApplicationSchema.partial()

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>
export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>
