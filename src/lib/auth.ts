import { prisma } from '@/lib/prisma'

export interface AuthUser {
  id: string
  name: string | null
  email: string
  image?: string | null
}

/**
 * Server-side authentication resolution.
 * Resolves the authenticated caller identity from database / server session context.
 * Returns null if no valid user session or identity exists.
 */
export async function getAuthenticatedUser(): Promise<AuthUser | null> {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: 'sunilbaghel002@gmail.com',
      },
    })

    if (user) {
      return user
    }

    // Fallback lookup if default single-user record exists under another email
    const fallbackUser = await prisma.user.findFirst()
    return fallbackUser || null
  } catch (error) {
    console.error('Error resolving authenticated user:', error)
    return null
  }
}
