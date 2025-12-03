import { create } from 'zustand'
import { Song } from '@/types/song'

interface PlayerStore {
  currentSong: Song | null
  isPlaying: boolean
  queue: Song[]
  currentIndex: number
  isShuffle: boolean

  setQueue: (songs: Song[]) => void
  playSong: (song: Song) => void
  togglePlay: () => void
  playNext: () => void
  playPrevious: () => void
  toggleShuffle: () => void
  setShuffle: (shuffle: boolean) => void
  isLooping: boolean
  toggleLoop: () => void
  isSidebarCollapsed: boolean
  toggleSidebar: () => void
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  queue: [],
  currentIndex: -1,
  isShuffle: false,
  isLooping: false,
  isSidebarCollapsed: false,

  setQueue: (songs) => set({ queue: songs }),

  playSong: (song) => {
    const { queue } = get()
    const index = queue.findIndex(s => s.id === song.id)
    set({ currentSong: song, isPlaying: true, currentIndex: index })
  },

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

  playNext: () => {
    const { queue, currentIndex, isShuffle } = get()
    if (queue.length === 0) return

    let nextIndex
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * queue.length)
    } else {
      nextIndex = (currentIndex + 1) % queue.length
    }

    set({
      currentSong: queue[nextIndex],
      currentIndex: nextIndex,
      isPlaying: true
    })
  },

  playPrevious: () => {
    const { queue, currentIndex } = get()
    if (queue.length === 0) return

    const prevIndex = currentIndex - 1 < 0 ? queue.length - 1 : currentIndex - 1
    set({
      currentSong: queue[prevIndex],
      currentIndex: prevIndex,
      isPlaying: true
    })
  },

  toggleShuffle: () => set((state) => ({ isShuffle: !state.isShuffle })),
  setShuffle: (shuffle: boolean) => set({ isShuffle: shuffle }),
  toggleLoop: () => set((state) => ({ isLooping: !state.isLooping })),
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
}))
