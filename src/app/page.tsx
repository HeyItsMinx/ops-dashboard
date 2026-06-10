import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/types/database.types'
import { ShieldCheck, AlertTriangle, Radio } from 'lucide-react'

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

  // Query
  const { data: agents } = await supabase.from('agents').select('*')

  return (
    <div className="space-y-8 text-white w-full">
      <div className="flex flex-col gap-2 border-b-2 border-gray-800 pb-4">
        <div className="flex flex-wrap gap-2 items-center z-10 relative">
          {["Active", "System", "Agents", "Grid"].map((word, i) => {
            const rotation = i % 2 === 0 ? '-rotate-2' : 'rotate-3';
            let colors = i % 3 === 1 ? "bg-[#E60012] text-white" : i % 3 === 2 ? "bg-black text-white border-2 border-white" : "bg-white text-black";
            return (
              <span key={i} className={`inline-block px-3 py-1 font-black uppercase text-xl md:text-3xl transform ${rotation} ${colors} shadow-md tracking-tighter`}>
                {word}
              </span>
            );
          })}
        </div>
        <p className="text-xs font-mono text-gray-400 mt-2">Live configuration and system health status matrix.</p>
      </div>

      {/* Main Grid Row */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 w-full">
        {agents?.map((agent) => {
          const isFailed = agent.status === 'failed';
          return (
            <div 
              key={agent.id} 
              className={`relative bg-[#0F0F0F] border-2 transform -skew-x-2 transition-transform hover:-translate-y-1 min-h-[150px]
                ${isFailed ? 'border-[#E60012] shadow-[6px_6px_0px_0px_#E60012]' : 'border-white shadow-[6px_6px_0px_0px_#E60012]'}
                hover:shadow-[8px_8px_0px_0px_#FFF200]
              `}
            >
              <div className="transform skew-x-2 p-5 flex flex-col h-full justify-between">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h3 className="font-black font-mono text-white text-base tracking-wide uppercase truncate">{agent.name}</h3>
                  <span className={`inline-block px-2 py-0.5 font-black text-[9px] tracking-widest transform -skew-x-12 ${agent.status === 'running' ? 'bg-[#FFF200] text-black' : isFailed ? 'bg-[#E60012] text-white animate-pulse' : 'bg-white text-black'}`}>
                    {agent.status}
                  </span>
                </div>
                <div className="mt-auto pt-3 border-t border-gray-800 flex items-center justify-between text-xs font-mono text-gray-400">
                  <span className="text-[10px] tracking-wider uppercase">Type</span>
                  <span className="bg-neutral-900 px-2 py-0.5 text-gray-300 text-[11px]">{agent.type}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}