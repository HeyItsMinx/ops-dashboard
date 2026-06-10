import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Sidebar from '@/components/Sidebar'
import TopNav from '@/components/TopNav'
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
  
  // Authenticated layout validation
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
          <div className="flex flex-col lg:flex-row min-h-screen overflow-hidden max-w-7xl mx-auto px-4 md:px-8 pt-6 pb-12 gap-8 relative z-10">
            {/* Background Graphic Accents */}
            <div className="absolute top-0 right-0 w-2/3 h-[500px] bg-red-600 opacity-10 transform rotate-12 translate-x-1/3 -translate-y-1/4 blur-3xl pointer-events-none z-0" />
            
            {/* Sidebar Left Component Column */}
            <Sidebar />

            {/* Core Display Body Area */}
            <div className="flex flex-col flex-1 min-w-0 z-10">
              <TopNav />
              <main className="flex-grow w-full relative mt-6">
                <div className="bg-[#0F0F0F] border-4 border-white p-6 md:p-8 shadow-[12px_12px_0px_0px_#E60012] transform -skew-x-0.5 min-h-[550px] relative">
                  {/* Decorative Header Accent */}
                  <div className="absolute -top-3.5 -right-3.5 bg-[#FFF200] text-black font-black uppercase text-[9px] tracking-widest px-3 py-0.5 border-2 border-black transform rotate-2">
                    Operational Grid Active
                  </div>
                  {/* Render Nested Children Views with Skew Counter-Correction */}
                  <div className="transform skew-x-0.5 h-full w-full">
                    {children}
                  </div>
                </div>
              </main>
            </div>
          </div>
        ) : (
          // Unauthenticated Flow View Wrapper (e.g. login screen)
          <div className="h-screen overflow-y-auto">
            {children}
          </div>
        )}
      </body>
    </html>
  )
}