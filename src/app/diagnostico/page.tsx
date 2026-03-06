'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react'

interface Answer {
  area?: string
  tempo?: string
  presenca?: string
  frequencia?: string
  desafio?: string
  objetivo?: string
  nome: string
  email: string
  whatsapp: string
}

const steps = [
  {
    id: 'area',
    title: 'Qual é a sua área de atuação?',
    subtitle: 'Escolha a que melhor descreve o seu trabalho.',
    type: 'single',
    field: 'area' as keyof Answer,
    options: [
      { value: 'consultoria', label: 'Consultoria Empresarial' },
      { value: 'coaching', label: 'Coaching & Mentoria' },
      { value: 'saude', label: 'Saúde & Bem-estar' },
      { value: 'juridico', label: 'Jurídico & Advocacia' },
      { value: 'educacao', label: 'Educação & Treinamento' },
      { value: 'outro', label: 'Outra área' },
    ],
  },
  {
    id: 'tempo',
    title: 'Há quanto tempo você atua no mercado?',
    subtitle: 'Considere toda a sua experiência na área.',
    type: 'single',
    field: 'tempo' as keyof Answer,
    options: [
      { value: 'menos1', label: 'Menos de 1 ano' },
      { value: '1a3', label: 'Entre 1 e 3 anos' },
      { value: '3a7', label: 'Entre 3 e 7 anos' },
      { value: 'mais7', label: 'Mais de 7 anos' },
    ],
  },
  {
    id: 'presenca',
    title: 'Como você descreveria sua presença digital hoje?',
    subtitle: 'Seja honesto — esse é o ponto de partida.',
    type: 'single',
    field: 'presenca' as keyof Answer,
    options: [
      { value: 'inexistente', label: 'Quase inexistente — posts esporádicos' },
      { value: 'basica', label: 'Básica — publico, mas sem estratégia' },
      { value: 'regular', label: 'Regular — tenho consistência, mas sem resultado' },
      { value: 'ativa', label: 'Ativa — já tenho audiência, quero escalar' },
    ],
  },
  {
    id: 'desafio',
    title: 'Qual é o seu maior desafio hoje?',
    subtitle: 'Escolha o que mais trava seu crescimento.',
    type: 'single',
    field: 'desafio' as keyof Answer,
    options: [
      { value: 'visibilidade', label: 'Visibilidade — o mercado não me conhece' },
      { value: 'posicionamento', label: 'Posicionamento — não sei como me diferenciar' },
      { value: 'consistencia', label: 'Consistência — começo e não consigo manter' },
      { value: 'conversao', label: 'Conversão — tenho audiência mas não vendo' },
    ],
  },
  {
    id: 'objetivo',
    title: 'O que você quer alcançar nos próximos 6 meses?',
    subtitle: 'Pense no impacto que a autoridade digital pode gerar.',
    type: 'single',
    field: 'objetivo' as keyof Answer,
    options: [
      { value: 'reconhecimento', label: 'Ser reconhecido como referência na minha área' },
      { value: 'leads', label: 'Atrair clientes qualificados de forma consistente' },
      { value: 'preco', label: 'Cobrar mais e encontrar clientes dispostos a pagar' },
      { value: 'escala', label: 'Escalar o negócio sem depender só de indicações' },
    ],
  },
  {
    id: 'contato',
    title: 'Onde enviamos seu diagnóstico?',
    subtitle: 'Seus dados são confidenciais. Zero spam.',
    type: 'form',
  },
]

function calculateProfile(answers: Answer): 'invisivel' | 'construcao' | 'consolidada' {
  let score = 0

  if (answers.tempo === '3a7') score += 1
  if (answers.tempo === 'mais7') score += 2

  if (answers.presenca === 'basica') score += 1
  if (answers.presenca === 'regular') score += 2
  if (answers.presenca === 'ativa') score += 3

  if (score <= 1) return 'invisivel'
  if (score <= 3) return 'construcao'
  return 'consolidada'
}

