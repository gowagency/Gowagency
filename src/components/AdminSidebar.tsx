'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { LayoutDashboard, Users, FileText, LogOut, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/clientes', label: 'Clientes', icon: Users },
  { href: '/admin/conteudo', label: 'Conteúdo', icon: FileText },
]

export function AdminSidebar() {
  const pathname = usePathname()

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <aside className="w-64 flex-shrink-0 bg-dark-900 border-r border-dark-800 flex flex-col min-h-screen">
      <div className="p-6 border-b border-dark-800">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gold-500 rounded-lg flex items-center justify-center">
            <span className="text-dark-950 font-bold text-sm">G</span>
          </div>
          <div>
            <span className="text-dark-100 font-semibold text-sm block leading-none">Gow Agency</span>
            <span className="text-gold-500 text-xs">Painel Admin</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group',
                active
                  ? 'bg-gold-500/15 text-gold-400 border border-gold-500/20'
                  : 'text-dark-400 hover:text-dark-100 hover:bg-dark-800'
              )}
            >
              <item.icon className={cn('w-4 h-4', active ? 'text-gold-500' : 'text-dark-500 group-hover:text-dark-300')} />
              {item.label}
              {active && <ChevronRight className="w-3 h-3 ml-auto text-gold-500" />}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-dark-800">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 bg-gold-500/20 border border-gold-500/30 rounded-full flex items-center justify-center">
            <span className="text-gold-400 text-xs font-bold">GA</span>
          </div>
          <div>
            <p className="text-dark-200 text-sm font-medium">Admin</p>
            <p className="text-dark-500 text-xs">Gow Agency</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-dark-500 hover:text-red-400 hover:bg-red-900/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </aside>
  )
}
