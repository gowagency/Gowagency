import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getClientById, getInsightsByClient } from '@/lib/mock-data'
import { Lightbulb, BookOpen } from 'lucide-react'

export default async function InsightsPage() {
  const session = await getServerSession(authOptions)
  const user = session!.user as { clientId?: string }
  const client = getClientById(user.clientId!)!
  const insights = getInsightsByClient(client.id)

  const sorted = [...insights].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )

  const unread = insights.filter(i => !i.isRead).length

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Lightbulb className="w-6 h-6 text-gold-500" />
          Insights Diários
        </h1>
        <p className="text-dark-400 mt-1">
          Inteligência estratégica personalizada para o seu negócio, todo dia.
          {unread > 0 && (
            <span className="ml-2 bg-gold-500/20 text-gold-400 text-xs px-2 py-0.5 rounded-full border border-gold-500/30">
              {unread} novo{unread !== 1 ? 's' : ''}
            </span>
          )}
        </p>
      </div>

      {/* Today's insight highlight */}
      {sorted[0] && !sorted[0].isRead && (
        <div className="bg-gradient-to-br from-gold-900/20 to-dark-900 border border-gold-800/40 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-gold-500" />
            <span className="text-gold-400 text-xs font-medium uppercase tracking-wider">Insight de hoje</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-3">{sorted[0].title}</h2>
          <p className="text-dark-300 leading-relaxed">{sorted[0].content}</p>
          <div className="flex items-center justify-between mt-4">
            <span className="text-dark-500 text-xs">
              {new Date(sorted[0].publishedAt).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </span>
            <span className="bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs px-2.5 py-1 rounded-full">
              {sorted[0].category}
            </span>
          </div>
        </div>
      )}

      {/* All insights */}
      <div className="space-y-4">
        {sorted.map((insight, idx) => {
          if (idx === 0 && !insight.isRead) return null // Already shown above

          return (
            <div
              key={insight.id}
              className={`card transition-colors ${
                !insight.isRead ? 'border-gold-800/40' : 'opacity-80 hover:opacity-100'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className={`w-4 h-4 ${insight.isRead ? 'text-dark-600' : 'text-gold-500'}`} />
                  <span className="text-dark-500 text-xs">
                    {new Date(insight.publishedAt).toLocaleDateString('pt-BR', {
                      weekday: 'long',
                      day: '2-digit',
                      month: 'long',
                    })}
                  </span>
                  {!insight.isRead && (
                    <span className="w-2 h-2 rounded-full bg-gold-500 flex-shrink-0" />
                  )}
                </div>
                <span className="bg-dark-800 text-dark-400 text-xs px-2.5 py-1 rounded-full flex-shrink-0">
                  {insight.category}
                </span>
              </div>
              <h3 className="text-dark-100 font-semibold mb-2">{insight.title}</h3>
              <p className="text-dark-400 text-sm leading-relaxed">{insight.content}</p>
            </div>
          )
        })}
      </div>

      {insights.length === 0 && (
        <div className="card text-center py-16">
          <Lightbulb className="w-12 h-12 text-dark-600 mx-auto mb-4" />
          <p className="text-dark-400">Nenhum insight disponível ainda.</p>
          <p className="text-dark-600 text-sm mt-1">Insights são publicados diariamente às 8h.</p>
        </div>
      )}
    </div>
  )
}
