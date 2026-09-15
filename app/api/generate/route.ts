import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { type, sourceType, sourceInput } = await req.json()

  const systemPrompt =
    type === 'speech'
      ? `You are an expert speechwriter. Turn the source material into a spoken speech script:
- Start with a strong hook (a question, a fact, or a short story)
- 2-3 main points, written in a conversational, spoken tone (not a written/formal tone)
- End with a memorable closing statement
- Add an estimated speaking duration at the end (assume 130 words per minute)
- Write in plain text only. Do NOT use markdown formatting (no asterisks, no **bold**, no # headers, no bullet symbols like * or -).`
      : `You are an expert presentation writer. Turn the source material into a slide-by-slide presentation script:
- Break it into clear slides, labeled simply "Slide 1", "Slide 2", etc. on their own line
- Each slide: a short headline on the first line, then 2-4 speaker note lines below it
- Keep slides concise (not paragraphs)
- End with a summary slide
- Write in plain text only. Do NOT use markdown formatting (no asterisks, no **bold**, no # headers, no bullet symbols like * or -). Use plain dashes or numbers only where natural.`

  const userPrompt =
    sourceType === 'topic'
      ? `Research and write a script about this topic: "${sourceInput}". Use your own knowledge to cover the key points a student or presenter would need.`
      : sourceInput

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'openai/gpt-oss-120b',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    }),
  })

  const data = await response.json()

  if (data.error) {
    return NextResponse.json({ content: `Groq error: ${data.error.message || JSON.stringify(data.error)}` })
  }

  let content = data.choices?.[0]?.message?.content || 'Something went wrong (empty response).'
  content = content.replace(/\*\*/g, '').replace(/^#+\s*/gm, '').replace(/^\*\s+/gm, '- ')

  return NextResponse.json({ content })
}