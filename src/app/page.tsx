import Link from 'next/link'
import { ArrowRight, CheckCircle, BarChart3, FileText, Calendar, MessageSquare, Zap } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <header className="border-b border-dark-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gold-500 rounded-lg flex items-center justify-center">
              <span className="text-dark-950 font-bold text-sm">G</span>
            </div>
            <span className="font-semibold text-dark-100">Gow Agency</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-dark-300 hover:text-gold-500 transition-colors text-sm">
              Acessar Portal
            </Link>
            <Link href="/diagnostico" className="btn-primary text-sm py-2 px-4">
              Fazer Diagnóstico
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 py-24 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-gold-500/10 border border-gold-500/30 text-gold-400 text-sm px-4 py-2 rounded-full mb-8">
          <Zap className="w-4 h-4" />
          Diagnóstico gratuito de autoridade digital
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Transformamos sua
          <br />
          <span className="text-gold-500">presença digital</span>
          <br />
          em autoridade real.
        </h1>
        <p className="text-dark-300 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Não basta estar nas redes sociais. O mercado paga mais por quem é reconhecido como referência.
          A Gow Agency constrói esse posicionamento com estratégia e consistência.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/diagnostico" className="btn-primary text-lg py-4 px-8">
            Fazer meu diagnóstico grátis
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/login" className="btn-secondary text-lg py-4 px-8">
            Já sou cliente
          </Link>
        </div>
        <p className="text-dark-500 text-sm mt-6">
          Leva menos de 5 minutos · Resultado personalizado · Sem compromisso
        </p>
      </section>

      {/* Social proof strip */}
      <section className="border-y border-dark-800 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-dark-500 text-sm mb-6">Clientes que construíram autoridade com a Gow Agency</p>
          <div className="flex flex-wrap justify-center gap-8 text-dark-400">
            {['Junior Lopes Consultoria', 'Aliny Rayze Coaching', 'Dr. Marcus Vinícius', 'Studio Ferraris', 'Grupo Nexus'].map((name) => (
              <span key={name} className="font-medium">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Problems */}
      <section className="px-6 py-24 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Você se identifica com algum destes cenários?
          </h2>
          <p className="text-dark-400 text-lg">
            São os sinais mais comuns de autoridade invisível no mercado.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              emoji: '😤',
              title: 'Você é bom no que faz, mas o mercado não sabe',
              desc: 'Seus concorrentes cobram mais e fecham mais, mesmo entregando menos.',
            },
            {
              emoji: '📱',
              title: 'Posta de vez em quando, sem estratégia',
              desc: 'O conteúdo não tem direção, não atrai o público certo e não gera negócios.',
            },
            {
              emoji: '💸',
              title: 'Não consegue cobrar o que vale',
              desc: 'Sente que precisa justificar o preço o tempo todo, e ainda assim perde para quem cobra menos.',
            },
            {
              emoji: '🔄',
              title: 'Depende de indicação para fechar clientes',
              desc: 'Não tem um sistema de atração de leads que funcione de forma previsível.',
            },
            {
              emoji: '⏰',
              title: 'Não tem tempo para criar conteúdo',
              desc: 'Sabe que precisa estar presente, mas o dia a dia consome tudo.',
            },
            {
              emoji: '❓',
              title: 'Não sabe por onde começar',
              desc: 'Já tentou de tudo: cursos, templates, dicas — mas nada gerou resultado real.',
            },
          ].map((problem) => (
            <div key={problem.title} className="card hover:border-dark-700 transition-colors">
              <span className="text-3xl block mb-4">{problem.emoji}</span>
              <h3 className="font-semibold text-white mb-2">{problem.title}</h3>
              <p className="text-dark-400 text-sm leading-relaxed">{problem.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Solution */}
      <section className="px-6 py-24 bg-dark-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Como a Gow Agency constrói sua autoridade
            </h2>
            <p className="text-dark-400 text-lg max-w-2xl mx-auto">
              Um sistema completo — do posicionamento à publicação — com acompanhamento em tempo real.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: <BarChart3 className="w-6 h-6 text-gold-500" />,
                step: '01',
                title: 'Diagnóstico Estratégico',
                desc: 'Mapeamos sua autoridade atual, seu mercado e as maiores oportunidades de posicionamento específicas para você.',
              },
              {
                icon: <FileText className="w-6 h-6 text-gold-500" />,
                step: '02',
                title: 'Documento de Posicionamento',
                desc: 'Definimos quem você é, para quem você fala, qual é sua mensagem central e como se diferencia da concorrência.',
              },
              {
                icon: <Calendar className="w-6 h-6 text-gold-500" />,
                step: '03',
                title: 'Estratégia e Calendário Editorial',
                desc: 'Criamos conteúdo que posiciona, educa e converte — com planejamento mensal completo e execução consistente.',
              },
              {
                icon: <MessageSquare className="w-6 h-6 text-gold-500" />,
                step: '04',
                title: 'Portal de Acompanhamento',
                desc: 'Você aprova cada conteúdo, acompanha resultados e recebe insights diários — tudo em um portal exclusivo.',
              },
            ].map((step) => (
              <div key={step.step} className="card flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-dark-800 rounded-xl flex items-center justify-center">
                    {step.icon}
                  </div>
                </div>
                <div>
                  <span className="text-gold-500 text-xs font-mono font-medium">PASSO {step.step}</span>
                  <h3 className="font-semibold text-white text-lg mt-1 mb-2">{step.title}</h3>
                  <p className="text-dark-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portal preview */}
      <section className="px-6 py-24 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Seu portal exclusivo de cliente
          </h2>
          <p className="text-dark-400 text-lg">
            Transparência total sobre o que está sendo feito para construir sua autoridade.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: '📊', title: 'Dashboard', desc: 'Visão geral do seu projeto em tempo real' },
            { icon: '📅', title: 'Calendário Editorial', desc: 'Todo o conteúdo planejado, organizado por data' },
            { icon: '✅', title: 'Aprovação de Conteúdo', desc: 'Aprove ou sugira ajustes antes da publicação' },
            { icon: '📁', title: 'Vault de Documentos', desc: 'Acesse sua estratégia e documentos a qualquer hora' },
          ].map((feature) => (
            <div key={feature.title} className="card text-center hover:border-gold-500/30 transition-colors">
              <span className="text-4xl block mb-4">{feature.icon}</span>
              <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-dark-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Final */}
      <section className="px-6 py-24 bg-gradient-to-br from-gold-900/20 to-dark-950">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Descubra seu nível de autoridade digital agora
          </h2>
          <p className="text-dark-300 text-lg mb-10">
            Responda 8 perguntas e receba um diagnóstico personalizado com as principais oportunidades para o seu perfil.
          </p>
          <Link href="/diagnostico" className="btn-primary text-lg py-4 px-10">
            Quero meu diagnóstico gratuito
            <ArrowRight className="w-5 h-5" />
          </Link>
          <div className="flex justify-center gap-8 mt-12 text-dark-500 text-sm">
            {['✓ 100% gratuito', '✓ Resultado na hora', '✓ Sem spam'].map(item => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dark-800 px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-dark-500 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gold-500 rounded flex items-center justify-center">
              <span className="text-dark-950 font-bold text-xs">G</span>
            </div>
            <span>© 2026 Gow Agency. Todos os direitos reservados.</span>
          </div>
          <div className="flex gap-6">
            <Link href="/login" className="hover:text-gold-500 transition-colors">Portal do Cliente</Link>
            <Link href="/diagnostico" className="hover:text-gold-500 transition-colors">Diagnóstico</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
