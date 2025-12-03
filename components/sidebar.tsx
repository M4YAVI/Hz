"use client"

import Link from "next/link"
import { usePathname, useRouter } from 'next/navigation'
import { Home, Music, Mic, Heart, Clock, Radio, Plus, Trash2 } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"

const categories = [
  { name: "Animes", icon: Music, href: "/?category=Animes" },
  { name: "Earworm", icon: Radio, href: "/?category=Earworm" },
  { name: "Favourites", icon: Heart, href: "/?category=Favourites" },
  { name: "Audio", icon: Mic, href: "/?category=Audio" },
  { name: "Podcasts", icon: Mic, href: "/?category=Podcasts" },
  { name: "Recent", icon: Clock, href: "/?sort=recent" },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        // Trigger search modal (implemented in layout or separate component)
        document.dispatchEvent(new CustomEvent("toggle-search"))
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <div className="w-64 bg-black h-full flex flex-col border-r border-zinc-800">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <Music className="w-5 h-5 text-black" />
          </div>
          <span className="text-xl font-bold text-white">MyMusic</span>
        </Link>

        <div className="space-y-1">
          <Link href="/">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-zinc-400 hover:text-white hover:bg-zinc-900",
                pathname === "/" && "text-white bg-zinc-900"
              )}
            >
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
          </Link>

        </div>

        <div className="mt-8">
          <h3 className="px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
            Library
          </h3>
          <div className="space-y-1">
            {categories.map((category) => (
              <Link key={category.name} href={category.href}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-zinc-400 hover:text-white hover:bg-zinc-900 font-medium"
                >
                  <category.icon className="mr-2 h-4 w-4" />
                  {category.name}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-auto p-6">
        <Button
          variant="outline"
          className="w-full justify-between bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800"
          onClick={() => document.dispatchEvent(new CustomEvent("toggle-search"))}
        >
          <span className="flex items-center">
            <span className="mr-2">Search</span>
          </span>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-zinc-700 bg-zinc-800 px-1.5 font-mono text-[10px] font-medium text-zinc-400 opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </div>
    </div>
  )
}
