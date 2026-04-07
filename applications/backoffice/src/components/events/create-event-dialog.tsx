'use client'

import { useTransition } from 'react'

import type { EventType } from '@/types/database'
import { createEvent } from '@/lib/actions/events'
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
import { Textarea } from '@/components/ui/textarea'

const TYPES: { value: EventType; label: string }[] = [
  { value: 'fashion_show', label: 'Fashion Show' },
  { value: 'expo', label: 'Expo / Trade Fair' },
  { value: 'launch', label: 'Product Launch' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'webinar', label: 'Webinar' },
  { value: 'pop_up', label: 'Pop-Up' },
  { value: 'other', label: 'Other' },
]

interface CreateEventDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateEventDialog({ open, onOpenChange }: CreateEventDialogProps) {
  const [isPending, startTransition] = useTransition()

  function submitAction(fd: FormData) {
    const capacity = fd.get('capacity') as string
    const startAt = fd.get('start_at') as string
    const endAt = fd.get('end_at') as string

    startTransition(async () => {
      await createEvent({
        name: fd.get('name') as string,
        type: fd.get('type') as EventType,
        description: (fd.get('description') as string) || null,
        venue: (fd.get('venue') as string) || null,
        city: (fd.get('city') as string) || null,
        country: (fd.get('country') as string) || 'MA',
        start_at: startAt ? new Date(startAt).toISOString() : null,
        end_at: endAt ? new Date(endAt).toISOString() : null,
        capacity: capacity ? Number(capacity) : null,
        registration_url: (fd.get('registration_url') as string) || null,
        is_active: true,
      })
      onOpenChange(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>New Event</DialogTitle>
        </DialogHeader>

        <form action={submitAction} className="space-y-4">
          <Field label="Name" required>
            <Input name="name" placeholder="Casablanca Fashion Week 2026" required />
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

            <Field label="City">
              <Input name="city" placeholder="Casablanca" />
            </Field>
          </div>

          <Field label="Venue">
            <Input name="venue" placeholder="Twin Center, Maarif" />
          </Field>

          <Field label="Description">
            <Textarea name="description" placeholder="Event details…" rows={3} />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Start">
              <Input name="start_at" type="datetime-local" />
            </Field>
            <Field label="End">
              <Input name="end_at" type="datetime-local" />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Capacity">
              <Input name="capacity" type="number" min={1} placeholder="200" />
            </Field>
            <Field label="Country">
              <Input name="country" placeholder="MA" defaultValue="MA" maxLength={2} />
            </Field>
          </div>

          <Field label="Registration URL">
            <Input name="registration_url" type="url" placeholder="https://…" />
          </Field>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Creating…' : 'Create Event'}
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
