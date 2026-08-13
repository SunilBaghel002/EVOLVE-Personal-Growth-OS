export const APP_NAME = 'EVOLVE'
export const APP_TAGLINE = 'Personal Growth OS'
export const APP_OWNER = 'Sunil Baghel'

// Challenge Timeline (21 Days: Aug 12, 2026 - Sep 2, 2026)
export const CHALLENGE_START_DATE = '2026-08-12'
export const CHALLENGE_END_DATE = '2026-09-02'
export const TOTAL_CHALLENGE_DAYS = 21

// Study Categories & Target Hours
export const STUDY_CATEGORIES = [
  { id: 'gate', label: 'GATE 2027', color: '#3B82F6' },
  { id: 'interview', label: 'Interview Prep', color: '#8B5CF6' },
  { id: 'project', label: 'Project / Client', color: '#F59E0B' },
  { id: 'mern', label: 'MERN Revision', color: '#10B981' },
] as const

export const DAILY_STUDY_GOAL_HOURS = 11

// Application Status Pipeline
export const APPLICATION_STATUSES = [
  'SAVED',
  'APPLIED',
  'OA_RECEIVED',
  'OA_COMPLETED',
  'INTERVIEW_SCHEDULED',
  'INTERVIEW_COMPLETED',
  'OFFER_RECEIVED',
  'ACCEPTED',
  'REJECTED',
  'GHOSTED',
  'WITHDRAWN',
] as const

// Application Platforms
export const APPLICATION_PLATFORMS = [
  'LinkedIn',
  'Wellfound',
  'Internshala',
  'Cutshort',
  'Instahyre',
  'Company Careers',
  'Referral',
  'Other',
] as const

// DSA Difficulty Levels
export const DSA_DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD'] as const

// DSA Topics (Learning Order for Sunil)
export const DSA_TOPICS = [
  'Arrays',
  'Strings',
  'HashMap',
  'Two Pointers',
  'Linked Lists',
  'Stacks & Queues',
  'Trees',
  'BST',
  'Heap',
  'Graphs',
  'BFS / DFS',
  'Dynamic Programming',
  'Greedy',
  'Backtracking',
  'Advanced',
] as const
