'use client'

import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

export function StudioHeader() {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    <header className="border-border/40 flex items-center justify-between border-b px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="font-display text-lg font-bold tracking-tight">Anaqio</span>
        <span className="text-muted-foreground text-sm">Studio</span>
      </div>
      <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
        <LogOut className="h-4 w-4" />
        <span className="hidden sm:inline">Logout</span>
      </Button>
    </header>
  )
}
