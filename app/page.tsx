import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { SongList } from "@/components/song-list"

export const dynamic = 'force-dynamic'

export default async function Home(props: { searchParams: Promise<{ category?: string, sort?: string }> }) {
  const searchParams = await props.searchParams
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

  let query = supabase.from('songs').select('*')

  if (searchParams.category) {
    query = query.eq('category', searchParams.category)
  }

  if (searchParams.sort === 'recent') {
    query = query.order('created_at', { ascending: false })
  } else {
    query = query.order('created_at', { ascending: false })
  }

  const { data: songs } = await query

  const title = searchParams.category || (searchParams.sort === 'recent' ? 'Recently Added' : 'All Songs')

  return (
    <SongList 
      songs={songs || []} 
      title={title}
      description={searchParams.category ? `Your ${searchParams.category} collection` : "All your music in one place"}
    />
  )
}
