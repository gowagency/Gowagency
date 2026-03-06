import { clients, posts, insights, documents } from '@/lib/mock-data'
import { statusColor, statusLabel, formatDate } from '@/lib/utils'
import { Users, FileText, Lightbulb, CheckSquare, Clock, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboard() {
  const totalPosts = posts.length
  const pendingApproval = posts.filter(p => p.status === 'em_aprovacao').length
  const published = posts.filter(p => p.status === 'publicado').length
  const recentPosts = [...posts]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5)

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard Admin</h1>
        <p className="text-dark-400 mt-1">Visão geral de todos os clientes e projetos.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Clientes Ativos', value: clients.length, icon: <Users className="w-5 h-5 text-gold-500" />, href: '/admin/clientes' },
          { label: 'Aguardando Aprovação', value: pendingApproval, icon: <Clock className="w-5 h-5 text-amber-400" />, href: '/admin/conteudo', highlight: pendingApproval > 0 },
          { label: 'Conteúdos Publicados', value: published, icon: <TrendingUp className="w-5 h-5 text-emerald-400" /> },
          { label: 'Total de Insights', value: insights.length, icon: <Lightbulb className="w-5 h-5 text-blue-400" /> },
        ].map((stat) => (
          <div key={stat.label} className={`card ${stat.highlight ? 'border-amber-800/50 bg-amber-900/10' : ''}`}>
            <div className="w-10 h-10 bg-dark-800 rounded-xl flex items-center justify-center mb-3">
              {stat.icon}
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-dark-400 text-xs mt-1">{stat.label}</p>
            {stat.href && (
              <Link href={stat.href} className="text-gold-500 text-xs hover:underline mt-2 block">
                Ver →
              </Link>
            )}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Clients overview */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-white">Clientes</h2>
            <Link href="/admin/clientes" className="text-gold-500 text-sm hover:underline">Ver todos</Link>
          </div>
          <div className="space-y-3">
            {clients.map(client => {
              const clientPosts = posts.filter(p => p.clientId === client.id)
              const pending = clientPosts.filter(p => p.status === 'em_aprovacao').length
              return (
                <Link
                  key={client.id}
                  href={`/admin/clientes`}
                  className="flex items-center gap-3 p-3 bg-dark-800/50 hover:bg-dark-800 rounded-xl transition-colors"
                >
                  <div className="w-9 h-9 bg-gold-500/20 border border-gold-500/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-gold-400 text-xs font-bold">{client.avatar}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-dark-100 text-sm font-medium truncate">{client.name}</p>
                    <p className="text-dark-500 text-xs truncate">{client.niche}</p>
                  </div>
                  {pending > 0 && (
                    <span className="bg-amber-900/30 text-amber-400 border border-amber-800/50 text-xs px-2 py-0.5 rounded-full flex-shrink-0">
                      {pending} pendente{pending !== 1 ? 's' : ''}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Recent content */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-white">Conteúdos recentes</h2>
            <Link href="/admin/conteudo" className="text-gold-500 text-sm hover:underline">Ver todos</Link>
          </div>
          <div className="space-y-3">
            {recentPosts.map(post => {
              const client = clients.find(c => c.id === post.clientId)
              return (
                <div key={post.id} className="flex items-center gap-3 p-3 bg-dark-800/50 rounded-xl">
                  <div
                    className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: post.thumbnailColor + '20', color: post.thumbnailColor, border: `1px solid ${post.thumbnailColor}40` }}
                  >
                    {post.type.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-dark-100 text-sm font-medium truncate">{post.title}</p>
                    <p className="text-dark-500 text-xs">{client?.name} · {formatDate(post.scheduledDate)}</p>
                  </div>
                  <span className={`badge ${statusColor(post.status)} flex-shrink-0`}>
                    {statusLabel(post.status)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
