import {
  streamText,
  convertToModelMessages,
} from 'ai'

import { groq } from '@ai-sdk/groq'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const { messages, questionContext, resumeContext } = await req.json()

  const systemPrompt = `You are an expert AI interviewer conducting a technical interview.

You are friendly but professional.

Current Question Context:
${questionContext || 'General interview question'}

Candidate Resume Summary:
${resumeContext || 'No resume data available'}
`

  const result = streamText({
    model: groq('llama-3.3-70b-versatile'),

    system: systemPrompt,

    messages: await convertToModelMessages(messages),

    maxOutputTokens: 500,
  })

  return result.toUIMessageStreamResponse()
}