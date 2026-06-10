'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Bot, ListChecks, Terminal, BarChart3, 
  MessageSquare, Zap, Clock, Shield 
} from 'lucide-react'

const navItems = [
  { name: 'Agent Monitor', href: '/', icon: Bot },
  { name: 'Task Queue', href: '/tasks', icon: ListChecks },
  { name: 'Log Explorer', href: '/logs', icon: Terminal },
  { name: 'Metric Dashboard', href: '/dashboard', icon: BarChart3 },
  { name: 'AI Assistant', href: '/assistant', icon: MessageSquare },
  { name: 'Webhook Intake', href: '/webhooks', icon: Zap },
  { name: 'Cron Manager', href: '/cron', icon: Clock },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-full lg:w-64 bg-[#0F0F0F] border-b-4 lg:border-b-0 lg:border-r-4 border-white h-auto lg:h-screen sticky top-0 flex flex-col justify-between flex-shrink-0 z-20 overflow-y-auto selection:bg-[#FFF200] selection:text-black">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8 select-none tracking-tighter">
          <div className="flex items-baseline gap-1 uppercase text-2xl font-black">
            <span className="bg-white text-black px-2 py-0.5 transform -rotate-3 shadow-md">Ops</span>
            <span className="text-[#E60012] transform rotate-3 inline-block">IQ</span>
          </div>
          <span className="text-[9px] font-mono bg-[#E60012] text-white font-black px-1.5 py-0.5 transform -skew-x-12 tracking-widest">
            V1.0
          </span>
        </div>

        {/* Navigation List Elements */}
        <nav className="space-y-2">
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2 mb-3 font-mono border-l-2 border-[#E60012]">
            SYSTEM MODULES
          </p>
          
          <div className="flex flex-row lg:flex-col gap-2 lg:gap-1.5 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-none">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative px-3 py-2.5 font-black uppercase text-xs tracking-widest transition-all duration-150 transform flex items-center gap-3 shrink-0 lg:w-full select-none
                    ${isActive 
                      ? 'bg-white text-black -translate-x-1 lg:-translate-x-2 -skew-x-6 scale-105 shadow-[4px_4px_0px_0px_#E60012] z-10' 
                      : 'bg-[#161616] text-gray-400 hover:bg-[#222] hover:text-white hover:translate-x-1 hover:-skew-x-12 border-l-4 border-transparent hover:border-[#FFF200]'
                    }
                  `}
                >
                  <Icon 
                    size={15} 
                    className={isActive ? 'text-[#E60012] animate-pulse' : 'text-gray-500'} 
                  />
                  <span className={`block transform ${isActive ? 'skew-x-6 font-black' : ''}`}>
                    {item.name}
                  </span>
                  
                  {isActive && (
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#E60012] rotate-45 hidden lg:block" />
                  )}
                </Link>
              )
            })}
          </div>
        </nav>
      </div>

      {/* Styled Operator Footing Context Badge */}
      <div className="p-4 border-t-2 lg:border-t-4 border-white bg-[#121212] flex items-center justify-between transform -skew-y-1 lg:skew-y-0 origin-left">
        <div className="flex items-center gap-2 transform skew-y-1 lg:skew-y-0">
          <div className="w-8 h-8 bg-white border-2 border-black text-black flex items-center justify-center text-xs font-black shadow-[2px_2px_0px_0px_#E60012] transform -rotate-3">
            OP
          </div>
          <div className="flex flex-col ml-1">
            <span className="text-xs font-black uppercase tracking-wider text-white">Operator</span>
            <span className="text-[9px] text-[#FFF200] font-mono uppercase tracking-widest font-bold">
              admin_role
            </span>
          </div>
        </div>
        <Shield size={14} className="text-[#E60012] animate-bounce" />
      </div>
    </aside>
  )
}