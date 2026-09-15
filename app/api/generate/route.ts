import { NextRequest, NextResponse } from 'next/server'
import { fetchTranscript } from 'youtube-transcript-plus'

export const runtime = 'nodejs'

function extractYouTubeVideoId(input: string): string | null {
  try {
    const url = new URL(input.trim())

    if (url.hostname === 'youtu.be') {
      return url.pathname.slice(1).split('/')[0] || null
    }

    if (
      url.hostname === 'youtube.com' ||
      url.hostname === 'www.youtube.com' ||
      url.hostname === 'm.youtube.com'
    ) {
      const videoId = url.searchParams.get('v')

      if (videoId) {
        return videoId
      }

      if (url.pathname.startsWith('/shorts/')) {
        return url.pathname.split('/shorts/')[1]?.split('/')[0] || null
      }

      if (url.pathname.startsWith('/embed/')) {
        return url.pathname.split('/embed/')[1]?.split('/')[0] || null
      }
    }

    return null
  } catch {
    return null
  }
}

export async function POST(req: NextRequest) {
  try {
    const { type, sourceType, sourceInput } = await req.json()

    let materialText = sourceInput

    if (sourceType === 'youtube') {
      const videoId = extractYouTubeVideoId(sourceInput)

      if (!videoId) {
        return NextResponse.json({
          content: 'Please enter a valid YouTube URL.',
        })
      }

      try {
        console.log('Fetching YouTube transcript for:', videoId)

        const transcriptItems = await fetchTranscript(videoId, {
          retries: 2,
          retryDelay: 1000,
        })

        materialText = transcriptItems
          .map((t) => t.text)
          .join(' ')

        if (!materialText.trim()) {
          return NextResponse.json({
            content:
              'This video has no captions available. Try a different video or paste the text manually.',
          })
        }

        console.log('Transcript successfully fetched.')
      } catch (err) {
        console.error('YouTube transcript error:', err)

        return NextResponse.json({
          content:
            'Could not fetch a transcript from that link. Make sure it is a valid YouTube URL with captions available.',
        })
      }
    }

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

    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
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
              content: systemPrompt,
            },
            {
              role: 'user',
              content: materialText,
            },
          ],
        }),
      }
    )

    const data = await response.json()

    if (data.error) {
      return NextResponse.json({
        content: `Groq error: ${
          data.error.message || JSON.stringify(data.error)
        }`,
      })
    }

    let content =
      data.choices?.[0]?.message?.content ||
      'Something went wrong (empty response).'

    content = content
      .replace(/\*\*/g, '')
      .replace(/^#+\s*/gm, '')
      .replace(/^\*\*\*\s+/gm, '- ')

    return NextResponse.json({ content })
  } catch (err) {
    console.error('API error:', err)

    return NextResponse.json({
      content: 'Something went wrong. Please try again.',
    })
  }
}