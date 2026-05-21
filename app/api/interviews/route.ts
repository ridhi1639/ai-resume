import { generateText, Output } from 'ai'
import { groq } from '@ai-sdk/groq'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getOrCreateUser } from '@/lib/auth/session'

export const runtime = 'nodejs'

const InterviewFeedbackSchema = z.object({
  overallScore: z.number(),
  technicalScore: z.number(),
  communicationScore: z.number(),
  problemSolvingScore: z.number(),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  questionFeedback: z.array(
    z.object({
      question: z.string(),
      score: z.number(),
      feedback: z.string(),
      suggestions: z.string(),
    })
  ),
  overallFeedback: z.string(),
  nextSteps: z.array(z.string()),
})

export async function POST(req: Request) {
  try {
    const user = await getOrCreateUser()
    const { questions, answers, elapsedSeconds } = await req.json()

    if (!questions?.length || !answers?.length) {
      return Response.json(
        { error: 'questions and answers are required' },
        { status: 400 }
      )
    }

    const latestResume = await prisma.resume.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    })

    const resumeContext = latestResume?.resumeText ?? 'No resume on file'

    const qaPairs = (questions as string[])
      .map(
        (q: string, i: number) =>
          `Question ${i + 1}: ${q}\nAnswer: ${(answers as string[])[i] || 'No answer provided'}`
      )
      .join('\n\n')

    let feedback: z.infer<typeof InterviewFeedbackSchema> | null = null
    let overallScore: number | null = null

    try {
      const { output } = await generateText({
        model: groq('llama-3.3-70b-versatile'),
        output: Output.object({ schema: InterviewFeedbackSchema }),
        prompt: `Analyze this mock interview and provide structured feedback.

Resume context:
${resumeContext}

Interview Q&A:
${qaPairs}`,
      })
      feedback = output
      overallScore = Math.round(output.overallScore)
    } catch (aiError) {
      console.error('Interview feedback AI error:', aiError)
    }

    const interview = await prisma.interview.create({
      data: {
        userId: user.id,
        questions: JSON.stringify(questions),
        answers: JSON.stringify(answers),
        elapsedSeconds: elapsedSeconds ?? 0,
        feedback: feedback ? JSON.stringify(feedback) : null,
        overallScore,
        status: 'completed',
      },
    })

    return Response.json({
      id: interview.id,
      overallScore: interview.overallScore,
      feedback,
    })
  } catch (error) {
    console.error('Save interview error:', error)
    return Response.json({ error: 'Failed to save interview' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const user = await getOrCreateUser()

    const interviews = await prisma.interview.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: {
        id: true,
        overallScore: true,
        elapsedSeconds: true,
        createdAt: true,
        status: true,
      },
    })

    return Response.json({ interviews })
  } catch (error) {
    console.error('List interviews error:', error)
    return Response.json({ error: 'Failed to load interviews' }, { status: 500 })
  }
}
