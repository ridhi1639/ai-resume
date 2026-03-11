import { generateText, Output } from 'ai'
import { z } from 'zod'

const InterviewFeedbackSchema = z.object({
  overallScore: z.number().describe('Overall interview performance score 0-100'),
  technicalScore: z.number().describe('Technical knowledge score 0-100'),
  communicationScore: z.number().describe('Communication clarity score 0-100'),
  problemSolvingScore: z.number().describe('Problem-solving ability score 0-100'),
  strengths: z.array(z.string()).describe('Key strengths demonstrated'),
  improvements: z.array(z.string()).describe('Areas needing improvement'),
  questionFeedback: z.array(z.object({
    question: z.string(),
    score: z.number(),
    feedback: z.string(),
    suggestions: z.string(),
  })).describe('Detailed feedback for each question'),
  overallFeedback: z.string().describe('General feedback summary'),
  nextSteps: z.array(z.string()).describe('Recommended next steps for preparation'),
})

export async function POST(req: Request) {
  const { questions, answers, resumeContext } = await req.json()

  if (!questions || !answers) {
    return Response.json({ error: 'Missing questions or answers' }, { status: 400 })
  }

  const qaPairs = questions.map((q: string, i: number) => 
    `Question ${i + 1}: ${q}\nAnswer: ${answers[i] || 'No answer provided'}`
  ).join('\n\n')

  try {
    const { output } = await generateText({
      model: 'anthropic/claude-sonnet-4-20250514',
      output: Output.object({ schema: InterviewFeedbackSchema }),
      prompt: `You are an expert interview coach analyzing a mock interview performance.

Candidate Background:
${resumeContext || 'No resume information available'}

Interview Q&A:
${qaPairs}

Provide comprehensive, constructive feedback that will help the candidate improve.
Be specific with examples from their answers and actionable suggestions.`,
    })

    return Response.json(output)
  } catch (error) {
    console.error('Feedback generation error:', error)
    return Response.json({ error: 'Failed to generate feedback' }, { status: 500 })
  }
}
