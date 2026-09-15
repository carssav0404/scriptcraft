import { NextRequest, NextResponse } from 'next/server'

// pdf-parse butuh beberapa API browser yang gak ada di server — polyfill kosong
// ini cukup karena kita cuma butuh extract teks, bukan render visual PDF-nya
if (typeof (globalThis as any).DOMMatrix === 'undefined') {
  ;(globalThis as any).DOMMatrix = class {}
}
if (typeof (globalThis as any).ImageData === 'undefined') {
  ;(globalThis as any).ImageData = class {}
}
if (typeof (globalThis as any).Path2D === 'undefined') {
  ;(globalThis as any).Path2D = class {}
}

export async function POST(req: NextRequest) {
  try {
    const { fileBase64 } = await req.json()

    if (!fileBase64) {
      return NextResponse.json({ text: '', error: 'No file received.' })
    }

    // pakai file internal library langsung, biar gak kena bug debug-mode di index.js
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require('pdf-parse/lib/pdf-parse.js')

    const buffer = Buffer.from(fileBase64, 'base64')
    const data = await pdfParse(buffer)

    const text = (data.text || '').trim()

    if (text.length < 20) {
      return NextResponse.json({
        text: '',
        error: 'This PDF appears to be a scanned image with no selectable text. Please paste the text manually instead.',
      })
    }

    return NextResponse.json({ text })
  } catch (err: any) {
    return NextResponse.json({ text: '', error: `Could not read this PDF: ${err.message || 'unknown error'}` })
  }
}