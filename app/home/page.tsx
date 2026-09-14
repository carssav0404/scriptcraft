'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { PageBackground } from '@/components/PageBackground'
import { Folder, ChevronRight, Sparkles } from 'lucide-react'

type FolderRow = { id: string; name: string }

export default function HomePage() {
  const router = useRouter()
  const [folders, setFolders] = useState<FolderRow[]>([])
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const load = async () => {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) {
        router.push('/login')
        return
      }
      setEmail(userData.user.email || '')

      const { data } = await supabase
        .from('folders')
        .select('id, name')
        .order('created_at', { ascending: false })
      setFolders(data || [])
    }
    load()
  }, [router])

  const startEditing = () => {
    setEditing(true)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  const submit = async () => {
    if (!name.trim()) return
    const { data: userData } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('folders')
      .insert({ name: name.trim(), user_id: userData.user!.id })
      .select()
      .single()
    if (!error && data) {
      router.push(`/project/${data.id}`)
    }
    setName('')
    setEditing(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <PageBackground variant="faded" image="/main-bg.jpg" />

      {/* logo pojok kiri atas */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-8 z-20 flex items-center gap-1.5 sm:gap-2.5">
        <Sparkles size={22} className="text-[#D98BA0] sm:hidden" />
        <Sparkles size={30} className="text-[#D98BA0] hidden sm:block" />
        <span
          style={{ fontFamily: "'Fredoka', sans-serif" }}
          className="text-lg sm:text-3xl font-semibold text-[#332920]"
        >
          ScriptCraft
        </span>
      </div>

      {/* akun + logout pojok kanan atas */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-1.5 sm:gap-2 bg-white rounded-full pl-1.5 sm:pl-2 pr-2.5 sm:pr-4 py-1.5 sm:py-2 shadow-sm border border-[#332920]/10 hover:shadow-md transition-shadow"
          >
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#D98BA0]/20 flex items-center justify-center text-[10px] sm:text-xs font-medium text-[#D98BA0]">
              {email.charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:inline text-xs text-[#332920]/70 max-w-[120px] truncate">{email}</span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-lg border border-[#332920]/8 overflow-hidden">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-sm text-[#332920]/70 hover:bg-[#FBF4EC] transition-colors"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 pt-16 sm:pt-0">
        <h1
          style={{ fontFamily: "'Fredoka', sans-serif" }}
          className="text-[88px] leading-none font-semibold text-[#332920] mb-8 text-center"
        >
          hello
        </h1>

        {!editing ? (
          <button
            onClick={startEditing}
            className="flex items-center gap-2 bg-white rounded-full px-8 py-4 shadow-sm border border-[#332920]/10 hover:shadow-md transition-shadow"
          >
            <span style={{ fontFamily: "'Caveat', cursive" }} className="text-3xl text-[#332920]/70">
              choose your idea here
            </span>
            <span className="text-2xl">🌸</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 bg-white rounded-full pl-5 pr-2 py-3 shadow-md border border-[#D98BA0]/40">
            <span className="text-xl">📁</span>
            <input
              ref={inputRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              placeholder="folder name..."
              className="outline-none text-base w-52"
            />
            <button
              onClick={submit}
              className="rounded-full bg-[#332920] text-white text-sm px-5 py-2.5 font-medium hover:bg-[#332920]/90"
            >
              Create
            </button>
          </div>
        )}

        {folders.length > 0 && (
          <div className="mt-14 w-full max-w-sm">
            <p className="text-xs uppercase tracking-wide text-[#332920]/35 mb-3 text-center">
              folder history
            </p>
            <div className="space-y-2">
              {folders.map((f) => (
                <button
                  key={f.id}
                  onClick={() => router.push(`/project/${f.id}`)}
                  className="w-full flex items-center gap-3 bg-white rounded-2xl px-4 py-3 border border-[#332920]/8 hover:border-[#D98BA0]/50 transition-colors text-left"
                >
                  <Folder size={18} className="text-[#E3B23C]" />
                  <span className="text-sm flex-1 truncate">{f.name}</span>
                  <ChevronRight size={16} className="text-[#332920]/30" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}