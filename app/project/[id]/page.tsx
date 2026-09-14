'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { PageBackground } from '@/components/PageBackground'
import { ArrowLeft, Folder, Mic, MonitorPlay } from 'lucide-react'

export default function ProjectPage() {
  const router = useRouter()
  const params = useParams()
  const [folder, setFolder] = useState<{ id: string; name: string } | null>(null)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('folders')
        .select('id, name')
        .eq('id', params.id)
        .single()
      setFolder(data)
    }
    load()
  }, [params.id])

  if (!folder) return null

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <PageBackground variant="faded" image="/main-bg.jpg" />
      <div className="relative z-10 px-6 py-10 max-w-2xl mx-auto">
        <button onClick={() => router.push('/home')} className="flex items-center gap-1.5 text-sm text-[#332920]/50 hover:text-[#332920] mb-8">
          <ArrowLeft size={16} /> all folders
        </button>

        <div className="flex items-center gap-3 mb-1">
          <Folder size={22} className="text-[#E3B23C]" />
          <h1 style={{ fontFamily: "'Fredoka', sans-serif" }} className="text-3xl font-semibold">{folder.name}</h1>
        </div>
        <p className="text-sm text-[#332920]/50 mb-10">Choose what kind of script to build from this folder.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => router.push(`/project/${folder.id}/speech`)}
            className="text-left bg-white rounded-3xl p-6 border border-[#332920]/8 hover:border-[#D98BA0]/50 hover:shadow-md transition-all"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#D98BA0]/15 flex items-center justify-center mb-4">
              <Mic size={20} className="text-[#D98BA0]" />
            </div>
            <h3 className="font-semibold text-base mb-1">Speech</h3>
            <p className="text-xs text-[#332920]/50 leading-relaxed">A ready-to-deliver speech script.</p>
          </button>

          <button
            onClick={() => router.push(`/project/${folder.id}/presentation`)}
            className="text-left bg-white rounded-3xl p-6 border border-[#332920]/8 hover:border-[#8FA382]/60 hover:shadow-md transition-all"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#8FA382]/15 flex items-center justify-center mb-4">
              <MonitorPlay size={20} className="text-[#8FA382]" />
            </div>
            <h3 className="font-semibold text-base mb-1">Presentation Script</h3>
            <p className="text-xs text-[#332920]/50 leading-relaxed">A slide-by-slide script.</p>
          </button>
        </div>
      </div>
    </div>
  )
}