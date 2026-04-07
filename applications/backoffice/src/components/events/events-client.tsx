'use client'

import { useState, useTransition } from 'react'
import { CalendarDays, ExternalLink, MapPin, Power } from 'lucide-react'

import type { Event } from '@/types/database'
import { toggleEventActive } from '@/lib/actions/events'
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

import { CreateEventDialog } from './create-event-dialog'

const TYPE_LABELS: Record<string, string> = {
  fashion_show: 'Fashion Show',
  expo: 'Expo',
  launch: 'Launch',
  workshop: 'Workshop',
  webinar: 'Webinar',
  pop_up: 'Pop-Up',
  other: 'Other',
}

function fmtDate(dateStr: string | null) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

interface EventsClientProps {
  events: Event[]
}

export function EventsClient({ events }: EventsClientProps) {
  const [createOpen, setCreateOpen] = useState(false)
  const [toggling, startToggle] = useTransition()

  function handleToggle(id: string, current: boolean) {
    startToggle(async () => {
      await toggleEventActive(id, !current)
    })
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          {events.length} event{events.length !== 1 ? 's' : ''}
        </p>
        <Button onClick={() => setCreateOpen(true)}>New Event</Button>
      </div>

      <div className="border-border rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-20" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-muted-foreground py-10 text-center text-sm">
                  No events yet. Create your first one.
                </TableCell>
              </TableRow>
            ) : (
              events.map((e) => {
                const isPast = e.end_at && new Date(e.end_at) < new Date()
                return (
                  <TableRow key={e.id}>
                    <TableCell className="font-medium">{e.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {TYPE_LABELS[e.type] ?? e.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {e.city || e.venue ? (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 shrink-0" />
                          {[e.city, e.venue].filter(Boolean).join(' · ')}
                        </span>
                      ) : (
                        '—'
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {e.start_at ? (
                        <span className="flex items-center gap-1">
                          <CalendarDays className="h-3 w-3 shrink-0" />
                          {fmtDate(e.start_at)}
                        </span>
                      ) : (
                        '—'
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={e.is_active && !isPast ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {isPast ? 'Past' : e.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {e.registration_url && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                                <a
                                  href={e.registration_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink className="h-3.5 w-3.5" />
                                </a>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Open registration page</TooltipContent>
                          </Tooltip>
                        )}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              disabled={toggling}
                              onClick={() => handleToggle(e.id, e.is_active)}
                            >
                              <Power
                                className={`h-3.5 w-3.5 ${e.is_active ? 'text-primary' : 'text-muted-foreground'}`}
                              />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{e.is_active ? 'Deactivate' : 'Activate'}</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      <CreateEventDialog open={createOpen} onOpenChange={setCreateOpen} />
    </>
  )
}
