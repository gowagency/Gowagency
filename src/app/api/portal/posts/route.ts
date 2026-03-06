import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getPostsByClient, posts as allPosts } from '@/lib/mock-data'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = session.user as { clientId?: string }
  if (!user.clientId) return NextResponse.json({ error: 'No client' }, { status: 400 })

  const clientPosts = getPostsByClient(user.clientId)
  return NextResponse.json({ posts: clientPosts })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { postId, action, comment } = await req.json()
  const user = session.user as { clientId?: string }

  const post = allPosts.find(p => p.id === postId && p.clientId === user.clientId)
  if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })

  // Mutate in-memory (in production this would update a database)
  if (action === 'approve') {
    post.status = 'aprovado'
    post.comment = undefined
  } else if (action === 'request_change') {
    post.status = 'rascunho'
    post.comment = comment
  }

  return NextResponse.json({ success: true, post })
}
