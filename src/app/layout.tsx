import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Sidebar from '@/components/Sidebar'
import TopNav from '@/components/TopNav'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'OpsIQ | AI Operations Dashboard',
  description: 'Production-grade AI operations platform.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full bg-[#F8FAFC]">
      <body className={`${inter.className} h-full antialiased`}>
        <div className="flex h-screen overflow-hidden">
          {/* Global Sidebar layout element */}
          <Sidebar />

          {/* Core Content canvas Area */}
          <div className="flex flex-col flex-1 min-w-0 overflow-y-auto">
            <TopNav />
            <div className="flex-1">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}