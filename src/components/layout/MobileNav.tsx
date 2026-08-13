'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Briefcase, Brain, FileText, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const MOBILE_NAV_ITEMS = [
  { label: 'Home', href: '/', icon: LayoutDashboard },
  { label: 'Apps', href: '/applications', icon: Briefcase },
  { label: 'DSA', href: '/dsa', icon: Brain },
  { label: 'Logs', href: '/logs', icon: FileText },
  { label: 'Settings', href: '/settings', icon: Settings },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0A0A0A] border-t border-neutral-800 z-40 flex items-center justify-around px-2">
      {MOBILE_NAV_ITEMS.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center justify-center gap-1 w-full h-full text-xs font-medium transition-colors',
              isActive ? 'text-emerald-400' : 'text-neutral-500 hover:text-neutral-300'
            )}
          >
            <Icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
