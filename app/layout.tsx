import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import { Sidebar } from "@/components/sidebar"
import { Player } from "@/components/player"
import { SearchModal } from "@/components/search-modal"

import { MobileHeader } from "@/components/mobile-header"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MyMusic",
  description: "Personal Music Player",
  generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-white overflow-hidden`}>
        <div className="flex h-screen flex-col md:flex-row">
          <MobileHeader />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto pb-24 bg-gradient-to-b from-zinc-900 to-black">
              {children}
            </main>
          </div>
        </div>
        <Player />
        <SearchModal />
      </body>
    </html>
  )
}
