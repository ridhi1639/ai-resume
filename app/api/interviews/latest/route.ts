import { prisma } from '@/lib/prisma'
import { getOrCreateUser } from '@/lib/auth/session'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const user = await getOrCreateUser()

    const interview = await prisma.interview.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    })

    if (!interview) {
      return Response.json({ interview: null })
    }

    return Response.json({
      interview: {
        id: interview.id,
        questions: JSON.parse(interview.questions),
        answers: JSON.parse(interview.answers),
        elapsedSeconds: interview.elapsedSeconds,
        feedback: interview.feedback ? JSON.parse(interview.feedback) : null,
        overallScore: interview.overallScore,
        createdAt: interview.createdAt,
      },
    })
  } catch (error) {
    console.error('Latest interview error:', error)
    return Response.json({ error: 'Failed to load interview' }, { status: 500 })
  }
}
