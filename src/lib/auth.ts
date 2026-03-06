import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { clients } from './mock-data'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@gow.agency'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || 'dev-secret-change-in-production',
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        // Admin login
        if (
          credentials.email === ADMIN_EMAIL &&
          credentials.password === ADMIN_PASSWORD
        ) {
          return {
            id: 'admin',
            email: ADMIN_EMAIL,
            name: 'Admin — Gow Agency',
            role: 'admin',
          }
        }

        // Client login
        const client = clients.find(c => c.email === credentials.email)
        if (client && client.password === credentials.password) {
          return {
            id: client.id,
            email: client.email,
            name: client.name,
            role: 'client',
            clientId: client.id,
          }
        }

        return null
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as unknown as { role: string; clientId?: string }
        token.role = u.role
        token.clientId = u.clientId
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role: string }).role = token.role as string
        ;(session.user as { clientId?: string }).clientId = token.clientId as string | undefined
        ;(session.user as { id: string }).id = token.sub as string
      }
      return session
    },
  },
}
