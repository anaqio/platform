import { Calendar, CheckCircle, Clock, Zap } from 'lucide-react'

import { computeEventStats, getEvents } from '@/lib/data/events'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EventsClient } from '@/components/events/events-client'
import { RealtimeEventsSync } from '@/components/events/realtime-events-sync'

export const dynamic = 'force-dynamic'

export default async function EventsPage() {
  const events = await getEvents()
  const stats = computeEventStats(events)

  return (
    <>
      <RealtimeEventsSync />
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Events</h1>
          <p className="text-muted-foreground text-sm">
            Fashion shows, expos, launches, and other marketing events
          </p>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <KpiCard label="Total Events" value={stats.total} icon={Calendar} />
          <KpiCard label="Active" value={stats.active} icon={Zap} highlight />
          <KpiCard label="Upcoming" value={stats.upcoming} icon={Clock} />
          <KpiCard label="Past" value={stats.past} icon={CheckCircle} />
        </div>

        <EventsClient events={events} />
      </div>
    </>
  )
}

function KpiCard({
  label,
  value,
  icon: Icon,
  highlight,
}: {
  label: string
  value: number
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
