export type ContentStatus = 'rascunho' | 'em_aprovacao' | 'aprovado' | 'publicado'
export type ContentType = 'post' | 'reels' | 'stories' | 'carrossel' | 'artigo'

export interface Post {
  id: string
  clientId: string
  title: string
  caption: string
  type: ContentType
  platform: string[]
  status: ContentStatus
  scheduledDate: string
  createdAt: string
  updatedAt: string
  thumbnailColor: string
  comment?: string
}

export interface Document {
  id: string
  clientId: string
  name: string
  category: 'posicionamento' | 'estrategia' | 'tom_de_voz' | 'relatorio' | 'diagnostico'
  url: string
  size: string
  createdAt: string
}

export interface Insight {
  id: string
  clientId: string
  title: string
  content: string
  category: string
  publishedAt: string
  isRead: boolean
}

export interface Client {
  id: string
  name: string
  email: string
  password: string
  company: string
  niche: string
  phase: string
  startDate: string
  avatar: string
}

export const clients: Client[] = [
  {
    id: 'client-1',
    name: 'Junior Lopes',
    email: 'junior@example.com',
    password: 'cliente123',
    company: 'Junior Lopes Consultoria',
    niche: 'Consultoria Empresarial',
    phase: 'Fase 2 — Construção de Autoridade',
    startDate: '2026-01-15',
    avatar: 'JL',
  },
  {
    id: 'client-2',
    name: 'Aliny Rayze',
    email: 'aliny@example.com',
    password: 'cliente123',
    company: 'Aliny Rayze Coaching',
    niche: 'Coaching & Desenvolvimento Pessoal',
    phase: 'Fase 1 — Posicionamento',
    startDate: '2026-02-01',
    avatar: 'AR',
  },
]

export const posts: Post[] = [
  {
    id: 'post-1',
    clientId: 'client-1',
    title: 'Os 3 erros que destroem a autoridade de um consultor',
    caption: 'Após trabalhar com mais de 50 empresas, identifiquei os 3 principais erros que impedem consultores de serem vistos como autoridade no mercado. O primeiro é...',
    type: 'carrossel',
    platform: ['Instagram', 'LinkedIn'],
    status: 'em_aprovacao',
    scheduledDate: '2026-03-10',
    createdAt: '2026-03-06',
    updatedAt: '2026-03-06',
    thumbnailColor: '#C9A84C',
  },
  {
    id: 'post-2',
    clientId: 'client-1',
    title: 'Como cobrar o que você vale (sem culpa)',
    caption: 'A maioria dos consultores subestima seu valor. Isso não é humildade, é sabotagem. Neste post vou te mostrar como precificar com autoridade e confiança...',
    type: 'reels',
    platform: ['Instagram'],
    status: 'aprovado',
    scheduledDate: '2026-03-12',
    createdAt: '2026-03-04',
    updatedAt: '2026-03-05',
    thumbnailColor: '#7C3AED',
  },
  {
    id: 'post-3',
    clientId: 'client-1',
    title: 'Bastidores: como preparo minha semana de conteúdo',
    caption: 'Muita gente me pergunta como eu consigo criar conteúdo consistente enquanto atendo clientes. A resposta é simples: processo...',
    type: 'stories',
    platform: ['Instagram'],
    status: 'rascunho',
    scheduledDate: '2026-03-15',
    createdAt: '2026-03-06',
    updatedAt: '2026-03-06',
    thumbnailColor: '#059669',
  },
  {
    id: 'post-4',
    clientId: 'client-1',
    title: 'Por que empresas preferem pagar mais por consultores com autoridade',
    caption: 'Existe uma lei não escrita no mercado corporativo: empresas pagam um prêmio por quem tem reputação. Aqui está o porquê e como construir a sua...',
    type: 'artigo',
    platform: ['LinkedIn'],
    status: 'publicado',
    scheduledDate: '2026-03-05',
    createdAt: '2026-03-01',
    updatedAt: '2026-03-05',
    thumbnailColor: '#2563EB',
  },
  {
    id: 'post-5',
    clientId: 'client-1',
    title: 'O framework que uso para criar conteúdo que gera leads',
    caption: 'Depois de testar dezenas de formatos, cheguei ao framework que funciona: PROBLEMA + AGITAÇÃO + SOLUÇÃO + CTA. Mas tem um segredo que a maioria ignora...',
    type: 'post',
    platform: ['Instagram', 'LinkedIn'],
    status: 'em_aprovacao',
    scheduledDate: '2026-03-18',
    createdAt: '2026-03-06',
    updatedAt: '2026-03-06',
    thumbnailColor: '#DC2626',
  },
  {
    id: 'post-6',
    clientId: 'client-2',
    title: 'Como sair do piloto automático e criar a vida que você quer',
    caption: '95% das nossas decisões são tomadas de forma inconsciente. Se você sente que está vivendo no modo automático, este post é para você...',
    type: 'carrossel',
    platform: ['Instagram'],
    status: 'em_aprovacao',
    scheduledDate: '2026-03-11',
    createdAt: '2026-03-05',
    updatedAt: '2026-03-06',
    thumbnailColor: '#C9A84C',
  },
  {
    id: 'post-7',
    clientId: 'client-2',
    title: 'Os 5 bloqueios que impedem seu crescimento (e como superá-los)',
    caption: 'Depois de acompanhar mais de 200 clientes no processo de transformação, percebi que existem 5 bloqueios universais...',
    type: 'reels',
    platform: ['Instagram', 'TikTok'],
    status: 'rascunho',
    scheduledDate: '2026-03-14',
    createdAt: '2026-03-06',
    updatedAt: '2026-03-06',
    thumbnailColor: '#DB2777',
  },
]

