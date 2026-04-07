import { DollarSign, Gift, Globe, Mail, Megaphone, Plus, Search, Share2, Users } from 'lucide-react'

import type { CampaignPlatform, CampaignType } from '@/types/database'
import { getCampaignStats } from '@/lib/data/campaigns'

const typeIcons: Record<CampaignType, typeof Mail> = {
  email: Mail,
  social: Share2,
  influencer: Users,
  paid: DollarSign,
  organic: Globe,
  referral: Gift,
  seo: Search,
  smo: Megaphone,
}

const platformLabels: Record<CampaignPlatform, string> = {
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

export default async function CampaignsPage() {
  const campaigns = await getCampaignStats()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground text-sm">
            {campaigns.length} campaign{campaigns.length !== 1 ? 's' : ''} tracked
          </p>
        </div>
        <button className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors">
          <Plus className="h-4 w-4" />
          New Campaign
        </button>
      </div>

      <div className="grid gap-4">
        {campaigns.length === 0 ? (
          <p className="text-muted-foreground text-sm">No campaigns yet.</p>
        ) : (
          campaigns.map((campaign) => {
            const Icon = typeIcons[campaign.type] ?? Globe
            return (
              <div
                key={campaign.id}
                className="border-border bg-card hover:border-primary/30 rounded-lg border p-4 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="bg-muted mt-0.5 rounded-md p-2">
                      <Icon className="text-muted-foreground h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-medium">{campaign.name}</h3>
                      <div className="text-muted-foreground mt-1 flex items-center gap-2 text-xs">
                        <span className="capitalize">{campaign.type}</span>
                        {campaign.platform && (
                          <>
                            <span>·</span>
                            <span>{platformLabels[campaign.platform]}</span>
                          </>
                        )}
                        {campaign.start_date && (
                          <>
                            <span>·</span>
                            <span className="tabular-nums">
                              {new Date(campaign.start_date).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                              })}
                              {campaign.end_date &&
                                ` – ${new Date(campaign.end_date).toLocaleDateString('en-GB', {
                                  day: 'numeric',
                                  month: 'short',
                                })}`}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {campaign.budget_mad != null && (
                      <span className="text-muted-foreground text-xs tabular-nums">
                        {campaign.budget_mad.toLocaleString()} MAD
                      </span>
                    )}
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        campaign.is_active
                          ? 'bg-status-active/15 text-status-active'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {campaign.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="border-border mt-4 flex gap-6 border-t pt-3">
                  <div>
                    <span className="text-muted-foreground text-xs">Total Signups</span>
                    <p className="text-sm font-medium tabular-nums">{campaign.signups_total}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs">Invited</span>
                    <p className="text-sm font-medium tabular-nums">{campaign.signups_invited}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs">Active</span>
                    <p className="text-sm font-medium tabular-nums">{campaign.signups_active}</p>
                  </div>
                  {campaign.avg_lead_score != null && (
                    <div>
                      <span className="text-muted-foreground text-xs">Avg Score</span>
                      <p className="text-sm font-medium tabular-nums">
                        {Math.round(campaign.avg_lead_score)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
