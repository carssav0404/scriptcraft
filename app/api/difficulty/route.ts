import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { text } = await req.json()

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'openai/gpt-oss-120b',
      messages: [
        {
          role: 'system',
          content:
            'You judge how easy or hard a topic is for an average student to understand. Respond in EXACTLY this format, nothing else:\nLevel: [Easy/Medium/Hard]\nNote: [one short sentence explaining why, and who it fits best]',
        },
        { role: 'user', content: text },
      ],
    }),
  })

  const data = await response.json()
  const raw = data.choices?.[0]?.message?.content || 'Level: Medium\nNote: Could not analyze this topic.'

  const levelMatch = raw.match(/Level:\s*(\w+)/i)
  const noteMatch = raw.match(/Note:\s*(.+)/i)

  return NextResponse.json({
    level: levelMatch?.[1] || 'Medium',
    note: noteMatch?.[1] || raw,
  })
}