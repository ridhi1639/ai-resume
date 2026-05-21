import { prisma } from '@/lib/prisma'
import { getOrCreateUser } from '@/lib/auth/session'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const user = await getOrCreateUser()

    const [latestResume, interviews, interviewCount, avgResult] = await Promise.all([
      prisma.resume.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.interview.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          overallScore: true,
          createdAt: true,
        },
      }),
      prisma.interview.count({ where: { userId: user.id } }),
      prisma.interview.aggregate({
        where: { userId: user.id, overallScore: { not: null } },
        _avg: { overallScore: true },
      }),
    ])

    const analysis = latestResume?.analysis
      ? (JSON.parse(latestResume.analysis) as Record<string, unknown>)
      : null
    const skills = Array.isArray(analysis?.skills)
      ? (analysis.skills as string[])
      : []

    return Response.json({
      resumeScore: latestResume?.score ?? null,
      skills,
      interviewCount,
      averageScore: avgResult._avg.overallScore
        ? Math.round(avgResult._avg.overallScore)
        : null,
      recentInterviews: interviews.map((i) => ({
        id: i.id,
        score: i.overallScore ?? 0,
        date: i.createdAt,
      })),
      hasResume: !!latestResume,
    })
  } catch (error) {
    console.error('Dashboard error:', error)
    return Response.json({ error: 'Failed to load dashboard' }, { status: 500 })
  }
}
