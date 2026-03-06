import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { getClientById } from '@/lib/mock-data'
import { PortalSidebar } from '@/components/PortalSidebar'
import { MobilePortalHeader } from '@/components/MobilePortalHeader'

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login?callbackUrl=/portal')
  }

  const user = session.user as { role: string; clientId?: string; name?: string; email?: string }

  if (user.role === 'admin') {
    redirect('/admin')
  }

  const client = user.clientId ? getClientById(user.clientId) : null

  if (!client) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-dark-950 flex">
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <PortalSidebar
          clientName={client.name}
          clientCompany={client.company}
          clientAvatar={client.avatar}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <MobilePortalHeader
          clientName={client.name}
          clientCompany={client.company}
          clientAvatar={client.avatar}
        />

        <main className="flex-1 p-6 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
