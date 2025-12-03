"use client"

import { Menu, Music } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePlayerStore } from "@/lib/store"

export function MobileHeader() {
    const { toggleSidebar } = usePlayerStore()

    return (
        <div className="md:hidden flex items-center justify-between p-4 bg-black border-b border-zinc-800 sticky top-0 z-40">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <Music className="w-5 h-5 text-black" />
                </div>
                <span className="text-xl font-bold text-white">MyMusic</span>
            </div>
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-white">
                <Menu className="w-6 h-6" />
            </Button>
        </div>
    )
}
