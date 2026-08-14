import { APPLICATION_STATUSES, APPLICATION_PLATFORMS, DSA_DIFFICULTIES, DSA_TOPICS } from '@/lib/constants'

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number]
export type ApplicationPlatform = (typeof APPLICATION_PLATFORMS)[number]
export type DSADifficulty = (typeof DSA_DIFFICULTIES)[number]
export type DSATopic = (typeof DSA_TOPICS)[number]

export interface UserProfile {
  id: string
  name: string
  email: string
  image?: string
}

export interface JobApplication {
  id: string
  companyName: string
  role: string
  platform: ApplicationPlatform
  appliedDate: string
  status: ApplicationStatus
  jobUrl?: string
  location?: string
  salaryRange?: string
  contactPerson?: string
  contactEmail?: string
  usedReferral: boolean
  notes?: string
  followUpDate?: string
  createdAt: string
  updatedAt: string
}

export interface DSAProblemEntry {
  id: string
  title: string
  problemUrl?: string
  platform: string
  topic: DSATopic
  difficulty: DSADifficulty
  timeTakenMinutes?: number
  confidence: number // 1-5 scale
  notes?: string
  solvedDate: string
  nextRevisionDate?: string
  createdAt: string
}

export interface DailyLogEntry {
  id: string
  date: string
  gateHours: number
  interviewHours: number
  projectHours: number
  mernHours: number
  totalHours: number
  exerciseDone: boolean
  whatWentWell?: string
  whatWentWrong?: string
  blockers?: string
  tomorrowPriority?: string
  energyLevel?: number
  focusLevel?: number
  moodRating?: number
  createdAt: string
}

export interface MERNTopicEntry {
  id: string
  category: string
  title: string
  completed: boolean
  confidence: number
  notes?: string
  order: number
  lastRevisedAt?: string
}