export const documents: Document[] = [
  {
    id: 'doc-1',
    clientId: 'client-1',
    name: 'Diagnóstico Inicial — Junior Lopes',
    category: 'diagnostico',
    url: '#',
    size: '2.3 MB',
    createdAt: '2026-01-16',
  },
  {
    id: 'doc-2',
    clientId: 'client-1',
    name: 'Documento de Posicionamento',
    category: 'posicionamento',
    url: '#',
    size: '1.8 MB',
    createdAt: '2026-01-20',
  },
  {
    id: 'doc-3',
    clientId: 'client-1',
    name: 'Estratégia de Conteúdo Q1 2026',
    category: 'estrategia',
    url: '#',
    size: '3.1 MB',
    createdAt: '2026-01-25',
  },
  {
    id: 'doc-4',
    clientId: 'client-1',
    name: 'Guia de Tom de Voz',
    category: 'tom_de_voz',
    url: '#',
    size: '0.9 MB',
    createdAt: '2026-01-28',
  },
  {
    id: 'doc-5',
    clientId: 'client-1',
    name: 'Relatório de Resultados — Fevereiro 2026',
    category: 'relatorio',
    url: '#',
    size: '1.4 MB',
    createdAt: '2026-03-01',
  },
  {
    id: 'doc-6',
    clientId: 'client-2',
    name: 'Diagnóstico Inicial — Aliny Rayze',
    category: 'diagnostico',
    url: '#',
    size: '2.1 MB',
    createdAt: '2026-02-02',
  },
  {
    id: 'doc-7',
    clientId: 'client-2',
    name: 'Documento de Posicionamento',
    category: 'posicionamento',
    url: '#',
    size: '2.0 MB',
    createdAt: '2026-02-10',
  },
]

export const insights: Insight[] = [
  {
    id: 'insight-1',
    clientId: 'client-1',
    title: 'Por que consistência supera genialidade no digital',
    content: 'No LinkedIn, perfis que publicam 3x por semana crescem em média 5x mais rápido do que os que publicam 1x. A percepção de autoridade é construída pela frequência, não pela perfeição. Sua próxima publicação não precisa ser obra-prima — precisa existir.',
    category: 'Estratégia de Conteúdo',
    publishedAt: '2026-03-06T08:00:00',
    isRead: false,
  },
  {
    id: 'insight-2',
    clientId: 'client-1',
    title: 'O formato que mais gera leads orgânicos em 2026',
    content: 'Carrosseis de "antes e depois" com dados reais têm taxa de salvamento 3x maior que posts comuns. Para consultores, mostrar a transformação do cliente (com permissão) é o conteúdo com maior ROI no momento.',
    category: 'Formato de Conteúdo',
    publishedAt: '2026-03-05T08:00:00',
    isRead: true,
  },
  {
    id: 'insight-3',
    clientId: 'client-1',
    title: 'Como transformar uma objeção em conteúdo de alta conversão',
    content: 'Toda objeção que você ouve de clientes é um post em potencial. "É caro demais" vira "Por que investir em consultoria estratégica custa menos do que não contratar". Anote as 5 principais objeções que você ouve esta semana.',
    category: 'Geração de Leads',
    publishedAt: '2026-03-04T08:00:00',
    isRead: true,
  },
  {
    id: 'insight-4',
    clientId: 'client-2',
    title: 'A regra dos 1.000 fãs verdadeiros',
    content: 'Kevin Kelly propôs que você não precisa de milhões de seguidores para ter um negócio sustentável. Precisa de 1.000 pessoas que realmente se conectam com sua mensagem. Foque em profundidade antes de escala.',
    category: 'Estratégia de Negócio',
    publishedAt: '2026-03-06T08:00:00',
    isRead: false,
  },
  {
    id: 'insight-5',
    clientId: 'client-2',
    title: 'Por que histórias convertem mais que argumentos',
    content: 'O cérebro humano é 22x mais propenso a lembrar de uma história do que de um fato isolado. Para coaches, narrar a jornada de transformação de um cliente (de forma ética) é a estratégia de conteúdo mais poderosa disponível.',
    category: 'Copywriting',
    publishedAt: '2026-03-05T08:00:00',
    isRead: true,
  },
]

export function getClientById(id: string): Client | undefined {
  return clients.find(c => c.id === id)
}

export function getClientByEmail(email: string): Client | undefined {
  return clients.find(c => c.email === email)
}

export function getPostsByClient(clientId: string): Post[] {
  return posts.filter(p => p.clientId === clientId)
}

export function getDocumentsByClient(clientId: string): Document[] {
  return documents.filter(d => d.clientId === clientId)
}

export function getInsightsByClient(clientId: string): Insight[] {
  return insights.filter(i => i.clientId === clientId)
}

export function getPostStats(clientId: string) {
  const clientPosts = getPostsByClient(clientId)
  return {
    total: clientPosts.length,
    rascunho: clientPosts.filter(p => p.status === 'rascunho').length,
    em_aprovacao: clientPosts.filter(p => p.status === 'em_aprovacao').length,
    aprovado: clientPosts.filter(p => p.status === 'aprovado').length,
    publicado: clientPosts.filter(p => p.status === 'publicado').length,
  }
}
