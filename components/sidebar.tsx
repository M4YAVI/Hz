"use client"

import Link from "next/link"
import { usePathname, useRouter } from 'next/navigation'
import { Home, Music, Mic, Heart, Clock, Radio, Plus, Trash2, Menu, Headphones } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"
import { usePlayerStore } from "@/lib/store"

const categories = [
  { name: "Animes", icon: Music, href: "/?category=Animes" },
  { name: "Earworm", icon: Radio, href: "/?category=Earworm" },
  { name: "Favourites", icon: Heart, href: "/?category=Favourites" },
  { name: "Audio", icon: Headphones, href: "/?category=Audio" },
  { name: "Podcasts", icon: Mic, href: "/?category=Podcasts" },
  { name: "Recent", icon: Clock, href: "/?sort=recent" },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { isSidebarCollapsed, toggleSidebar } = usePlayerStore()

  // Auto-collapse on mobile on mount
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        usePlayerStore.setState({ isSidebarCollapsed: true })
      } else {
        usePlayerStore.setState({ isSidebarCollapsed: false })
      }
    }

    // Initial check
    handleResize()
  }, [])

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
    <>
      {/* Mobile Backdrop */}
      {!isSidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}

      <div
        className={cn(
          "bg-black h-full flex flex-col border-r border-zinc-800 transition-all duration-300 ease-in-out z-50",
          "fixed inset-y-0 left-0 md:relative", // Fixed on mobile, relative on desktop
          isSidebarCollapsed
            ? "-translate-x-full md:translate-x-0 md:w-[70px]"
            : "translate-x-0 w-64 md:w-64"
        )}
      >
        <div className={cn("p-6", isSidebarCollapsed && "px-2")}>
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className={cn("flex items-center gap-2", isSidebarCollapsed && "hidden")}>
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <Music className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-bold text-white">MyMusic</span>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className={cn("text-zinc-400 hover:text-white", isSidebarCollapsed && "mx-auto")}
            >
              <Menu className="w-6 h-6" />
            </Button>
          </div>

          <div className="space-y-1">
            <Link href="/">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-zinc-400 hover:text-white hover:bg-zinc-900",
                  pathname === "/" && "text-white bg-zinc-900",
                  isSidebarCollapsed && "justify-center px-2"
                )}
              >
                <Home className={cn("h-4 w-4", !isSidebarCollapsed && "mr-2")} />
                {!isSidebarCollapsed && "Home"}
              </Button>
            </Link>

          </div>

          <div className="mt-8">
            {!isSidebarCollapsed && (
              <h3 className="px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                Library
              </h3>
            )}
            <div className="space-y-1">
              {categories.map((category) => (
                <Link key={category.name} href={category.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-zinc-400 hover:text-white hover:bg-zinc-900 font-medium",
                      isSidebarCollapsed && "justify-center px-2"
                    )}
                  >
                    <category.icon className={cn("h-4 w-4", !isSidebarCollapsed && "mr-2")} />
                    {!isSidebarCollapsed && category.name}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-auto p-6">
          <Button
            variant="outline"
            className={cn(
              "w-full justify-between bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800",
              isSidebarCollapsed && "justify-center px-0"
            )}
            onClick={() => document.dispatchEvent(new CustomEvent("toggle-search"))}
          >
            <span className={cn("flex items-center", isSidebarCollapsed && "hidden")}>
              <span className="mr-2">Search</span>
            </span>
            {!isSidebarCollapsed ? (
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-zinc-700 bg-zinc-800 px-1.5 font-mono text-[10px] font-medium text-zinc-400 opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            ) : (
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center justify-center rounded border border-zinc-700 bg-zinc-800 w-5 font-mono text-[10px] font-medium text-zinc-400 opacity-100">
                K
              </kbd>
            )}
          </Button>
        </div>
      </div>
    </>
  )
}
