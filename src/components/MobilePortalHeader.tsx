'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { PortalSidebar } from './PortalSidebar'

interface Props {
  clientName: string
  clientCompany: string
  clientAvatar: string
}

export function MobilePortalHeader({ clientName, clientCompany, clientAvatar }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <header className="md:hidden border-b border-dark-800 px-4 py-3 flex items-center justify-between bg-dark-900">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gold-500 rounded-lg flex items-center justify-center">
            <span className="text-dark-950 font-bold text-xs">G</span>
          </div>
          <span className="text-dark-200 font-semibold text-sm">Gow Agency</span>
        </Link>
        <button
          onClick={() => setOpen(true)}
          className="text-dark-400 hover:text-dark-100 p-1 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {/* Drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="relative z-10 flex">
            <PortalSidebar
              clientName={clientName}
              clientCompany={clientCompany}
              clientAvatar={clientAvatar}
              onClose={() => setOpen(false)}
            />
          </div>
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 z-20 text-dark-300 bg-dark-800 rounded-lg p-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </>
  )
}
