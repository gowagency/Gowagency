import { clsx, type ClassValue } from 'clsx'
import { ContentStatus, ContentType } from './mock-data'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function statusLabel(status: ContentStatus): string {
  const labels: Record<ContentStatus, string> = {
    rascunho: 'Rascunho',
    em_aprovacao: 'Em Aprovação',
    aprovado: 'Aprovado',
    publicado: 'Publicado',
  }
  return labels[status]
}

export function statusColor(status: ContentStatus): string {
  const colors: Record<ContentStatus, string> = {
    rascunho: 'bg-dark-800 text-dark-300 border border-dark-700',
    em_aprovacao: 'bg-amber-900/30 text-amber-400 border border-amber-800/50',
    aprovado: 'bg-emerald-900/30 text-emerald-400 border border-emerald-800/50',
    publicado: 'bg-blue-900/30 text-blue-400 border border-blue-800/50',
  }
  return colors[status]
}

export function typeLabel(type: ContentType): string {
  const labels: Record<ContentType, string> = {
    post: 'Post',
    reels: 'Reels',
    stories: 'Stories',
    carrossel: 'Carrossel',
    artigo: 'Artigo',
  }
  return labels[type]
}

export function categoryLabel(category: string): string {
  const labels: Record<string, string> = {
    posicionamento: 'Posicionamento',
    estrategia: 'Estratégia',
    tom_de_voz: 'Tom de Voz',
    relatorio: 'Relatório',
    diagnostico: 'Diagnóstico',
  }
  return labels[category] || category
}

export function categoryIcon(category: string): string {
  const icons: Record<string, string> = {
    posicionamento: '🎯',
    estrategia: '📋',
    tom_de_voz: '🎤',
    relatorio: '📊',
    diagnostico: '🔍',
  }
  return icons[category] || '📄'
}
