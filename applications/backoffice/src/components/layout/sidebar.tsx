'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Megaphone, Settings, Users } from 'lucide-react'

import { cn } from '@/lib/utils/cn'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/crm', label: 'CRM', icon: Users },
  { href: '/campaigns', label: 'Campaigns', icon: Megaphone },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="border-border bg-card flex h-screen w-60 flex-col border-r">
      <div className="border-border flex h-14 items-center gap-2 border-b px-4">
        <div className="bg-gold h-7 w-7 rounded-md" />
        <span className="text-sm font-semibold tracking-tight">Anaqio Backoffice</span>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground',
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-border border-t p-3">
        <div className="flex items-center gap-2 rounded-md px-3 py-2">
          <div className="bg-muted h-6 w-6 rounded-full" />
          <span className="text-muted-foreground text-xs">Admin</span>
        </div>
      </div>
    </aside>
  )
}
