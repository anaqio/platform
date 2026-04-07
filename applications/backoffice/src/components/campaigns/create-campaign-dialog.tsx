'use client'

import { useTransition } from 'react'

import type { CampaignPlatform, CampaignType } from '@/types/database'
import { createCampaign } from '@/lib/actions/campaigns'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const TYPES: { value: CampaignType; label: string }[] = [
  { value: 'email', label: 'Email' },
  { value: 'social', label: 'Social' },
  { value: 'influencer', label: 'Influencer' },
  { value: 'paid', label: 'Paid' },
  { value: 'organic', label: 'Organic' },
  { value: 'referral', label: 'Referral' },
  { value: 'seo', label: 'SEO' },
  { value: 'smo', label: 'SMO' },
]

const PLATFORMS: { value: CampaignPlatform; label: string }[] = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'google', label: 'Google' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'x', label: 'X' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'email', label: 'Email' },
  { value: 'other', label: 'Other' },
]

interface CreateCampaignDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateCampaignDialog({ open, onOpenChange }: CreateCampaignDialogProps) {
  const [isPending, startTransition] = useTransition()

  function submitAction(fd: FormData) {
    const budget = fd.get('budget_mad') as string
    const startDate = fd.get('start_date') as string
    const endDate = fd.get('end_date') as string
    const platform = fd.get('platform') as string

    startTransition(async () => {
      await createCampaign({
        name: fd.get('name') as string,
        type: fd.get('type') as CampaignType,
        platform: platform && platform !== 'none' ? (platform as CampaignPlatform) : null,
        start_date: startDate || null,
        end_date: endDate || null,
        budget_mad: budget ? Number(budget) : null,
        is_active: true,
      })
      onOpenChange(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>New Campaign</DialogTitle>
        </DialogHeader>

        <form action={submitAction} className="space-y-4">
          <Field label="Name" required>
            <Input name="name" placeholder="Spring Launch" required />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Type" required>
              <Select name="type" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Platform">
              <Select name="platform" defaultValue="none">
                <SelectTrigger>
                  <SelectValue placeholder="Optional" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {PLATFORMS.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Start Date">
              <Input name="start_date" type="date" />
            </Field>
            <Field label="End Date">
              <Input name="end_date" type="date" />
            </Field>
          </div>

          <Field label="Budget (MAD)">
            <Input name="budget_mad" type="number" min={0} placeholder="5000" />
          </Field>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Creating…' : 'Create Campaign'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label>
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
    </div>
  )
}
