import { prisma } from '@/lib/prisma'
import { getOrCreateUser } from '@/lib/auth/session'

export const runtime = 'nodejs'

function extractScore(analysis: unknown): number | null {
  if (!analysis || typeof analysis !== 'object') return null
  const a = analysis as Record<string, unknown>
  if (typeof a.score === 'number') return Math.round(a.score)
  return null
}

export async function POST(req: Request) {
  try {
    const user = await getOrCreateUser()
    const { fileName, resumeText, analysis } = await req.json()

    if (!resumeText || !analysis) {
      return Response.json(
        { error: 'resumeText and analysis are required' },
        { status: 400 }
      )
    }

    const resume = await prisma.resume.create({
      data: {
        userId: user.id,
        fileName: fileName ?? null,
        resumeText,
        analysis: JSON.stringify(analysis),
        score: extractScore(analysis),
      },
    })

    return Response.json({ id: resume.id, score: resume.score })
  } catch (error) {
    console.error('Save resume error:', error)
    return Response.json({ error: 'Failed to save resume' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const user = await getOrCreateUser()

    const resume = await prisma.resume.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    })

    if (!resume) {
      return Response.json({ resume: null })
    }

    return Response.json({
      resume: {
        id: resume.id,
        fileName: resume.fileName,
        resumeText: resume.resumeText,
        analysis: JSON.parse(resume.analysis),
        score: resume.score,
        createdAt: resume.createdAt,
      },
    })
  } catch (error) {
    console.error('Get resume error:', error)
    return Response.json({ error: 'Failed to load resume' }, { status: 500 })
  }
}
