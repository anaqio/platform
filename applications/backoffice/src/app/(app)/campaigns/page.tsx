import { Megaphone, TrendingUp, Users, Zap } from 'lucide-react'

import { getCampaignStats } from '@/lib/data/campaigns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CampaignsClient } from '@/components/campaigns/campaigns-client'

export const dynamic = 'force-dynamic'

export default async function CampaignsPage() {
  const campaigns = await getCampaignStats()

  const total = campaigns.length
  const active = campaigns.filter((c) => c.is_active).length
  const totalSignups = campaigns.reduce((sum, c) => sum + c.signups_total, 0)

  const scoredCampaigns = campaigns.filter((c) => c.avg_lead_score != null)
  const avgScore =
    scoredCampaigns.length > 0
      ? Math.round(
          scoredCampaigns.reduce((sum, c) => sum + (c.avg_lead_score ?? 0), 0) /
            scoredCampaigns.length,
        )
      : null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Campaigns</h1>
        <p className="text-muted-foreground text-sm">Track and manage your acquisition campaigns</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <KpiCard label="Total Campaigns" value={total} icon={Megaphone} />
        <KpiCard label="Active" value={active} icon={Zap} highlight />
        <KpiCard label="Total Signups" value={totalSignups} icon={Users} />
        <KpiCard
          label="Avg Lead Score"
          value={avgScore != null ? `${avgScore}` : '—'}
          icon={TrendingUp}
        />
      </div>

      <CampaignsClient campaigns={campaigns} />
    </div>
  )
}

function KpiCard({
  label,
  value,
  icon: Icon,
  highlight,
}: {
  label: string
  value: string | number
  icon: React.ElementType
  highlight?: boolean
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-muted-foreground text-sm font-medium">{label}</CardTitle>
        <Icon className={`h-4 w-4 ${highlight ? 'text-primary' : 'text-muted-foreground'}`} />
      </CardHeader>
      <CardContent>
        <p className={`text-3xl font-semibold tabular-nums ${highlight ? 'text-primary' : ''}`}>
          {value}
        </p>
      </CardContent>
    </Card>
  )
}
