"use client";

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Bot, ListChecks, Terminal, BarChart3, 
  MessageSquare, Zap, Clock, Shield 
} from 'lucide-react'

import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar' 

const navItems = [
  { name: 'Agent Monitor', href: '/', icon: Bot },
  { name: 'Task Queue', href: '/tasks', icon: ListChecks },
  { name: 'Log Explorer', href: '/logs', icon: Terminal },
  { name: 'Metric Dash', href: '/dashboard', icon: BarChart3 },
  { name: 'AI Assistant', href: '/assistant', icon: MessageSquare },
  { name: 'Webhooks', href: '/webhooks', icon: Zap },
  { name: 'Cron Manager', href: '/cron', icon: Clock },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  return (
    <ShadcnSidebar 
      collapsible="icon" 
      className="bg-[#0F0F0F] border-r-4 border-white text-white z-30"
    >
      <SidebarHeader className={`p-4 ${isCollapsed ? 'pt-4' : 'pt-6'}`}>
        <div className={`flex items-center tracking-tighter ${isCollapsed ? 'justify-center' : 'gap-2 mb-2'}`}>
          <div className="flex items-baseline gap-1 uppercase font-black text-2xl">
            <span className={`bg-white text-black shadow-md ${isCollapsed ? 'w-8 h-8 flex items-center justify-center' : 'px-2 py-0.5 transform -rotate-3'}`}>
              {isCollapsed ? 'O' : 'Ops'}
            </span>
            {!isCollapsed && <span className="text-[#E60012] transform rotate-3 inline-block">IQ</span>}
          </div>
        </div>
        
        {!isCollapsed && (
           <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2 mt-4 font-mono border-l-2 border-[#E60012]">
            SYSTEM MODULES
          </p>
        )}
      </SidebarHeader>

      <SidebarContent className="px-3 py-4 scrollbar-none">
        <SidebarMenu className="gap-5">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton 
                  asChild
                  tooltip={{
                    children: (
                      <div className="flex items-center gap-2">
                        <Icon size={14} className="text-[#E60012]" />
                        <span>{item.name}</span>
                      </div>
                    ),
                    className: "bg-white text-black border-2 border-black shadow-[4px_4px_0px_0px_#E60012] font-black uppercase tracking-widest text-xs py-2.5 px-4 ml-4 rounded-none animate-in slide-in-from-left-2 fade-in duration-200"
                  }}
                  className={`relative transition-all duration-200 rounded-none group/btn
                    ${isCollapsed 
                      ? 'h-10 w-10 mx-auto flex items-center justify-center p-0' 
                      : 'h-12 px-4' 
                    }
                    ${isActive 
                      ? 'bg-white text-black scale-105 shadow-[4px_4px_0px_0px_#E60012] z-10 hover:bg-white' 
                      : 'bg-[#161616] text-gray-500 group-hover/btn:text-white hover:bg-[#222] hover:text-white border-l-4 border-transparent hover:border-[#FFF200] hover:translate-x-1'
                    }
                  `}
                >
                  <Link href={item.href} className={`flex items-center ${isCollapsed ? 'justify-center w-full' : 'gap-3 w-full'}`}>
                    <Icon 
                      size={isCollapsed ? 18 : 16} 
                      className={`shrink-0 ${isActive ? 'text-[#E60012]' : 'text-gray-500 group-hover/btn:text-[#FFF200]'}`} 
                    />
                    
                    {!isCollapsed && (
                      <span className="font-black uppercase text-xs tracking-widest truncate">
                        {item.name}
                      </span>
                    )}
                    
                    {isActive && !isCollapsed && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#E60012] rotate-45" />
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t-2 border-white bg-[#121212]">
        <div className={`flex items-center overflow-hidden ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="w-8 h-8 bg-white border-2 border-black text-black flex items-center justify-center text-xs font-black shadow-[2px_2px_0px_0px_#E60012] transform -rotate-3 shrink-0">
            OP
          </div>
          {!isCollapsed && (
            <div className="flex flex-col truncate">
              <span className="text-xs font-black uppercase tracking-wider text-white truncate">Operator</span>
              <span className="text-[9px] text-[#FFF200] font-mono uppercase tracking-widest font-bold">
                admin_role
              </span>
            </div>
          )}
        </div>
      </SidebarFooter>
    </ShadcnSidebar>
  )
}