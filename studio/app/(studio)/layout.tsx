import { redirect } from 'next/navigation'

import { StudioHeader } from '@/components/studio/StudioHeader'
import { createClient } from '@/lib/supabase/server'

export default async function StudioLayout({ children }: { children: React.ReactNode }) {
  const isKiosk = process.env.NEXT_PUBLIC_KIOSK_MODE === 'true'

  if (!isKiosk) {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) redirect('/auth/login')
  }

  return (
    <div className="flex min-h-screen flex-col">
      <StudioHeader />
      <main className="flex-1">{children}</main>
    </div>
  )
}
