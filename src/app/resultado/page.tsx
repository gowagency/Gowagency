'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react'

type Profile = 'invisivel' | 'construcao' | 'consolidada'

const profiles = {
  invisivel: {
    tag: 'Autoridade Invisível',
    tagColor: 'bg-red-900/30 text-red-400 border border-red-800/50',
    emoji: '🔍',
    headline: 'Você tem potencial real — o mercado simplesmente ainda não sabe disso.',
    description:
      'Sua experiência e conhecimento são sólidos, mas sua presença digital não reflete isso. O resultado: clientes em potencial passam por você sem te reconhecer como opção. Isso é corrigível e é exatamente o que a Gow Agency faz.',
    insights: [
      'Seu maior ativo agora é construir uma base: perfil otimizado, posicionamento claro e conteúdo estratégico.',
      'Profissionais no seu perfil que investem em autoridade digital nos primeiros 90 dias veem um aumento médio de 40% nas indicações recebidas.',
      'O primeiro passo é definir com clareza quem você atende e qual problema único você resolve.',
    ],
    opportunity: 'Alta',
    opportunityColor: 'text-emerald-400',
    cta: 'Construir minha autoridade do zero',
    ctaDesc: 'Vamos montar juntos o posicionamento que vai fazer o mercado te enxergar.',
  },
  construcao: {
    tag: 'Autoridade em Construção',
    tagColor: 'bg-amber-900/30 text-amber-400 border border-amber-800/50',
    emoji: '📈',
    headline: 'Você já está no caminho — falta estratégia para acelerar.',
    description:
      'Você já tem presença digital e alguma consistência, mas o crescimento está travado. Provavelmente por falta de posicionamento claro, conteúdo que não converte ou ausência de um sistema de atração de leads.',
    insights: [
      'No seu perfil, o maior gargalo costuma ser a ausência de um Documento de Posicionamento claro — a âncora de todo o conteúdo.',
      'Quem tem estratégia definida publica com 3x mais consistência e gera 5x mais engajamento qualificado.',
      'Você está a 60 a 90 dias de atingir o ponto de inflexão onde o conteúdo começa a trabalhar sozinho.',
    ],
    opportunity: 'Muito alta',
    opportunityColor: 'text-gold-500',
    cta: 'Acelerar minha autoridade',
    ctaDesc: 'Você já deu os primeiros passos. Agora é hora de escalar.',
  },
  consolidada: {
    tag: 'Autoridade Consolidada',
    tagColor: 'bg-blue-900/30 text-blue-400 border border-blue-800/50',
    emoji: '🏆',
    headline: 'Você já tem autoridade — a pergunta é: está monetizando ao máximo?',
    description:
      'Sua presença digital é real e reconhecida. O desafio agora é transformar essa autoridade em escala: mais leads qualificados, melhores clientes e maior previsibilidade de receita sem aumentar o esforço.',
    insights: [
      'Profissionais no seu estágio geralmente têm o maior ROI ao investir em LinkedIn Premium, conteúdo de autoridade longa (artigos) e palestras posicionadoras.',
      'A alavanca mais poderosa agora é um sistema de captura de leads diretamente pelo conteúdo — sem depender de indicações.',
      'Você tem o ativo mais valioso: credibilidade. O próximo passo é monetizá-la de forma sistemática.',
    ],
    opportunity: 'Escala imediata',
    opportunityColor: 'text-blue-400',
    cta: 'Escalar minha autoridade',
    ctaDesc: 'Vamos transformar sua autoridade existente em crescimento previsível.',
  },
}

const areaLabels: Record<string, string> = {
  consultoria: 'Consultoria Empresarial',
  coaching: 'Coaching & Mentoria',
  saude: 'Saúde & Bem-estar',
  juridico: 'Jurídico & Advocacia',
  educacao: 'Educação & Treinamento',
  outro: 'Sua área',
}

const objetivoLabels: Record<string, string> = {
  reconhecimento: 'ser reconhecido como referência',
  leads: 'atrair clientes qualificados',
  preco: 'cobrar mais pelo seu trabalho',
  escala: 'escalar o negócio',
}

function ResultadoContent() {
  const params = useSearchParams()
  const profile = (params.get('profile') || 'construcao') as Profile
  const nome = params.get('nome') || 'Profissional'
  const area = areaLabels[params.get('area') || ''] || 'sua área'
  const objetivo = objetivoLabels[params.get('objetivo') || ''] || 'crescer'

  const data = profiles[profile]

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <header className="border-b border-dark-800 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gold-500 rounded flex items-center justify-center">
              <span className="text-dark-950 font-bold text-xs">G</span>
            </div>
            <span className="text-dark-300 text-sm">Gow Agency — Diagnóstico</span>
          </div>
        </div>
      </header>

      <main className="px-6 py-16 max-w-3xl mx-auto">
        {/* Result header */}
        <div className="text-center mb-12">
          <span className="text-5xl block mb-6">{data.emoji}</span>
          <div className="inline-flex items-center gap-2 mb-4">
            <span className={`badge ${data.tagColor} text-sm`}>{data.tag}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
            {nome}, {data.headline}
          </h1>
          <p className="text-dark-400 text-lg leading-relaxed max-w-2xl mx-auto">
            {data.description}
          </p>
        </div>

        {/* Opportunity */}
        <div className="card mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-dark-800 rounded-xl flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-gold-500" />
            </div>
            <div>
              <p className="text-dark-400 text-sm">Oportunidade de crescimento para profissionais de {area} com o objetivo de {objetivo}:</p>
              <p className={`text-2xl font-bold mt-1 ${data.opportunityColor}`}>{data.opportunity}</p>
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="card mb-8">
          <h2 className="font-semibold text-white mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-gold-500" />
            O que o seu perfil nos diz
          </h2>
          <div className="space-y-5">
            {data.insights.map((insight, i) => (
              <div key={i} className="flex gap-4">
                <CheckCircle className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                <p className="text-dark-300 leading-relaxed">{insight}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Next steps */}
        <div className="bg-gradient-to-br from-gold-900/20 to-dark-900 border border-gold-800/30 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">{data.cta}</h2>
          <p className="text-dark-400 mb-8">{data.ctaDesc}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/5511999999999?text=Ol%C3%A1%2C%20acabei%20de%20fazer%20o%20diagn%C3%B3stico%20da%20Gow%20Agency%20e%20quero%20saber%20mais."
              className="btn-primary py-4 px-8 text-base"
              target="_blank"
              rel="noopener noreferrer"
            >
              Falar com a equipe
              <ArrowRight className="w-5 h-5" />
            </a>
            <Link href="/" className="btn-secondary py-4 px-8 text-base">
              Conhecer a Gow Agency
            </Link>
          </div>
          <p className="text-dark-500 text-sm mt-6">
            Diagnóstico enviado para seu e-mail · Resultado salvo
          </p>
        </div>

        {/* Redo */}
        <div className="text-center mt-8">
          <Link href="/diagnostico" className="text-dark-500 hover:text-dark-300 text-sm transition-colors">
            Refazer o diagnóstico
          </Link>
        </div>
      </main>
    </div>
  )
}

export default function ResultadoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full" />
      </div>
    }>
      <ResultadoContent />
    </Suspense>
  )
}
