import { Calendar, Clock, TrendingUp, UserCheck, Users, UserX } from 'lucide-react'

import { getWaitlistStats, getWaitlistUsers } from '@/lib/data/waitlist'
import { WaitlistStatusBadge } from '@/components/ui/status-badge'

export default async function DashboardPage() {
  const [stats, recentUsers] = await Promise.all([
    getWaitlistStats(),
    getWaitlistUsers().then((users) => users.slice(0, 5)),
  ])

  const kpis = [
    { label: 'Total Signups', value: stats.total, icon: Users, color: 'text-primary' },
    { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-status-pending' },
    { label: 'Invited', value: stats.invited, icon: TrendingUp, color: 'text-status-invited' },
    { label: 'Active', value: stats.active, icon: UserCheck, color: 'text-status-active' },
    {
      label: 'Unsubscribed',
      value: stats.unsubscribed,
      icon: UserX,
      color: 'text-status-unsubscribed',
    },
    { label: 'This Week', value: stats.this_week, icon: Calendar, color: 'text-muted-foreground' },
  ]

  const funnelStages = [
    { label: 'Pending', count: stats.pending },
    { label: 'Invited', count: stats.invited },
    { label: 'Active', count: stats.active },
  ]
  const maxFunnel = Math.max(...funnelStages.map((s) => s.count), 1)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Waitlist funnel & signup overview</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="border-border bg-card rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs">{kpi.label}</span>
              <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
            </div>
            <p className="mt-2 text-2xl font-semibold tabular-nums">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="border-border bg-card rounded-lg border p-6">
        <h2 className="text-muted-foreground mb-4 text-sm font-medium">Signup Funnel</h2>
        <div className="flex h-40 items-end gap-2">
          {funnelStages.map((stage) => (
            <div key={stage.label} className="flex flex-1 flex-col items-center gap-2">
              <div
                className="bg-primary/20 w-full rounded-t-md"
                style={{
                  height: `${(stage.count / maxFunnel) * 100}%`,
                  minHeight: stage.count > 0 ? '8px' : '2px',
                }}
              />
              <div className="text-center">
                <span className="text-muted-foreground text-xs">{stage.label}</span>
                <p className="text-sm font-medium tabular-nums">{stage.count}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-border bg-card rounded-lg border p-6">
        <h2 className="text-muted-foreground mb-4 text-sm font-medium">Recent Signups</h2>
        {recentUsers.length === 0 ? (
          <p className="text-muted-foreground text-sm">No signups yet.</p>
        ) : (
          <div className="space-y-3">
            {recentUsers.map((user) => (
              <div
                key={user.id}
                className="border-border flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{user.full_name ?? user.email}</p>
                  <p className="text-muted-foreground truncate text-xs">
                    {user.company ? `${user.company} · ` : ''}
                    {user.source}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <WaitlistStatusBadge status={user.status} />
                  <span className="text-muted-foreground text-xs tabular-nums">
                    {new Date(user.created_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
