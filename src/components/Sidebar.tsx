'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Bot, ListChecks, Terminal, BarChart3, 
  MessageSquare, Zap, Clock, Shield 
} from 'lucide-react'

const navItems = [
    { name: 'Agent Monitor', href: '/', icon: Bot },
    { name: 'Task Queue', href:'/tasks', icon: ListChecks },
    { name: 'Log Explorer', href:'/logs', icon: Terminal },
    { name: 'Metric Dashboard', href:'/dashboard', icon: BarChart3 },
    { name: 'AI Assistant', href:'/assistant', icon: MessageSquare },
    { name: 'Webhook Intake', href:'/webhooks', icon: Zap },
    { name: 'Cron Manager', href:'/cron', icon: Clock },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-screen sticky top-0 flex flex-col justify-between flex-shrink-0">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-3 h-3 rounded-full bg-cyan-600 animate-pulse" />
          <span className="font-semibold text-lg tracking-tight text-slate-900">OpsIQ</span>
          <span className="text-[10px] font-mono bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">v1.0</span>
        </div>

        {/* Nav Links */}
        <nav className="space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-3 mb-2 font-mono">Modules</p>
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-cyan-50 text-cyan-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-cyan-600' : 'text-slate-400'} />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Footer / User Profile section for Phase 1 Auth */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-600">
            OP
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-700 leading-none">Operator</span>
            <span className="text-[10px] text-slate-400 font-mono">admin_role</span>
          </div>
        </div>
        <Shield size={14} className="text-slate-400" />
      </div>
    </aside>
  )
}
