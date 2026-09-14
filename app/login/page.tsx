'use client'

import { supabase } from '@/lib/supabase'
import { Sparkles } from 'lucide-react'
import { PageBackground } from '@/components/PageBackground'

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/home` },
    })
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      <PageBackground variant="solid" image="/home-bg.jpg" />

      <div className="relative z-10 w-[92%] max-w-sm bg-white/95 backdrop-blur rounded-[28px] shadow-xl px-8 py-9">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={20} className="text-[#D98BA0]" />
          <span style={{ fontFamily: "'Fredoka', sans-serif" }} className="text-xl font-semibold">
            ScriptCraft
          </span>
        </div>
        <p className="text-sm text-[#332920]/60 mb-8">Sign in so your folders are saved just for you.</p>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 rounded-2xl border border-[#332920]/15 py-3.5 font-medium text-sm hover:bg-[#FBF4EC] transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 01-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.55-1.85.87-3.04.87-2.34 0-4.32-1.58-5.03-3.71H.95v2.33A9 9 0 009 18z"/>
            <path fill="#FBBC05" d="M3.97 10.72A5.4 5.4 0 013.68 9c0-.6.1-1.18.29-1.72V4.95H.95A9 9 0 000 9c0 1.45.35 2.83.95 4.05l3.02-2.33z"/>
            <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 00.95 4.95l3.02 2.33C4.68 5.16 6.66 3.58 9 3.58z"/>
          </svg>
          Continue with Google
        </button>

        <p className="text-center text-xs text-[#332920]/40 mt-6">
          No password needed, your account is created automatically the first time you sign in.
        </p>
      </div>
    </div>
  )
}