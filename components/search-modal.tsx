"use client"

import { useEffect, useState } from "react"
import { Search, X } from 'lucide-react'
import { createBrowserClient } from "@supabase/ssr"
import { Song } from "@/types/song"
import { usePlayerStore } from "@/lib/store"
import Image from "next/image"

export function SearchModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Song[]>([])
  const { playSong, setQueue } = usePlayerStore()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !prev)
    document.addEventListener("toggle-search", handleToggle)
    return () => document.removeEventListener("toggle-search", handleToggle)
  }, [])

  useEffect(() => {
    const searchSongs = async () => {
      if (!query.trim()) {
        setResults([])
        return
      }

      const { data } = await supabase
        .from('songs')
        .select('*')
        .ilike('title', `%${query}%`)
        .limit(5)

      if (data) setResults(data)
    }

    const timeout = setTimeout(searchSongs, 300)
    return () => clearTimeout(timeout)
  }, [query])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-start justify-center pt-[20vh]" onClick={() => setIsOpen(false)}>
      <div className="w-full max-w-2xl bg-zinc-900 rounded-xl border border-zinc-800 shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center border-b border-zinc-800 p-4">
          <Search className="w-5 h-5 text-zinc-400 mr-3" />
          <input
            type="text"
            placeholder="Search songs, artists, or albums..."
            className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-zinc-500 text-lg"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <button onClick={() => setIsOpen(false)}>
            <X className="w-5 h-5 text-zinc-400 hover:text-white" />
          </button>
        </div>
        
        {results.length > 0 && (
          <div className="p-2">
            {results.map((song) => (
              <div
                key={song.id}
                className="flex items-center gap-3 p-2 hover:bg-zinc-800 rounded-lg cursor-pointer group"
                onClick={() => {
                  setQueue(results)
                  playSong(song)
                  setIsOpen(false)
                }}
              >
                <div className="relative w-10 h-10 rounded overflow-hidden">
                  <Image src={song.image_url || "/placeholder.svg"} alt={song.title} fill className="object-cover" />
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-medium group-hover:text-green-500 transition-colors">{song.title}</span>
                  <span className="text-zinc-400 text-sm">{song.author}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {query && results.length === 0 && (
          <div className="p-8 text-center text-zinc-500">
            No results found for "{query}"
          </div>
        )}
      </div>
    </div>
  )
}
