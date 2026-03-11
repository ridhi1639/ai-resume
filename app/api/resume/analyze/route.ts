import { generateText, Output } from 'ai'
import { z } from 'zod'

const ResumeAnalysisSchema = z.object({
  score: z.number().describe('Overall resume score from 0-100'),
  skills: z.array(z.string()).describe('List of identified technical and soft skills'),
  experience: z.object({
    years: z.number().describe('Estimated years of experience'),
    level: z.string().describe('Junior, Mid-level, Senior, or Lead'),
    companies: z.array(z.string()).describe('List of companies mentioned'),
  }),
  strengths: z.array(z.string()).describe('Key strengths identified in the resume'),
  improvements: z.array(z.string()).describe('Suggested improvements for the resume'),
  keywords: z.array(z.string()).describe('Important keywords for ATS optimization'),
  summary: z.string().describe('Brief professional summary'),
})

export async function POST(req: Request) {
  const { resumeText } = await req.json()

  if (!resumeText) {
    return Response.json({ error: 'No resume text provided' }, { status: 400 })
  }

  try {
    const { output } = await generateText({
      model: 'anthropic/claude-sonnet-4-20250514',
      output: Output.object({ schema: ResumeAnalysisSchema }),
      prompt: `Analyze the following resume and extract structured information. 
Be thorough but concise in your analysis.

Resume:
${resumeText}

Provide a comprehensive analysis including skills, experience level, strengths, 
areas for improvement, and ATS-friendly keywords.`,
    })

    return Response.json(output)
  } catch (error) {
    console.error('Resume analysis error:', error)
    return Response.json({ error: 'Failed to analyze resume' }, { status: 500 })
  }
}
