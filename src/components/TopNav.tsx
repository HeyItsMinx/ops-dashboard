'use client'

import { usePathname } from 'next/navigation'
import { Activity } from 'lucide-react'

export default function TopNav() {
  const pathname = usePathname()
  
  // Format the path to breadcrumb
  const activeSegment = pathname === '/' 
    ? 'agent-monitor' 
    : pathname.replace('/', '')

  return (
    <header className="h-16 border-b border-slate-200 bg-white px-8 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
        <span>~/opsiq</span>
        <span>/</span>
        <span className="text-slate-600 font-medium">{activeSegment}</span>
      </div>

      {/* Live System Operational Status Indicator */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
          <Activity size={12} className="text-emerald-600 animate-pulse" />
          <span className="text-xs font-medium text-emerald-700">System Connected</span>
        </div>
      </div>
    </header>
  )
}