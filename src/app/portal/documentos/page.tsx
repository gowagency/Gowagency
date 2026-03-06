import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getClientById, getDocumentsByClient } from '@/lib/mock-data'
import { categoryLabel, categoryIcon, formatDate } from '@/lib/utils'
import { FolderOpen, Download, FileText } from 'lucide-react'

const categoryOrder = ['diagnostico', 'posicionamento', 'estrategia', 'tom_de_voz', 'relatorio']

export default async function DocumentosPage() {
  const session = await getServerSession(authOptions)
  const user = session!.user as { clientId?: string }
  const client = getClientById(user.clientId!)!
  const docs = getDocumentsByClient(client.id)

  const grouped = categoryOrder.reduce((acc, cat) => {
    const catDocs = docs.filter(d => d.category === cat)
    if (catDocs.length > 0) acc[cat] = catDocs
    return acc
  }, {} as Record<string, typeof docs>)

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <FolderOpen className="w-6 h-6 text-gold-500" />
          Documentos do Projeto
        </h1>
        <p className="text-dark-400 mt-1">
          Todos os materiais estratégicos do seu projeto, organizados por categoria.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total', value: docs.length, color: 'text-dark-200' },
          { label: 'Estratégia', value: docs.filter(d => ['posicionamento', 'estrategia', 'tom_de_voz'].includes(d.category)).length, color: 'text-gold-400' },
          { label: 'Relatórios', value: docs.filter(d => d.category === 'relatorio').length, color: 'text-blue-400' },
          { label: 'Diagnóstico', value: docs.filter(d => d.category === 'diagnostico').length, color: 'text-emerald-400' },
        ].map(stat => (
          <div key={stat.label} className="card text-center">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-dark-500 text-xs mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Grouped documents */}
      <div className="space-y-6">
        {Object.entries(grouped).map(([category, catDocs]) => (
          <div key={category} className="card">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-2xl">{categoryIcon(category)}</span>
              <div>
                <h2 className="font-semibold text-white">{categoryLabel(category)}</h2>
                <p className="text-dark-500 text-xs">{catDocs.length} {catDocs.length === 1 ? 'documento' : 'documentos'}</p>
              </div>
            </div>
            <div className="space-y-2">
              {catDocs.map(doc => (
                <div
                  key={doc.id}
                  className="flex items-center gap-4 p-3 bg-dark-800/50 hover:bg-dark-800 rounded-xl transition-colors group"
                >
                  <div className="w-10 h-10 bg-dark-700 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-dark-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-dark-100 text-sm font-medium truncate">{doc.name}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-dark-500 text-xs">{formatDate(doc.createdAt)}</span>
                      <span className="text-dark-600 text-xs">{doc.size}</span>
                    </div>
                  </div>
                  <a
                    href={doc.url}
                    className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-medium hover:bg-gold-500/20"
                  >
                    <Download className="w-3 h-3" />
                    Baixar
                  </a>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {docs.length === 0 && (
        <div className="card text-center py-16">
          <FolderOpen className="w-12 h-12 text-dark-600 mx-auto mb-4" />
          <p className="text-dark-400">Nenhum documento disponível ainda.</p>
          <p className="text-dark-600 text-sm mt-1">Os documentos serão adicionados conforme o projeto avança.</p>
        </div>
      )}
    </div>
  )
}
