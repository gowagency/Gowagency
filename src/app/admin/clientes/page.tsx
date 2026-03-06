import { clients, posts, documents, insights } from '@/lib/mock-data'
import { formatDate, statusColor, statusLabel } from '@/lib/utils'
import { Users, Calendar, FileText, Lightbulb, Mail, Building2 } from 'lucide-react'

export default function ClientesPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Users className="w-6 h-6 text-gold-500" />
          Clientes
        </h1>
        <p className="text-dark-400 mt-1">{clients.length} clientes ativos na plataforma.</p>
      </div>

      <div className="space-y-6">
        {clients.map(client => {
          const clientPosts = posts.filter(p => p.clientId === client.id)
          const clientDocs = documents.filter(d => d.clientId === client.id)
          const clientInsights = insights.filter(i => i.clientId === client.id)
          const pending = clientPosts.filter(p => p.status === 'em_aprovacao')

          return (
            <div key={client.id} className="card">
              {/* Client header */}
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gold-500/20 border border-gold-500/30 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <span className="text-gold-400 text-lg font-bold">{client.avatar}</span>
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-lg">{client.name}</h2>
                    <div className="flex items-center gap-4 mt-1 text-dark-400 text-sm">
                      <span className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5" />
                        {client.company}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" />
                        {client.email}
                      </span>
                    </div>
                    <p className="text-dark-500 text-sm mt-1">{client.phase}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-dark-500 text-xs">Cliente desde</p>
                  <p className="text-dark-300 text-sm font-medium">{formatDate(client.startDate)}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'Conteúdos', value: clientPosts.length, icon: <FileText className="w-4 h-4 text-gold-500" /> },
                  { label: 'Documentos', value: clientDocs.length, icon: <FileText className="w-4 h-4 text-blue-400" /> },
                  { label: 'Insights', value: clientInsights.length, icon: <Lightbulb className="w-4 h-4 text-emerald-400" /> },
                ].map(stat => (
                  <div key={stat.label} className="bg-dark-800/50 rounded-xl p-3 flex items-center gap-3">
                    {stat.icon}
                    <div>
                      <p className="text-white font-bold">{stat.value}</p>
                      <p className="text-dark-500 text-xs">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pending content */}
              {pending.length > 0 && (
                <div>
                  <p className="text-dark-400 text-sm font-medium mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    Aguardando aprovação do cliente ({pending.length})
                  </p>
                  <div className="space-y-2">
                    {pending.map(post => (
                      <div key={post.id} className="flex items-center gap-3 p-3 bg-amber-900/10 border border-amber-800/30 rounded-xl">
                        <div
                          className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold"
                          style={{ backgroundColor: post.thumbnailColor + '20', color: post.thumbnailColor }}
                        >
                          {post.type.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-dark-100 text-sm truncate">{post.title}</p>
                          <p className="text-dark-500 text-xs">{formatDate(post.scheduledDate)}</p>
                        </div>
                        <span className={`badge ${statusColor(post.status)}`}>
                          {statusLabel(post.status)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
