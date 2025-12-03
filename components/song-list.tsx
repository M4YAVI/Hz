"use client"

import { Play, Clock, Trash2, List, Grid, Shuffle } from 'lucide-react'
import { Song } from "@/types/song"
import { usePlayerStore } from "@/lib/store"
import { formatDuration, formatDate } from "@/lib/utils"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { createBrowserClient } from "@supabase/ssr"
import { useRouter } from 'next/navigation'
import { useState } from "react"

interface SongListProps {
  songs: Song[]
  isAdmin?: boolean
  title?: string
  description?: string
}

export function SongList({ songs, isAdmin = false, title = "All Songs", description = "Your personal collection" }: SongListProps) {
  const { playSong, currentSong, isPlaying, togglePlay, setQueue, isShuffle, setShuffle } = usePlayerStore()
  const [viewMode, setViewMode] = useState<'list' | 'compact'>('list')
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (!confirm("Are you sure you want to delete this song?")) return

    await supabase.from('songs').delete().eq('id', id)
    router.refresh()
  }

  const handlePlayAll = () => {
    if (songs.length > 0) {
      setQueue(songs)
      setShuffle(false)
      playSong(songs[0])
    }
  }

  const handleMainPlayClick = () => {
    const isCurrentSongInList = songs.some(s => s.id === currentSong?.id)
    if (isCurrentSongInList) {
      setShuffle(false)
      togglePlay()
    } else {
      handlePlayAll()
    }
  }

  const handleShufflePlay = () => {
    if (songs.length === 0) return
    setShuffle(true)
    setQueue(songs)

    const randomIndex = Math.floor(Math.random() * songs.length)
    playSong(songs[randomIndex])
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-end gap-6 mb-8">
        <div className="w-52 h-52 bg-gradient-to-br from-green-600 to-blue-600 shadow-2xl shadow-black/50 flex items-center justify-center">
          <Music className="w-20 h-20 text-white opacity-50" />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-bold uppercase text-white">Playlist</span>
          <h1 className="text-7xl font-black text-white tracking-tight">{title}</h1>
          <p className="text-zinc-400 mt-4">{description}</p>
          <div className="flex items-center gap-2 text-sm text-white mt-1">
            <span className="font-bold">MyMusic</span>
            <span>•</span>
            <span>{songs.length} songs</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            size="icon"
            className={`w-14 h-14 rounded-full transition-colors ${!isShuffle
                ? 'bg-green-500 hover:bg-green-400 text-black shadow-lg shadow-green-500/20'
                : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            onClick={handleMainPlayClick}
            title="Sequential Play"
          >
            {isPlaying && songs.some(s => s.id === currentSong?.id) ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 ml-1" />
            )}
          </Button>

          <Button
            size="icon"
            className={`w-14 h-14 rounded-full transition-colors ${isShuffle
                ? 'bg-green-500 hover:bg-green-400 text-black shadow-lg shadow-green-500/20'
                : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            onClick={handleShufflePlay}
            title="Shuffle Play"
          >
            <Shuffle className="w-6 h-6" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className={`text-zinc-400 hover:text-white ${viewMode === 'list' ? 'text-white' : ''}`}
            onClick={() => setViewMode('list')}
          >
            <List className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`text-zinc-400 hover:text-white ${viewMode === 'compact' ? 'text-white' : ''}`}
            onClick={() => setViewMode('compact')}
          >
            <Grid className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* List Header */}
      <div className="grid grid-cols-[auto_1fr_1fr_1fr_auto] gap-4 px-4 py-2 border-b border-zinc-800 text-sm text-zinc-400 sticky top-0 bg-zinc-900/95 backdrop-blur z-10">
        <span className="w-8 text-center">#</span>
        <span>Title</span>
        <span>Album</span>
        <span>Date added</span>
        <span className="w-12 text-center"><Clock className="w-4 h-4 mx-auto" /></span>
      </div>

      {/* Songs */}
      <div className="mt-4 space-y-2">
        {songs.map((song, index) => (
          <div
            key={song.id}
            className={`grid grid-cols-[auto_1fr_1fr_1fr_auto] gap-4 px-4 py-2 rounded-md hover:bg-white/10 group cursor-pointer items-center transition-colors ${currentSong?.id === song.id ? 'bg-white/10' : ''
              }`}
            onClick={() => {
              setQueue(songs)
              playSong(song)
            }}
          >
            <div className="w-8 text-center text-zinc-400 group-hover:text-white flex items-center justify-center">
              {currentSong?.id === song.id && isPlaying ? (
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              ) : (
                <span className="group-hover:hidden">{index + 1}</span>
              )}
              <Play className="w-4 h-4 hidden group-hover:block text-white" />
            </div>

            <div className="flex items-center gap-3 min-w-0">
              <div className="relative w-10 h-10 min-w-[2.5rem]">
                <Image src={song.image_url || "/placeholder.svg"} alt={song.title} fill className="object-cover rounded" />
              </div>
              <div className="flex flex-col overflow-hidden min-w-0">
                <span className={`font-medium truncate ${currentSong?.id === song.id ? 'text-green-500' : 'text-white'}`}>
                  {song.title}
                </span>
                <span className="text-sm text-zinc-400 truncate group-hover:text-white">
                  {song.author}
                </span>
              </div>
            </div>

            <span className="text-sm text-zinc-400 truncate group-hover:text-white">{song.album}</span>
            <span className="text-sm text-zinc-400 truncate group-hover:text-white">{formatDate(song.created_at)}</span>

            <div className="flex items-center justify-end gap-4 w-12">
              {isAdmin && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500"
                  onClick={(e) => handleDelete(e, song.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
              <span className="text-sm text-zinc-400">{formatDuration(song.duration)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

import { Music, Pause } from 'lucide-react'
