/**
 * Spaced Repetition Engine for DSA Problems
 * Calculates next revision date based on confidence rating (1-5 scale)
 *
 * Rules:
 * - Confidence 1-2: Revise in 2 days (Heavy struggle / needs quick refresh)
 * - Confidence 3: Revise in 5 days (Moderate understanding)
 * - Confidence 4: Revise in 10 days (Good confidence)
 * - Confidence 5: Revise in 20 days (Mastered)
 */
export function calculateNextRevision(solvedDate: Date, confidence: number): Date {
  const nextDate = new Date(solvedDate)

  let daysToAdd = 5 // default fallback for confidence 3

  switch (confidence) {
    case 1:
    case 2:
      daysToAdd = 2
      break
    case 3:
      daysToAdd = 5
      break
    case 4:
      daysToAdd = 10
      break
    case 5:
      daysToAdd = 20
      break
    default:
      daysToAdd = 5
  }

  nextDate.setDate(nextDate.getDate() + daysToAdd)
  return nextDate
}
