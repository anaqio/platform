'use client'

import { useTransition } from 'react'
import { Loader2, Mail, MapPin, TrendingUp } from 'lucide-react'

import type { WaitlistStatus, WaitlistUser } from '@/types/database'
import { updateWaitlistStatus } from '@/lib/actions/waitlist'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { WaitlistStatusBadge } from '@/components/ui/status-badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface UserSheetProps {
  user: WaitlistUser | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const STATUS_TRANSITIONS: Record<WaitlistStatus, { next: WaitlistStatus; label: string }[]> = {
  pending: [
    { next: 'invited', label: 'Send Invite' },
    { next: 'unsubscribed', label: 'Unsubscribe' },
  ],
  invited: [
    { next: 'active', label: 'Mark Active' },
    { next: 'unsubscribed', label: 'Unsubscribe' },
  ],
  active: [{ next: 'unsubscribed', label: 'Unsubscribe' }],
  unsubscribed: [{ next: 'pending', label: 'Reactivate' }],
}

function fmtDate(dateStr: string | null) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function UserSheet({ user, open, onOpenChange }: UserSheetProps) {
  const [isPending, startTransition] = useTransition()

  if (!user) return null

  const transitions = STATUS_TRANSITIONS[user.status] ?? []

  function handleStatusUpdate(next: WaitlistStatus) {
    startTransition(async () => {
      await updateWaitlistStatus(user!.id, next)
      onOpenChange(false)
    })
  }

  const utmFields = [
    { label: 'Source', value: user.utm_source },
    { label: 'Medium', value: user.utm_medium },
    { label: 'Campaign', value: user.utm_campaign },
    { label: 'Content', value: user.utm_content },
    { label: 'Term', value: user.utm_term },
  ].filter((f) => f.value)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[440px] overflow-y-auto sm:max-w-[440px]">
        <SheetHeader className="mb-5">
          <SheetTitle>{user.full_name ?? user.email}</SheetTitle>
          <div className="flex flex-wrap items-center gap-2">
            <WaitlistStatusBadge status={user.status} />
            <Badge variant="outline" className="text-xs capitalize">
              {user.role}
            </Badge>
            <span className="text-muted-foreground flex items-center gap-1 text-xs">
              <TrendingUp className="h-3 w-3" />
              Score: {user.lead_score}
            </span>
          </div>
        </SheetHeader>

        <Tabs defaultValue="profile">
          <TabsList className="w-full">
            <TabsTrigger value="profile" className="flex-1">
              Profile
            </TabsTrigger>
            <TabsTrigger value="attribution" className="flex-1">
              Attribution
            </TabsTrigger>
            <TabsTrigger value="actions" className="flex-1">
              Actions
            </TabsTrigger>
          </TabsList>

          {/* ── Profile ── */}
          <TabsContent value="profile" className="mt-5 space-y-4">
            <dl className="space-y-3 text-sm">
              <DetailRow label="Email">
                <a
                  href={`mailto:${user.email}`}
                  className="text-primary flex items-center gap-1 hover:underline"
                >
                  <Mail className="h-3 w-3" />
                  {user.email}
                </a>
              </DetailRow>
              {user.company && <DetailRow label="Company">{user.company}</DetailRow>}
              {user.revenue_range && <DetailRow label="Revenue">{user.revenue_range}</DetailRow>}
              {(user.city || user.country) && (
                <DetailRow label="Location">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {[user.city, user.country].filter(Boolean).join(', ')}
                  </span>
                </DetailRow>
              )}
            </dl>

            <Separator />

            <dl className="space-y-3 text-sm">
              <DetailRow label="Status">
                <WaitlistStatusBadge status={user.status} />
              </DetailRow>
              <DetailRow label="Source">{user.source.replace(/-/g, ' ')}</DetailRow>
              <DetailRow label="Signed Up">{fmtDate(user.created_at)}</DetailRow>
              {user.invited_at && <DetailRow label="Invited">{fmtDate(user.invited_at)}</DetailRow>}
            </dl>

            {user.notes && (
              <>
                <Separator />
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs font-medium">Notes</p>
                  <p className="text-sm">{user.notes}</p>
                </div>
              </>
            )}
          </TabsContent>

          {/* ── Attribution ── */}
          <TabsContent value="attribution" className="mt-5 space-y-4">
            {utmFields.length > 0 ? (
              <dl className="space-y-3 text-sm">
                {utmFields.map((f) => (
                  <DetailRow key={f.label} label={f.label}>
                    <span className="font-mono text-xs">{f.value}</span>
                  </DetailRow>
                ))}
              </dl>
            ) : (
              <p className="text-muted-foreground text-sm">No UTM data recorded.</p>
            )}

            {user.referrer && (
              <>
                <Separator />
                <DetailRow label="Referrer">
                  <span className="break-all font-mono text-xs">{user.referrer}</span>
                </DetailRow>
              </>
            )}
          </TabsContent>

          {/* ── Actions ── */}
          <TabsContent value="actions" className="mt-5 space-y-3">
            <p className="text-muted-foreground text-xs">
              Current status: <WaitlistStatusBadge status={user.status} />
            </p>
            {transitions.length > 0 ? (
              transitions.map((t) => (
                <Button
                  key={t.next}
                  variant={t.next === 'unsubscribed' ? 'destructive' : 'default'}
                  className="w-full gap-2"
                  disabled={isPending}
                  onClick={() => handleStatusUpdate(t.next)}
                >
                  {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  {t.label}
                </Button>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No transitions available.</p>
            )}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-muted-foreground shrink-0">{label}</dt>
      <dd className="text-right font-medium">{children}</dd>
    </div>
  )
}
