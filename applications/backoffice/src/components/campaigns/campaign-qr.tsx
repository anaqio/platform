'use client'

import { useRef, useState } from 'react'
import QRCode from 'react-qr-code'
import { Check, Copy, Download } from 'lucide-react'

import type { CampaignSignupStats } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

const LANDING_BASE = 'https://anaqio.com'

function buildTrackingUrl(campaign: CampaignSignupStats) {
  const params = new URLSearchParams({
    utm_source: campaign.slug,
    utm_medium: campaign.platform ?? campaign.type,
    utm_campaign: campaign.slug,
    utm_content: 'qr',
  })
  return `${LANDING_BASE}?${params.toString()}`
}

export function CampaignQR({ campaign }: { campaign: CampaignSignupStats }) {
  const qrRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)
  const url = buildTrackingUrl(campaign)

  function copyUrl() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function downloadSvg() {
    const svg = qrRef.current?.querySelector('svg')
    if (!svg) return
    const svgData = new XMLSerializer().serializeToString(svg)
    const blob = new Blob([svgData], { type: 'image/svg+xml' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${campaign.slug}-qr.svg`
    link.click()
    URL.revokeObjectURL(link.href)
  }

  return (
    <div className="space-y-5">
      <div ref={qrRef} className="flex justify-center">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <QRCode value={url} size={180} />
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label className="text-muted-foreground text-xs uppercase tracking-wide">
          Tracking URL
        </Label>
        <div className="flex gap-2">
          <Input value={url} readOnly className="font-mono text-xs" />
          <Button variant="outline" size="icon" onClick={copyUrl} title="Copy URL">
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-muted-foreground text-xs">
          Scans land on the waitlist page with UTM attribution
        </p>
      </div>

      <Button variant="outline" className="w-full gap-2" onClick={downloadSvg}>
        <Download className="h-4 w-4" />
        Download SVG
      </Button>
    </div>
  )
}
