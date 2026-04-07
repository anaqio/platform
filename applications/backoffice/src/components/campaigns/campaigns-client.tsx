'use client'

import { useState } from 'react'
import { QrCode } from 'lucide-react'

import type { CampaignSignupStats } from '@/types/database'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

import { CampaignSheet } from './campaign-sheet'
import { CreateCampaignDialog } from './create-campaign-dialog'

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

interface CampaignsClientProps {
  campaigns: CampaignSignupStats[]
}

export function CampaignsClient({ campaigns }: CampaignsClientProps) {
  const [selected, setSelected] = useState<CampaignSignupStats | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [sheetTab, setSheetTab] = useState<'overview' | 'qr'>('overview')
  const [createOpen, setCreateOpen] = useState(false)

  function openSheet(campaign: CampaignSignupStats, tab: 'overview' | 'qr' = 'overview') {
    setSelected(campaign)
    setSheetTab(tab)
    setSheetOpen(true)
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          {campaigns.length} campaign{campaigns.length !== 1 ? 's' : ''}
        </p>
        <Button onClick={() => setCreateOpen(true)}>New Campaign</Button>
      </div>

      <div className="border-border rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Signups</TableHead>
              <TableHead className="text-right">Budget</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-muted-foreground py-10 text-center text-sm">
                  No campaigns yet. Create your first one.
                </TableCell>
              </TableRow>
            ) : (
              campaigns.map((c) => (
                <TableRow
                  key={c.id}
                  className="cursor-pointer"
                  onClick={() => openSheet(c, 'overview')}
                >
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs capitalize">
                      {TYPE_LABELS[c.type] ?? c.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {c.platform ? (PLATFORM_LABELS[c.platform] ?? c.platform) : '—'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={c.is_active ? 'default' : 'secondary'} className="text-xs">
                      {c.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{c.signups_total}</TableCell>
                  <TableCell className="text-muted-foreground text-right text-sm tabular-nums">
                    {c.budget_mad != null ? `${c.budget_mad.toLocaleString()} MAD` : '—'}
                  </TableCell>
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation()
                            openSheet(c, 'qr')
                          }}
                        >
                          <QrCode className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Generate QR Code</TooltipContent>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <CampaignSheet
        campaign={selected}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        defaultTab={sheetTab}
      />
      <CreateCampaignDialog open={createOpen} onOpenChange={setCreateOpen} />
    </>
  )
}
