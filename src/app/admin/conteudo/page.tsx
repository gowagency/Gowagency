import { posts, clients } from '@/lib/mock-data'
import { statusColor, statusLabel, typeLabel, formatDate } from '@/lib/utils'
import { FileText, Clock } from 'lucide-react'

export default function ConteudoPage() {
  const sorted = [...posts].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )

  const byStatus = {
    em_aprovacao: sorted.filter(p => p.status === 'em_aprovacao'),
    rascunho: sorted.filter(p => p.status === 'rascunho'),
    aprovado: sorted.filter(p => p.status === 'aprovado'),
    publicado: sorted.filter(p => p.status === 'publicado'),
  }

  function PostRow({ post }: { post: typeof posts[0] }) {
    const client = clients.find(c => c.id === post.clientId)
    return (
      <div className="flex items-start gap-4 p-4 bg-dark-800/50 hover:bg-dark-800 rounded-xl transition-colors">
        <div
          className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-xs font-bold"
          style={{ backgroundColor: post.thumbnailColor + '20', color: post.thumbnailColor, border: `1px solid ${post.thumbnailColor}40` }}
        >
          {post.type.slice(0, 2).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-dark-100 font-medium text-sm">{post.title}</p>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-dark-500 text-xs">{client?.name}</span>
            <span className="text-dark-600 text-xs">·</span>
            <span className="text-dark-500 text-xs">{typeLabel(post.type)}</span>
            <span className="text-dark-600 text-xs">·</span>
            <span className="text-dark-500 text-xs flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDate(post.scheduledDate)}
            </span>
          </div>
          {post.comment && (
            <p className="text-amber-400 text-xs mt-1.5 bg-amber-900/10 px-2 py-1 rounded-lg border border-amber-800/30">
              💬 {post.comment}
            </p>
          )}
        </div>
        <span className={`badge ${statusColor(post.status)} flex-shrink-0`}>
          {statusLabel(post.status)}
        </span>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <FileText className="w-6 h-6 text-gold-500" />
          Gestão de Conteúdo
        </h1>
        <p className="text-dark-400 mt-1">Todos os conteúdos de todos os clientes.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Aguardando', value: byStatus.em_aprovacao.length, color: 'text-amber-400' },
          { label: 'Rascunho', value: byStatus.rascunho.length, color: 'text-dark-400' },
          { label: 'Aprovado', value: byStatus.aprovado.length, color: 'text-emerald-400' },
          { label: 'Publicado', value: byStatus.publicado.length, color: 'text-blue-400' },
        ].map(s => (
          <div key={s.label} className="card text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-dark-500 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Pending approval first */}
      {byStatus.em_aprovacao.length > 0 && (
        <div className="mb-6">
          <h2 className="font-semibold text-amber-400 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Aguardando aprovação do cliente
          </h2>
          <div className="space-y-2">
            {byStatus.em_aprovacao.map(post => <PostRow key={post.id} post={post} />)}
          </div>
        </div>
      )}

      {/* All posts */}
      <div className="card">
        <h2 className="font-semibold text-white mb-5">Todos os conteúdos</h2>
        <div className="space-y-2">
          {sorted.map(post => <PostRow key={post.id} post={post} />)}
        </div>
      </div>
    </div>
  )
}
