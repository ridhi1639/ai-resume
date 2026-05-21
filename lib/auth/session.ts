import { cookies } from 'next/headers'
import { randomUUID } from 'crypto'
import { prisma } from '@/lib/prisma'

const SESSION_COOKIE = 'app_session_id'

export async function getOrCreateUser() {
  const jar = await cookies()
  let sessionId = jar.get(SESSION_COOKIE)?.value
  const isNew = !sessionId

  if (!sessionId) {
    sessionId = randomUUID()
  }

  const user = await prisma.user.upsert({
    where: { sessionId },
    create: { sessionId },
    update: {},
  })

  if (isNew) {
    jar.set(SESSION_COOKIE, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    })
  }

  return user
}
