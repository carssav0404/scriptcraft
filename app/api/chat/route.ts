import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { type, messages } = await req.json()

  const systemPrompt =
    type === 'speech'
      ? 'You are a helpful assistant that writes and revises speech scripts based on what the user asks for. Keep responses focused on the script itself.'
      : 'You are a helpful assistant that writes and revises presentation scripts (slide by slide) based on what the user asks for. Keep responses focused on the script itself.'

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'openai/gpt-oss-120b',
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
    }),
  })

  const data = await response.json()

  if (data.error) {
    return NextResponse.json({ content: `Error: ${data.error.message || 'something went wrong'}` })
  }

  const content = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.'
  return NextResponse.json({ content })
}