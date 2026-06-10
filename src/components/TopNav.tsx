'use client'

import { usePathname } from 'next/navigation'
import { Activity, ShieldAlert } from 'lucide-react'
import { SidebarTrigger } from '@/components/ui/sidebar'

export default function TopNav() {
  const pathname = usePathname()
  
  const activeSegment = pathname === '/' 
    ? 'agent-monitor' 
    : pathname.replace('/', '')

  return (
    <header className="h-16 border-b-4 border-white bg-[#0F0F0F] px-4 md:px-8 flex items-center justify-between sticky top-0 z-10 select-none transform -rotate-0.5 w-full">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-white hover:text-[#FFF200] hover:bg-transparent" />
        
        <div className="flex items-center gap-2 text-xs font-mono font-black tracking-widest uppercase text-gray-400">
          <span className="bg-[#161616] border border-gray-700 px-2 py-1 text-gray-300 hidden sm:inline-block">~/opsiq</span>
          <span className="text-white text-sm font-bold hidden sm:inline-block">/</span>
          <span className="bg-[#E60012] text-white px-2.5 py-1 transform -skew-x-6 shadow-sm">
            {activeSegment}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div 
          className="flex items-center gap-2 px-3 py-1 bg-[#FFF200] text-black font-black uppercase text-xs border-2 border-black shadow-[4px_4px_0px_0px_#E60012] transform rotate-1 transition-transform hover:scale-105"
          style={{ clipPath: 'polygon(0 0, 98% 5%, 100% 100%, 2% 95%)' }}
        >
          <Activity size={12} className="text-[#E60012] animate-pulse stroke-[3]" />
          <span className="tracking-wider text-[10px] hidden sm:inline-block">System Connected</span>
        </div>
      </div>
      
    </header>
  )
}