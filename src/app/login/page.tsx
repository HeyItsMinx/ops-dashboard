import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Zap } from 'lucide-react'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
  const { message } = await searchParams

  const signIn = async (formData: FormData) => {
    'use server'
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const cookieStore = await cookies()
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {}
          },
        },
      }
    )

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return redirect(`/login?message=${encodeURIComponent(error.message)}`)
    return redirect('/')
  }

  const signUp = async (formData: FormData) => {
    'use server'
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {}
          },
        },
      }
    )

    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) return redirect(`/login?message=${encodeURIComponent(error.message)}`)
    if (data?.user && !data?.session) {
      return redirect('/login?message=Account pending confirmation! Check your email inbox.')
    }
    return redirect('/')
  }

  return (
    <div className="relative w-full min-h-screen bg-[#0F0F0F] overflow-hidden flex items-center justify-center selection:bg-[#FFF200] selection:text-black px-4">
      {/* Dynamic Background Slashes */}
      <div className="absolute inset-0 bg-[#E60012] opacity-20 pointer-events-none" style={{ clipPath: 'polygon(30% 0, 100% 0, 70% 100%, 0 100%)' }}></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FFF200] opacity-5 pointer-events-none blur-3xl"></div>

      <div className="relative max-w-md w-full bg-[#0F0F0F] border-4 border-white p-8 shadow-[12px_12px_0px_0px_#E60012] transform -rotate-1 z-10">
        
        {/* Ransom-Note Title Header */}
        <h1 className="flex flex-wrap gap-2 justify-center text-4xl md:text-5xl font-black uppercase mb-8 select-none tracking-tighter">
          <span className="bg-white text-black px-3 py-1 transform -rotate-3 shadow-md">Ops</span>
          <span className="bg-[#E60012] text-white px-4 py-2 transform rotate-3">IQ</span>
          <span className="bg-black text-white border-2 border-white px-3 py-1 transform -rotate-1">Auth</span>
        </h1>

        <form className="flex flex-col gap-5 text-white transform rotate-1">
          {/* Email Field Group */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black uppercase tracking-widest text-[#E60012]" htmlFor="email">Operator ID (Email)</label>
            <input
              className="bg-[#161616] border-2 border-gray-600 text-white font-mono text-sm p-3 focus:outline-none focus:border-[#FFF200] focus:ring-0 transition-colors"
              name="email"
              type="email"
              placeholder="operator@domain.com"
              required
            />
          </div>

          {/* Password Field Group */}
          <div className="flex flex-col gap-1.5 mb-2">
            <label className="text-xs font-black uppercase tracking-widest text-[#E60012]" htmlFor="password">Security Crypt (Password)</label>
            <input
              className="bg-[#161616] border-2 border-gray-600 text-white font-mono text-sm p-3 focus:outline-none focus:border-[#FFF200] focus:ring-0 transition-colors"
              type="password"
              name="password"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Persona Style Sharp Action Buttons */}
          <div className="flex flex-col gap-4 mt-2">
            <button
              formAction={signIn}
              className="group relative w-full py-3.5 bg-white text-black font-black uppercase tracking-wider text-base transition-transform active:scale-95 overflow-hidden shadow-md cursor-pointer"
              style={{ clipPath: 'polygon(0 0, 96% 4%, 100% 100%, 4% 96%)' }}
            >
              <div className="absolute inset-0 bg-[#E60012] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-150 origin-left ease-out"></div>
              <span className="relative z-10 group-hover:text-white flex items-center justify-center gap-2">
                Infiltrate System (Sign In)
              </span>
            </button>

            <button
              formAction={signUp}
              className="w-full py-2.5 border-2 border-[#E60012] text-[#E60012] bg-transparent hover:bg-[#E60012] hover:text-white font-black uppercase tracking-wider text-xs transition-colors duration-150 active:scale-95 cursor-pointer transform -skew-x-12"
            >
              <span className="block transform skew-x-12">Join The Crew (Sign Up)</span>
            </button>
          </div>

          {/* System Dynamic Message Prompt */}
          {message && (
            <div className="mt-4 p-4 bg-[#111] border-2 border-[#E60012] relative overflow-hidden transform -skew-x-2">
              <div className="absolute top-0 left-0 bg-[#FFF200] text-black text-[9px] px-1.5 font-bold uppercase tracking-wider">Alert</div>
              <p className="font-mono text-xs text-gray-200 mt-2 leading-relaxed">{message}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}