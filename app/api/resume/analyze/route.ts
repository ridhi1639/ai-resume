import { generateText, Output } from 'ai'
import { groq } from '@ai-sdk/groq'
import { z } from 'zod'

export const runtime = 'nodejs'

const ResumeAnalysisSchema = z.object({
  score: z.number(),
  skills: z.array(z.string()),
  experience: z.object({
    years: z.number(),
    level: z.string(),
    companies: z.array(z.string()),
  }),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  keywords: z.array(z.string()),
  summary: z.string(),
})

export async function POST(req: Request) {
  try {
    const { resumeText } = await req.json()

    if (!resumeText) {
      return Response.json({ error: 'No resume text provided' }, { status: 400 })
    }

    const { output } = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      output: Output.object({ schema: ResumeAnalysisSchema }),
      prompt: `Analyze the following resume and extract structured information.
Be thorough but concise.

Resume:
${resumeText}`,
    })

    return Response.json(output)
  } catch (error) {
    console.error('Resume analysis error:', error)
    return Response.json({ error: 'Failed to analyze resume' }, { status: 500 })
  }
}
