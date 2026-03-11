import { streamText, convertToModelMessages } from 'ai'

export async function POST(req: Request) {
  const { messages, questionContext, resumeContext } = await req.json()

  const systemPrompt = `You are an expert AI interviewer conducting a technical interview. 
You are friendly but professional, and your goal is to help the candidate demonstrate their skills.

Current Question Context:
${questionContext || 'General interview question'}

Candidate Resume Summary:
${resumeContext || 'No resume data available'}

Guidelines:
- Provide thoughtful follow-up questions based on the candidate's answers
- Give constructive feedback when appropriate
- Be encouraging but also challenge the candidate to think deeper
- If the answer is incomplete, guide them toward a more complete response
- Keep responses concise but helpful (2-4 sentences typically)
- When evaluating answers, consider technical accuracy, communication clarity, and problem-solving approach`

  const result = streamText({
    model: 'anthropic/claude-sonnet-4-20250514',
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    maxOutputTokens: 500,
  })

  return result.toUIMessageStreamResponse()
}
