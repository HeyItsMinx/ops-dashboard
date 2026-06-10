import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/types/database.types'

export default async function Home() {
  const cookieStore = await cookies()

  const supabase = createServerClient<Database>(
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

  const { data: agents } = await supabase.from('agents').select('*')

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Active Agents</h2>
        <p className="text-sm text-slate-500">Live configuration and system health status matrix.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {agents?.map((agent) => (
          <div key={agent.id} className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col justify-between min-h-[140px]">
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-medium text-slate-800 text-sm leading-tight">{agent.name}</h3>
              <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-cyan-100 text-cyan-800 rounded-full uppercase">
                {agent.status}
              </span>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>type: {agent.type}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}