export default function DiagnosticoPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Answer>({ nome: '', email: '', whatsapp: '' })
  const [formData, setFormData] = useState({ nome: '', email: '', whatsapp: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const step = steps[currentStep]
  const progress = ((currentStep) / (steps.length - 1)) * 100

  function handleOption(field: keyof Answer, value: string) {
    setAnswers(prev => ({ ...prev, [field]: value }))
    setTimeout(() => setCurrentStep(prev => prev + 1), 300)
  }

  function handleBack() {
    if (currentStep > 0) setCurrentStep(prev => prev - 1)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.nome || !formData.email || !formData.whatsapp) {
      setError('Preencha todos os campos para receber seu diagnóstico.')
      return
    }
    setLoading(true)
    const finalAnswers = { ...answers, ...formData }
    const profile = calculateProfile(finalAnswers)
    // Simulate API call
    await new Promise(r => setTimeout(r, 1200))
    const params = new URLSearchParams({
      profile,
      nome: formData.nome,
      area: answers.area || '',
      objetivo: answers.objetivo || '',
    })
    router.push(`/resultado?${params.toString()}`)
  }

  const selectedValue = step.type === 'single' ? answers[step.field!] : null

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col">
      {/* Header */}
      <header className="border-b border-dark-800 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-dark-400 hover:text-gold-500 transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gold-500 rounded flex items-center justify-center">
              <span className="text-dark-950 font-bold text-xs">G</span>
            </div>
            <span className="text-dark-300 text-sm">Diagnóstico de Autoridade</span>
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="w-full h-1 bg-dark-800">
        <div
          className="h-full bg-gold-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl">
          {/* Step counter */}
          <p className="text-gold-500 text-sm font-mono font-medium mb-6">
            {currentStep + 1} / {steps.length}
          </p>

          {/* Question */}
          <h1 className="text-3xl font-bold text-white mb-3">{step.title}</h1>
          <p className="text-dark-400 mb-10">{step.subtitle}</p>

          {/* Options */}
          {step.type === 'single' && (
            <div className="space-y-3">
              {step.options?.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleOption(step.field!, option.value)}
                  className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-200 flex items-center justify-between group ${
                    selectedValue === option.value
                      ? 'border-gold-500 bg-gold-500/10 text-white'
                      : 'border-dark-700 bg-dark-900 text-dark-200 hover:border-gold-500/50 hover:bg-dark-800'
                  }`}
                >
                  <span className="font-medium">{option.label}</span>
                  {selectedValue === option.value ? (
                    <CheckCircle className="w-5 h-5 text-gold-500 flex-shrink-0" />
                  ) : (
                    <ArrowRight className="w-4 h-4 text-dark-600 group-hover:text-gold-500 flex-shrink-0 transition-colors" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Contact form */}
          {step.type === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Seu nome</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Como você se chama?"
                  value={formData.nome}
                  onChange={e => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                />
              </div>
              <div>
                <label className="label">E-mail profissional</label>
                <input
                  type="email"
                  className="input"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div>
                <label className="label">WhatsApp</label>
                <input
                  type="tel"
                  className="input"
                  placeholder="(11) 99999-9999"
                  value={formData.whatsapp}
                  onChange={e => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                />
              </div>
              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center text-base py-4 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="animate-spin w-4 h-4 border-2 border-dark-950 border-t-transparent rounded-full" />
                    Gerando seu diagnóstico...
                  </>
                ) : (
                  <>
                    Ver meu diagnóstico
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
              <p className="text-dark-500 text-xs text-center">
                🔒 Seus dados são protegidos. Não compartilhamos com terceiros.
              </p>
            </form>
          )}

          {/* Navigation */}
          {currentStep > 0 && step.type !== 'form' && (
            <button
              onClick={handleBack}
              className="mt-8 text-dark-500 hover:text-dark-300 text-sm flex items-center gap-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para a pergunta anterior
            </button>
          )}
        </div>
      </main>
    </div>
  )
}
