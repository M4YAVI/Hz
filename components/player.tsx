"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, VolumeX } from 'lucide-react'
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { usePlayerStore } from "@/lib/store"
import { formatDuration } from "@/lib/utils"
import Image from "next/image"

export function Player() {
  const { 
    currentSong, 
    isPlaying, 
    togglePlay, 
    playNext, 
    playPrevious, 
    isShuffle, 
    toggleShuffle 
  } = usePlayerStore()
  
  const audioRef = useRef<HTMLAudioElement>(null)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)

  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.src = currentSong.audio_url
      if (isPlaying) {
        audioRef.current.play().catch(() => {})
      }
    }
  }, [currentSong])

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => {})
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime)
    }
  }

  const handleEnded = () => {
    playNext()
  }

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0]
      setProgress(value[0])
    }
  }

  if (!currentSong) return null

  return (
    <div className="h-24 bg-zinc-900 border-t border-zinc-800 px-4 flex items-center justify-between fixed bottom-0 w-full z-50">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
      
      {/* Song Info */}
      <div className="flex items-center gap-4 w-[30%]">
        <div className="relative w-14 h-14 rounded overflow-hidden bg-zinc-800">
          <Image 
            src={currentSong.image_url || "/placeholder.svg"} 
            alt={currentSong.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-white font-medium truncate">{currentSong.title}</span>
          <span className="text-zinc-400 text-sm truncate">{currentSong.author}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-2 w-[40%]">
        <div className="flex items-center gap-6">
          <Button 
            variant="ghost" 
            size="icon" 
            className={`text-zinc-400 hover:text-white ${isShuffle ? 'text-green-500 hover:text-green-400' : ''}`}
            onClick={toggleShuffle}
          >
            <Shuffle className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white" onClick={playPrevious}>
            <SkipBack className="w-5 h-5" />
          </Button>
          <Button 
            size="icon" 
            className="bg-white text-black hover:bg-zinc-200 rounded-full w-8 h-8" 
            onClick={togglePlay}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </Button>
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white" onClick={playNext}>
            <SkipForward className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
            <Repeat className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2 w-full max-w-md">
          <span className="text-xs text-zinc-400 w-10 text-right">{formatDuration(progress)}</span>
          <Slider
            value={[progress]}
            max={currentSong.duration}
            step={1}
            onValueChange={handleSeek}
            className="cursor-pointer"
          />
          <span className="text-xs text-zinc-400 w-10">{formatDuration(currentSong.duration)}</span>
        </div>
      </div>

      {/* Volume */}
      <div className="flex items-center justify-end gap-2 w-[30%]">
        <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white" onClick={() => setIsMuted(!isMuted)}>
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </Button>
        <Slider
          value={[isMuted ? 0 : volume]}
          max={1}
          step={0.01}
          onValueChange={(val) => setVolume(val[0])}
          className="w-24 cursor-pointer"
        />
      </div>
    </div>
  )
}
