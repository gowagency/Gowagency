import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Gow Agency — Autoridade Digital',
  description: 'Portal de clientes e diagnóstico de autoridade digital da Gow Agency.',
  keywords: 'autoridade digital, posicionamento, conteúdo, agência',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-dark-950 text-dark-100 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
