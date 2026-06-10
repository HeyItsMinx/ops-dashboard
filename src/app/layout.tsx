import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Sidebar from '@/components/Sidebar'
import TopNav from '@/components/TopNav'
import { SidebarProvider } from '@/components/ui/sidebar'
import { ScrollArea } from '@/components/ui/scroll-area'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'OpsIQ | AI Operations Dashboard',
  description: 'Production-grade AI operations platform.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() {},
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  return (
    <html lang="en" className="h-full bg-[#0F0F0F] selection:bg-[#FFF200] selection:text-black">
      <body className={`${inter.className} h-full antialiased text-white bg-[#0F0F0F]`}>
        {user ? (
          <SidebarProvider>
            <div className="flex h-screen w-screen overflow-hidden bg-[#0F0F0F] relative z-10">
              {/* Sidebar */}
              <Sidebar />

              {/* Main (Scroll-column) */}
              <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
                <TopNav />
                <ScrollArea className="flex-1 w-full h-full custom-scrollbar">
                  <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar">
                    <div className="bg-[#0F0F0F] border-4 border-white p-6 md:p-8 shadow-[12px_12px_0px_0px_#E60012] transform -skew-x-0.5 min-h-full relative mb-4">
                      <div className="absolute -top-3.5 right-6 bg-[#FFF200] text-black font-black uppercase text-[9px] tracking-widest px-3 py-0.5 border-2 border-black transform rotate-2">
                        Operational Control Base
                      </div>
                      <div className="transform skew-x-0.5 h-full w-full">
                        {children}
                      </div>
                    </div>
                  </main>
                </ScrollArea>
              </div>
            </div>
          </SidebarProvider>
        ) : (
          <ScrollArea className="h-screen w-full">
            {children}
          </ScrollArea>
        )}
      </body>
    </html>
  )
}