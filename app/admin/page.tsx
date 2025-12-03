import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { SongList } from "@/components/song-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const { data: songs } = await supabase
    .from('songs')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-8 py-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage and delete your songs</p>
        </div>
        <Link href="/upload">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Song
          </Button>
        </Link>
      </div>
      <SongList
        songs={songs || []}
        isAdmin={true}
        title=""
        description=""
      />
    </div>
  )
}
