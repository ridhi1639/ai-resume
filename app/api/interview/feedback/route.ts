import { generateText, Output } from 'ai'
import { groq } from '@ai-sdk/groq'
import { z } from 'zod'

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
    const { questions, answers, resumeContext } = await req.json()

    const qaPairs = questions
      .map(
        (q: string, i: number) =>
          `Question ${i + 1}: ${q}\nAnswer: ${
            answers[i] || 'No answer provided'
          }`
      )
      .join('\n\n')

    const { output } = await generateText({
      model: groq('llama-3.3-70b-versatile'),

      output: Output.object({
        schema: InterviewFeedbackSchema,
      }),

      prompt: `
Analyze this mock interview.

Resume:
${resumeContext}

Interview:
${qaPairs}
`,
    })

    return Response.json(output)

  } catch (error) {
    console.error('Feedback generation error:', error)

    return Response.json(
      { error: 'Failed to generate feedback' },
      { status: 500 }
    )
  }
}