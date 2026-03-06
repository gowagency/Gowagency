import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getClientById, getPostStats, getInsightsByClient, getPostsByClient } from '@/lib/mock-data'
import { statusColor, statusLabel, formatDate } from '@/lib/utils'
import { CheckSquare, Clock, FileText, TrendingUp, Lightbulb, Calendar } from 'lucide-react'
import Link from 'next/link'

export default async function PortalDashboard() {
  const session = await getServerSession(authOptions)
  const user = session!.user as { clientId?: string; name?: string }
  const client = getClientById(user.clientId!)!
  const stats = getPostStats(client.id)
  const insights = getInsightsByClient(client.id)
  const recentPosts = getPostsByClient(client.id).slice(0, 3)
  const unreadInsights = insights.filter(i => !i.isRead).length
  const approvalRate = stats.total > 0
    ? Math.round(((stats.aprovado + stats.publicado) / stats.total) * 100)
    : 0

  return (
    <div className="max-w-5xl mx-auto">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          Olá, {client.name.split(' ')[0]} 👋
        </h1>
        <p className="text-dark-400 mt-1">{client.phase}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: 'Total de Conteúdos',
            value: stats.total,
            icon: <FileText className="w-5 h-5 text-gold-500" />,
            sub: 'no projeto',
          },
          {
            label: 'Em Aprovação',
            value: stats.em_aprovacao,
            icon: <Clock className="w-5 h-5 text-amber-400" />,
            sub: 'aguardando você',
            href: '/portal/aprovacao',
            highlight: stats.em_aprovacao > 0,
          },
          {
            label: 'Taxa de Aprovação',
            value: `${approvalRate}%`,
            icon: <TrendingUp className="w-5 h-5 text-emerald-400" />,
            sub: 'aprovados + publicados',
          },
          {
            label: 'Insights Novos',
            value: unreadInsights,
            icon: <Lightbulb className="w-5 h-5 text-blue-400" />,
            sub: 'para ler hoje',
            href: '/portal/insights',
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`card ${stat.highlight ? 'border-amber-800/50 bg-amber-900/10' : ''}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-dark-800 rounded-xl flex items-center justify-center">
                {stat.icon}
              </div>
              {stat.href && stat.value > 0 && (
                <Link href={stat.href} className="text-xs text-gold-500 hover:underline">
                  Ver →
                </Link>
              )}
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-dark-400 text-xs mt-1">{stat.label}</p>
            <p className="text-dark-600 text-xs">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent content */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-white">Conteúdo recente</h2>
            <Link href="/portal/calendario" className="text-gold-500 text-sm hover:underline flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Ver calendário
            </Link>
          </div>
          <div className="space-y-3">
            {recentPosts.map((post) => (
              <div key={post.id} className="flex items-center gap-4 p-3 bg-dark-800/50 rounded-xl hover:bg-dark-800 transition-colors">
                <div
                  className="w-10 h-10 rounded-lg flex-shrink-0"
                  style={{ backgroundColor: post.thumbnailColor + '30', border: `1px solid ${post.thumbnailColor}40` }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-xs font-bold" style={{ color: post.thumbnailColor }}>
                      {post.type.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-dark-100 text-sm font-medium truncate">{post.title}</p>
                  <p className="text-dark-500 text-xs">{formatDate(post.scheduledDate)}</p>
                </div>
                <span className={`badge ${statusColor(post.status)} flex-shrink-0`}>
                  {statusLabel(post.status)}
                </span>
              </div>
            ))}
          </div>
          {stats.em_aprovacao > 0 && (
            <Link
              href="/portal/aprovacao"
              className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-amber-800/50 bg-amber-900/10 text-amber-400 text-sm font-medium hover:bg-amber-900/20 transition-colors"
            >
              <CheckSquare className="w-4 h-4" />
              {stats.em_aprovacao} {stats.em_aprovacao === 1 ? 'conteúdo aguarda' : 'conteúdos aguardam'} sua aprovação
            </Link>
          )}
        </div>

        {/* Latest insight */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-white">Insight do dia</h2>
            <Link href="/portal/insights" className="text-gold-500 text-sm hover:underline">
              Ver todos
            </Link>
          </div>
          {insights[0] ? (
            <div>
              <span className="text-xs font-medium text-gold-500 uppercase tracking-wider">
                {insights[0].category}
              </span>
              <h3 className="text-dark-100 font-medium mt-2 mb-3 leading-snug">
                {insights[0].title}
              </h3>
              <p className="text-dark-400 text-sm leading-relaxed line-clamp-4">
                {insights[0].content}
              </p>
              <Link
                href="/portal/insights"
                className="mt-4 text-gold-500 text-sm hover:underline flex items-center gap-1"
              >
                Ler completo →
              </Link>
            </div>
          ) : (
            <p className="text-dark-500 text-sm">Nenhum insight disponível hoje.</p>
          )}
        </div>
      </div>

      {/* Project info */}
      <div className="card mt-6">
        <h2 className="font-semibold text-white mb-4">Seu projeto</h2>
        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-dark-500 text-xs uppercase tracking-wider mb-1">Empresa</p>
            <p className="text-dark-200">{client.company}</p>
          </div>
          <div>
            <p className="text-dark-500 text-xs uppercase tracking-wider mb-1">Nicho</p>
            <p className="text-dark-200">{client.niche}</p>
          </div>
          <div>
            <p className="text-dark-500 text-xs uppercase tracking-wider mb-1">Início</p>
            <p className="text-dark-200">{formatDate(client.startDate)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
