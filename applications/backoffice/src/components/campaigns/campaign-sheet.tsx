'use client'

import { useTransition } from 'react'
import { Loader2, Power } from 'lucide-react'

import type { CampaignSignupStats } from '@/types/database'
import { toggleCampaignActive } from '@/lib/actions/campaigns'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { CampaignQR } from './campaign-qr'

const TYPE_LABELS: Record<string, string> = {
  email: 'Email',
  social: 'Social',
  influencer: 'Influencer',
  paid: 'Paid',
  organic: 'Organic',
  referral: 'Referral',
  seo: 'SEO',
  smo: 'SMO',
}

const PLATFORM_LABELS: Record<string, string> = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  facebook: 'Facebook',
  google: 'Google',
  linkedin: 'LinkedIn',
  x: 'X',
  whatsapp: 'WhatsApp',
  email: 'Email',
  other: 'Other',
}

function fmt(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

interface CampaignSheetProps {
  campaign: CampaignSignupStats | null
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultTab?: 'overview' | 'qr'
}

export function CampaignSheet({
  campaign,
  open,
  onOpenChange,
  defaultTab = 'overview',
}: CampaignSheetProps) {
  const [isToggling, startToggle] = useTransition()

  if (!campaign) return null

  function handleToggle() {
    startToggle(async () => {
      await toggleCampaignActive(campaign!.id, !campaign!.is_active)
      onOpenChange(false)
    })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[420px] overflow-y-auto sm:max-w-[420px]">
        <SheetHeader className="mb-5">
          <SheetTitle>{campaign.name}</SheetTitle>
          <div className="flex flex-wrap gap-2">
            <Badge variant={campaign.is_active ? 'default' : 'secondary'}>
              {campaign.is_active ? 'Active' : 'Inactive'}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {TYPE_LABELS[campaign.type] ?? campaign.type}
            </Badge>
            {campaign.platform && (
              <Badge variant="outline">
                {PLATFORM_LABELS[campaign.platform] ?? campaign.platform}
              </Badge>
            )}
          </div>
        </SheetHeader>

        <Tabs defaultValue={defaultTab}>
          <TabsList className="w-full">
            <TabsTrigger value="overview" className="flex-1">
              Overview
            </TabsTrigger>
            <TabsTrigger value="qr" className="flex-1">
              QR Code
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-5 space-y-5">
            <div className="grid grid-cols-3 gap-3">
              <StatCard label="Total" value={campaign.signups_total} />
              <StatCard label="Invited" value={campaign.signups_invited} />
              <StatCard label="Active" value={campaign.signups_active} />
            </div>

            <Button
              variant={campaign.is_active ? 'outline' : 'default'}
              size="sm"
              className="w-full gap-2"
              disabled={isToggling}
              onClick={handleToggle}
            >
              {isToggling ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Power className="h-4 w-4" />
              )}
              {campaign.is_active ? 'Deactivate Campaign' : 'Activate Campaign'}
            </Button>

            {campaign.avg_lead_score != null && (
              <div className="bg-muted rounded-lg p-4">
                <span className="text-muted-foreground text-xs">Avg Lead Score</span>
                <p className="mt-1 text-3xl font-semibold tabular-nums">
                  {Math.round(campaign.avg_lead_score)}
                  <span className="text-muted-foreground ml-1 text-sm font-normal">/100</span>
                </p>
              </div>
            )}

            <Separator />

            <dl className="space-y-3 text-sm">
              {campaign.budget_mad != null && (
                <DetailRow label="Budget" value={`${campaign.budget_mad.toLocaleString()} MAD`} />
              )}
              {campaign.start_date && <DetailRow label="Start" value={fmt(campaign.start_date)} />}
              {campaign.end_date && <DetailRow label="End" value={fmt(campaign.end_date)} />}
              {campaign.first_signup_at && (
                <DetailRow label="First Signup" value={fmt(campaign.first_signup_at)} />
              )}
              {campaign.last_signup_at && (
                <DetailRow label="Last Signup" value={fmt(campaign.last_signup_at)} />
              )}
            </dl>
          </TabsContent>

          <TabsContent value="qr" className="mt-5">
            <CampaignQR campaign={campaign} />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-muted rounded-lg p-3 text-center">
      <span className="text-muted-foreground text-xs">{label}</span>
      <p className="mt-0.5 text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  )
}
