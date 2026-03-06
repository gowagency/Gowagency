import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getClientById, getPostsByClient } from '@/lib/mock-data'
import { statusColor, statusLabel, typeLabel, formatDate } from '@/lib/utils'
import { Calendar, Instagram, Linkedin } from 'lucide-react'

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  Instagram: <Instagram className="w-3 h-3" />,
  LinkedIn: <Linkedin className="w-3 h-3" />,
  TikTok: <span className="text-xs font-bold">TK</span>,
}

export default async function CalendarioPage() {
  const session = await getServerSession(authOptions)
  const user = session!.user as { clientId?: string }
  const client = getClientById(user.clientId!)!
  const posts = getPostsByClient(client.id)

  // Group posts by week
  const sorted = [...posts].sort(
    (a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()
  )

  // Get current month range for display
  const now = new Date()
  const monthLabel = now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })

  // Build a simple calendar grid for March 2026
  const year = 2026
  const month = 2 // March (0-indexed)
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const postsByDay: Record<number, typeof posts> = {}
  posts.forEach(post => {
    const d = new Date(post.scheduledDate)
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate()
      if (!postsByDay[day]) postsByDay[day] = []
      postsByDay[day].push(post)
    }
  })

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Calendar className="w-6 h-6 text-gold-500" />
          Calendário Editorial
        </h1>
        <p className="text-dark-400 mt-1">Todos os conteúdos planejados para o seu projeto.</p>
      </div>

      {/* Status legend */}
      <div className="flex flex-wrap gap-3 mb-6">
        {(['rascunho', 'em_aprovacao', 'aprovado', 'publicado'] as const).map(status => (
          <span key={status} className={`badge ${statusColor(status)}`}>
            {statusLabel(status)}
          </span>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="card mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-white capitalize">{monthLabel}</h2>
          <span className="text-dark-400 text-sm">{posts.length} conteúdos</span>
        </div>

        {/* Week headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-center text-dark-500 text-xs font-medium py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells before first day */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[80px]" />
          ))}

          {/* Days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const dayPosts = postsByDay[day] || []
            const isToday = day === 6 // March 6 = "today" in the demo
            return (
              <div
                key={day}
                className={`min-h-[80px] p-1.5 rounded-lg border transition-colors ${
                  isToday
                    ? 'border-gold-500/50 bg-gold-500/5'
                    : dayPosts.length > 0
                    ? 'border-dark-700 bg-dark-800/50'
                    : 'border-dark-800/50'
                }`}
              >
                <span className={`text-xs font-medium block mb-1 ${isToday ? 'text-gold-500' : 'text-dark-400'}`}>
                  {day}
                </span>
                <div className="space-y-1">
                  {dayPosts.slice(0, 2).map(post => (
                    <div
                      key={post.id}
                      className={`text-xs px-1 py-0.5 rounded truncate ${statusColor(post.status)}`}
                      title={post.title}
                    >
                      {post.type}
                    </div>
                  ))}
                  {dayPosts.length > 2 && (
                    <div className="text-xs text-dark-500">+{dayPosts.length - 2}</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* List view */}
      <div className="card">
        <h2 className="font-semibold text-white mb-6">Lista de conteúdos</h2>
        <div className="space-y-3">
          {sorted.map(post => (
            <div key={post.id} className="flex items-start gap-4 p-4 bg-dark-800/50 rounded-xl hover:bg-dark-800 transition-colors">
              <div
                className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center"
                style={{ backgroundColor: post.thumbnailColor + '20', border: `1px solid ${post.thumbnailColor}40` }}
              >
                <span className="text-xs font-bold" style={{ color: post.thumbnailColor }}>
                  {typeLabel(post.type).slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-dark-100 font-medium text-sm leading-snug">{post.title}</p>
                  <span className={`badge ${statusColor(post.status)} flex-shrink-0`}>
                    {statusLabel(post.status)}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-dark-500 text-xs flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(post.scheduledDate)}
                  </span>
                  <span className="text-dark-600 text-xs">{typeLabel(post.type)}</span>
                  <div className="flex items-center gap-1">
                    {post.platform.map(p => (
                      <span key={p} className="text-dark-500 flex items-center gap-0.5 text-xs" title={p}>
                        {PLATFORM_ICONS[p] || <span>{p[0]}</span>}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
