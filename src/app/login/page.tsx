'use client'

import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/portal'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
      callbackUrl,
    })

    setLoading(false)

    if (result?.error) {
      setError('E-mail ou senha incorretos. Verifique seus dados.')
      return
    }

    // Check role to redirect properly
    if (email === (process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@gow.agency')) {
      router.push('/admin')
    } else {
      router.push(callbackUrl)
    }
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col">
      {/* Header */}
      <header className="border-b border-dark-800 px-6 py-4">
        <div className="max-w-sm mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gold-500 rounded-lg flex items-center justify-center">
              <span className="text-dark-950 font-bold text-sm">G</span>
            </div>
            <span className="font-semibold text-dark-100">Gow Agency</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Acessar seu portal</h1>
            <p className="text-dark-400 text-sm">
              Entre com seus dados para acessar o portal exclusivo de cliente.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">E-mail</label>
              <input
                type="email"
                className="input"
                placeholder="seu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div>
              <label className="label">Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input pr-11"
                  placeholder="Sua senha"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-800/50 rounded-lg px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3.5 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="animate-spin w-4 h-4 border-2 border-dark-950 border-t-transparent rounded-full" />
                  Entrando...
                </>
              ) : (
                <>
                  Acessar portal
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo hint */}
          <div className="mt-8 p-4 bg-dark-900 border border-dark-700 rounded-xl">
            <p className="text-dark-400 text-xs font-medium mb-3">Contas de demonstração:</p>
            <div className="space-y-2 text-xs text-dark-500">
              <div className="flex justify-between">
                <span>👤 Cliente:</span>
                <span className="font-mono">junior@example.com / cliente123</span>
              </div>
              <div className="flex justify-between">
                <span>⚙️ Admin:</span>
                <span className="font-mono">admin@gow.agency / admin123</span>
              </div>
            </div>
          </div>

          <p className="text-center text-dark-500 text-sm mt-6">
            Novo cliente?{' '}
            <Link href="/diagnostico" className="text-gold-500 hover:text-gold-400 transition-colors">
              Faça seu diagnóstico gratuito
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
