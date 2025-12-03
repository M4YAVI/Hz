'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Upload, Music, ImageIcon, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function UploadPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [duration, setDuration] = useState(0)
  
  const audioInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    album: '',
    category: '',
  })

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const audio = new Audio(URL.createObjectURL(file))
      audio.onloadedmetadata = () => {
        setDuration(Math.round(audio.duration))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setUploading(true)

    try {
      const audioFile = audioInputRef.current?.files?.[0]
      const imageFile = imageInputRef.current?.files?.[0]

      if (!audioFile || !imageFile) {
        alert('Please select both audio and image files')
        return
      }

      // Upload Image
      const imageExt = imageFile.name.split('.').pop()
      const imageFileName = `${Math.random()}.${imageExt}`
      const { data: imageData, error: imageError } = await supabase.storage
        .from('images')
        .upload(imageFileName, imageFile)

      if (imageError) throw imageError

      // Upload Audio
      const audioExt = audioFile.name.split('.').pop()
      const audioFileName = `${Math.random()}.${audioExt}`
      const { data: audioData, error: audioError } = await supabase.storage
        .from('audio')
        .upload(audioFileName, audioFile)

      if (audioError) throw audioError

      // Get Public URLs
      const { data: { publicUrl: imageUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(imageFileName)

      const { data: { publicUrl: audioUrl } } = supabase.storage
        .from('audio')
        .getPublicUrl(audioFileName)

      // Save to Database
      const { error: dbError } = await supabase
        .from('songs')
        .insert({
          title: formData.title,
          author: formData.author,
          album: formData.album,
          category: formData.category,
          image_url: imageUrl,
          audio_url: audioUrl,
          duration: duration,
        })

      if (dbError) throw dbError

      router.push('/')
      router.refresh()
    } catch (error: any) {
      console.error('Error uploading:', error)
      alert(error.message || 'Error uploading song')
    } finally {
      setLoading(false)
      setUploading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl mb-24">
      <Link href="/" className="flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Link>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Upload New Song</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Cover Image</Label>
                <div 
                  className="border-2 border-dashed border-border rounded-lg aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors bg-muted/50"
                  onClick={() => imageInputRef.current?.click()}
                >
                  {imageInputRef.current?.files?.[0] ? (
                    <img 
                      src={URL.createObjectURL(imageInputRef.current.files[0]) || "/placeholder.svg"} 
                      alt="Preview" 
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <>
                      <ImageIcon className="w-8 h-8 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">Click to upload</span>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  ref={imageInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    // Force re-render to show preview
                    setFormData({ ...formData })
                  }}
                />
              </div>

              {/* Metadata Inputs */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Song title"
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Artist name"
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="album">Album</Label>
                  <Input
                    id="album"
                    value={formData.album}
                    onChange={(e) => setFormData({ ...formData, album: e.target.value })}
                    placeholder="Album name"
                    className="bg-background"
                  />
                </div>
              </div>
            </div>

            {/* Audio Upload */}
            <div className="space-y-2">
              <Label>Audio File</Label>
              <div 
                className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors bg-muted/50"
                onClick={() => audioInputRef.current?.click()}
              >
                {audioInputRef.current?.files?.[0] ? (
                  <div className="flex items-center text-primary">
                    <Music className="w-6 h-6 mr-2" />
                    <span className="font-medium">{audioInputRef.current.files[0].name}</span>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Click to upload audio (MP3, WAV)</span>
                  </>
                )}
              </div>
              <input
                type="file"
                ref={audioInputRef}
                accept="audio/*"
                className="hidden"
                onChange={handleAudioChange}
              />
              {duration > 0 && (
                <p className="text-sm text-muted-foreground text-right">
                  Duration: {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}
                </p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                required 
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Animes">Animes</SelectItem>
                  <SelectItem value="Earworm">Earworm</SelectItem>
                  <SelectItem value="Favourites">Favourites</SelectItem>
                  <SelectItem value="Audio">Audio</SelectItem>
                  <SelectItem value="Podcasts">Podcasts</SelectItem>
                  <SelectItem value="Recent">Recent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {uploading ? 'Uploading Files...' : 'Saving...'}
                </>
              ) : (
                'Submit Song'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
