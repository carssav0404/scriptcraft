'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { PageBackground } from '@/components/PageBackground'
import { ArrowLeft, Lightbulb, Newspaper, FileText, Upload, Gauge, MessageCircle, Send } from 'lucide-react'

const TABS = [
  { id: 'topic', label: 'Quick Topic', icon: Lightbulb },
  { id: 'news', label: 'News Text', icon: Newspaper },
  { id: 'pdf', label: 'PDF Document', icon: FileText },
  { id: 'chat', label: 'AI Chat', icon: MessageCircle },
  { id: 'difficulty', label: 'Check Level', icon: Gauge },
]

type ChatMsg = { role: 'user' | 'assistant'; content: string }

export default function ModePage() {
  const router = useRouter()
  const params = useParams()
  const type = params.type as string
  const accent = type === 'speech' ? '#D98BA0' : '#8FA382'

  const [tab, setTab] = useState('topic')
  const [input, setInput] = useState('')
  const [pdfFileName, setPdfFileName] = useState('')
  const [pdfLoading, setPdfLoading] = useState(false)
  const [pdfError, setPdfError] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const [difficultyResult, setDifficultyResult] = useState<{ level: string; note: string } | null>(null)
  const [difficultyLoading, setDifficultyLoading] = useState(false)

  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([
    { role: 'assistant', content: "Tell me what you'd like the script to be about, or paste something you want turned into a script." },
  ])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPdfFileName(file.name)
    setPdfLoading(true)
    setPdfError('')
    setInput('')

    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve((reader.result as string).split(',')[1])
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      const res = await fetch('/api/parse-pdf', {
        method: 'POST',
        body: JSON.stringify({ fileBase64: base64 }),
      })
      const data = await res.json()

      if (data.error) {
        setPdfError(data.error)
      } else {
        setInput(data.text || '')
      }
    } catch (err) {
      setPdfError('Something went wrong reading this file. Try again or paste the text manually.')
    } finally {
      setPdfLoading(false)
    }
  }

  const generate = async () => {
    setLoading(true)
    setResult('')
    const res = await fetch('/api/generate', {
      method: 'POST',
      body: JSON.stringify({ type, sourceType: tab, sourceInput: input }),
    })
    const data = await res.json()
    setResult(data.content)

    await supabase.from('scripts').insert({
      folder_id: params.id,
      type,
      source_type: tab,
      source_input: input,
      content: data.content,
    })
    setLoading(false)
  }

  const checkDifficulty = async () => {
    setDifficultyLoading(true)
    setDifficultyResult(null)
    const res = await fetch('/api/difficulty', {
      method: 'POST',
      body: JSON.stringify({ text: input }),
    })
    const data = await res.json()
    setDifficultyResult(data)
    setDifficultyLoading(false)
  }

  const sendChat = async () => {
    if (!chatInput.trim()) return
    const newMessages: ChatMsg[] = [...chatMessages, { role: 'user', content: chatInput }]
    setChatMessages(newMessages)
    setChatInput('')
    setChatLoading(true)

    const res = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ type, messages: newMessages }),
    })
    const data = await res.json()
    const updated: ChatMsg[] = [...newMessages, { role: 'assistant', content: data.content }]
    setChatMessages(updated)
    setChatLoading(false)
  }

  const saveChatMessage = async (content: string) => {
    await supabase.from('scripts').insert({
      folder_id: params.id,
      type,
      source_type: 'chat',
      source_input: 'AI Chat conversation',
      content,
    })
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <PageBackground variant="faded" image="/main-bg.jpg" />
      <div className="relative z-10 px-6 py-12 max-w-3xl mx-auto">
        <button
          onClick={() => router.push(`/project/${params.id}`)}
          className="flex items-center gap-2 text-base text-[#332920]/50 hover:text-[#332920] mb-8"
        >
          <ArrowLeft size={20} /> back
        </button>

        <h1
          style={{ fontFamily: "'Fredoka', sans-serif" }}
          className="text-4xl font-semibold mb-2 capitalize"
        >
          {type}
        </h1>
        <p className="text-base text-[#332920]/50 mb-8">
          Pick a source, and let AI put the script together.
        </p>

        <div className="flex flex-wrap gap-3 mb-8">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              style={tab === id ? { background: accent, borderColor: accent } : {}}
              className={`flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium border transition-colors ${
                tab === id
                  ? 'text-white'
                  : 'text-[#332920]/60 border-[#332920]/15 hover:border-[#332920]/30'
              }`}
            >
              <Icon size={18} /> {label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-3xl border border-[#332920]/8 p-8">
          {tab === 'topic' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#332920]/70 mb-3">
                Type a topic — AI will research it and write the script for you.
              </label>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g. the impact of plastic waste on oceans"
                className="w-full border border-[#332920]/15 rounded-2xl px-4 py-4 text-base outline-none"
              />
            </div>
          )}

          {tab === 'news' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#332920]/70 mb-3">
                Paste the news text here — the source will be cited in the script.
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={8}
                placeholder="Paste the news text or article link..."
                className="w-full border border-[#332920]/15 rounded-2xl px-4 py-4 text-base outline-none resize-none"
              />
            </div>
          )}

          {tab === 'pdf' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#332920]/70 mb-3">
                Upload a PDF document as the source material.
              </label>
              <label className="border-2 border-dashed border-[#332920]/15 rounded-2xl py-8 flex flex-col items-center gap-2 text-[#332920]/40 cursor-pointer hover:border-[#332920]/30 transition-colors mb-4">
                <Upload size={24} />
                <span className="text-sm">
                  {pdfLoading ? 'Reading PDF...' : pdfFileName || 'Click to select a PDF file'}
                </span>
                <input type="file" accept="application/pdf" onChange={handlePdfUpload} className="hidden" />
              </label>

              {pdfError && (
                <p className="text-sm text-red-500 mb-4">{pdfError}</p>
              )}

              <label className="block text-sm font-medium text-[#332920]/70 mb-3">
                Extracted text (you can edit it, or paste your own):
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={6}
                placeholder="Text from the PDF will appear here — you can also type or paste directly."
                className="w-full border border-[#332920]/15 rounded-2xl px-4 py-4 text-base outline-none resize-none"
              />
            </div>
          )}

          {tab === 'chat' && (
            <div className="mb-2">
              <div className="flex flex-col h-[360px] mb-4">
                <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-1">
                  {chatMessages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className="max-w-[85%]">
                        <div
                          style={m.role === 'user' ? { background: accent } : {}}
                          className={`rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
                            m.role === 'user' ? 'text-white' : 'bg-[#FBF4EC] text-[#332920]'
                          }`}
                        >
                          {m.content}
                        </div>
                        {m.role === 'assistant' && i > 0 && (
                          <button
                            onClick={() => saveChatMessage(m.content)}
                            className="text-xs text-[#332920]/40 mt-1 hover:text-[#332920]/70"
                          >
                            Save this as a script
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-[#FBF4EC] rounded-2xl px-4 py-3 text-sm text-[#332920]/50">
                        Thinking...
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 border border-[#332920]/15 rounded-full px-4 py-2.5">
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendChat()}
                    placeholder="Ask for a script, or a change..."
                    className="flex-1 outline-none text-sm"
                  />
                  <button onClick={sendChat} style={{ color: accent }}>
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {tab === 'difficulty' && (
            <div className="mb-2">
              <label className="block text-sm font-medium text-[#332920]/70 mb-3">
                Paste any text, and check how easy or hard it is for the average student.
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={6}
                placeholder="Paste text to analyze..."
                className="w-full border border-[#332920]/15 rounded-2xl px-4 py-4 text-base outline-none resize-none mb-4"
              />
              <button
                onClick={checkDifficulty}
                disabled={difficultyLoading || !input}
                style={{ background: accent }}
                className="text-white text-base font-medium rounded-2xl px-7 py-3.5 disabled:opacity-50"
              >
                {difficultyLoading ? 'Analyzing...' : 'Analyze topic level'}
              </button>

              {difficultyResult && (
                <div className="mt-6 bg-[#FBF4EC] rounded-2xl p-6">
                  <span
                    style={{ background: accent }}
                    className="inline-block text-white text-sm font-medium rounded-full px-4 py-1.5 mb-3"
                  >
                    {difficultyResult.level}
                  </span>
                  <p className="text-base text-[#332920]/75">{difficultyResult.note}</p>
                </div>
              )}
            </div>
          )}

          {tab !== 'difficulty' && tab !== 'chat' && (
            <button
              onClick={generate}
              disabled={loading || !input}
              style={{ background: accent }}
              className="text-white text-base font-medium rounded-2xl px-7 py-3.5 disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate script'}
            </button>
          )}

          {result && (
            <div className="mt-8 bg-[#FBF4EC] rounded-2xl p-6 whitespace-pre-wrap text-base leading-relaxed text-[#332920]/85">
              {result}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}