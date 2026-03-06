'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, MessageSquare, Clock, CheckSquare, Send } from 'lucide-react'
import { Post, ContentStatus } from '@/lib/mock-data'
import { statusColor, statusLabel, typeLabel, formatDate } from '@/lib/utils'

export default function AprovacaoPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [activePost, setActivePost] = useState<string | null>(null)
  const [comment, setComment] = useState('')
  const [filter, setFilter] = useState<ContentStatus | 'all'>('em_aprovacao')

  useEffect(() => {
    fetch('/api/portal/posts')
      .then(r => r.json())
      .then(data => {
        setPosts(data.posts)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  async function handleAction(postId: string, action: 'approve' | 'request_change') {
    const optimisticStatus: ContentStatus = action === 'approve' ? 'aprovado' : 'rascunho'
    setPosts(prev =>
      prev.map(p =>
        p.id === postId
          ? { ...p, status: optimisticStatus, comment: action === 'request_change' ? comment : undefined }
          : p
      )
    )
    setActivePost(null)
    setComment('')

    await fetch('/api/portal/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, action, comment }),
    })
  }

  const filtered = filter === 'all' ? posts : posts.filter(p => p.status === filter)
  const pendingCount = posts.filter(p => p.status === 'em_aprovacao').length

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center py-24">
        <div className="animate-spin w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <CheckSquare className="w-6 h-6 text-gold-500" />
          Aprovação de Conteúdo
        </h1>
        <p className="text-dark-400 mt-1">
          {pendingCount > 0
            ? `${pendingCount} ${pendingCount === 1 ? 'conteúdo aguarda' : 'conteúdos aguardam'} sua aprovação.`
            : 'Todos os conteúdos estão em dia.'}
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { value: 'em_aprovacao', label: 'Aguardando', count: posts.filter(p => p.status === 'em_aprovacao').length },
          { value: 'aprovado', label: 'Aprovados', count: posts.filter(p => p.status === 'aprovado').length },
          { value: 'publicado', label: 'Publicados', count: posts.filter(p => p.status === 'publicado').length },
          { value: 'rascunho', label: 'Rascunhos', count: posts.filter(p => p.status === 'rascunho').length },
          { value: 'all', label: 'Todos', count: posts.length },
        ].map(tab => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value as ContentStatus | 'all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              filter === tab.value
                ? 'bg-gold-500/15 text-gold-400 border border-gold-500/30'
                : 'text-dark-400 hover:text-dark-200 border border-dark-800 hover:border-dark-700'
            }`}
          >
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              filter === tab.value ? 'bg-gold-500/20 text-gold-400' : 'bg-dark-800 text-dark-500'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Posts list */}
      {filtered.length === 0 ? (
        <div className="card text-center py-16">
          <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4 opacity-50" />
          <p className="text-dark-400">Nenhum conteúdo nesta categoria.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(post => (
            <div key={post.id} className="card">
              {/* Post header */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: post.thumbnailColor + '20', border: `1px solid ${post.thumbnailColor}40` }}
                  >
                    <span className="text-xs font-bold" style={{ color: post.thumbnailColor }}>
                      {typeLabel(post.type).slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-dark-100 font-semibold">{post.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-dark-500 text-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(post.scheduledDate)}
                      </span>
                      <span className="text-dark-600 text-xs">{typeLabel(post.type)}</span>
                      <span className="text-dark-600 text-xs">{post.platform.join(', ')}</span>
                    </div>
                  </div>
                </div>
                <span className={`badge ${statusColor(post.status)} flex-shrink-0`}>
                  {statusLabel(post.status)}
                </span>
              </div>

              {/* Caption */}
              <div className="bg-dark-800/50 rounded-xl p-4 mb-4">
                <p className="text-dark-500 text-xs font-medium uppercase tracking-wider mb-2">Legenda</p>
                <p className="text-dark-300 text-sm leading-relaxed">{post.caption}</p>
              </div>

              {/* Previous comment */}
              {post.comment && (
                <div className="bg-amber-900/10 border border-amber-800/30 rounded-xl p-3 mb-4 flex gap-2">
                  <MessageSquare className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-amber-300 text-sm">{post.comment}</p>
                </div>
              )}

              {/* Actions for pending posts */}
              {post.status === 'em_aprovacao' && (
                <>
                  {activePost === post.id ? (
                    <div className="space-y-3">
                      <textarea
                        className="input resize-none"
                        rows={3}
                        placeholder="Descreva o que precisa ser ajustado..."
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleAction(post.id, 'request_change')}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-900/20 border border-amber-800/50 text-amber-400 text-sm font-medium hover:bg-amber-900/30 transition-colors"
                        >
                          <Send className="w-4 h-4" />
                          Enviar solicitação
                        </button>
                        <button
                          onClick={() => { setActivePost(null); setComment('') }}
                          className="px-4 py-2.5 rounded-lg text-dark-400 text-sm hover:text-dark-200 transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleAction(post.id, 'approve')}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-900/20 border border-emerald-800/50 text-emerald-400 text-sm font-semibold hover:bg-emerald-900/30 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Aprovar
                      </button>
                      <button
                        onClick={() => setActivePost(post.id)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-dark-800 border border-dark-700 text-dark-300 text-sm font-medium hover:border-dark-600 hover:text-dark-100 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        Solicitar alteração
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
