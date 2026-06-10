'use client'

import { usePathname } from 'next/navigation'
import { Activity, ShieldAlert } from 'lucide-react'

export default function TopNav() {
  const pathname = usePathname()
  
  // Format the path into the operational terminal breadcrumb path token structure
  const activeSegment = pathname === '/' 
    ? 'agent-monitor' 
    : pathname.replace('/', '')

  return (
    <header className="h-16 border-b-4 border-white bg-[#0F0F0F] px-4 md:px-8 flex items-center justify-between sticky top-0 z-10 select-none transform -rotate-0.5 w-full">
      
      {/* Route Path Indicator designed like Ransom-Note cutouts */}
      <div className="flex items-center gap-2 text-xs font-mono font-black tracking-widest uppercase text-gray-400">
        <span className="bg-[#161616] border border-gray-700 px-2 py-1 text-gray-300">~/opsiq</span>
        <span className="text-white text-sm font-bold">/</span>
        <span className="bg-[#E60012] text-white px-2.5 py-1 transform -skew-x-6 shadow-sm">
          {activeSegment}
        </span>
      </div>

      {/* Live System Operational Status Indicator Ribbon */}
      <div className="flex items-center gap-4">
        <div 
          className="flex items-center gap-2 px-3 py-1 bg-[#FFF200] text-black font-black uppercase text-xs border-2 border-black shadow-[4px_4px_0px_0px_#E60012] transform rotate-1 transition-transform hover:scale-105"
          style={{ clipPath: 'polygon(0 0, 98% 5%, 100% 100%, 2% 95%)' }}
        >
          <Activity size={12} className="text-[#E60012] animate-pulse stroke-[3]" />
          <span className="tracking-wider text-[10px]">System Connected</span>
        </div>
      </div>
      
    </header>
  )
}