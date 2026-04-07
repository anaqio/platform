import { Download, Search } from 'lucide-react'

import type { WaitlistStatus } from '@/types/database'
import { getWaitlistUsers } from '@/lib/data/waitlist'
import { WaitlistStatusBadge } from '@/components/ui/status-badge'

const statusFilters: WaitlistStatus[] = ['pending', 'invited', 'active', 'unsubscribed']

export default async function CRMPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>
}) {
  const params = await searchParams
  const statusFilter = statusFilters.includes(params.status as WaitlistStatus)
    ? (params.status as WaitlistStatus)
    : undefined

  const users = await getWaitlistUsers({
    status: statusFilter,
    search: params.q,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">CRM</h1>
          <p className="text-muted-foreground text-sm">
            {users.length} waitlist signup{users.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button className="bg-card border-border text-muted-foreground hover:text-foreground flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors">
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <form className="relative max-w-sm flex-1">
          <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          <input
            type="text"
            name="q"
            defaultValue={params.q ?? ''}
            placeholder="Search by name, email, or company..."
            className="border-input bg-background placeholder:text-muted-foreground focus:ring-ring w-full rounded-md border py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-1"
          />
        </form>
        <div className="flex items-center gap-1">
          <a
            href="/crm"
            className={`rounded-md border px-2.5 py-1 text-xs capitalize transition-colors ${
              !statusFilter
                ? 'border-primary bg-primary/15 text-primary'
                : 'border-border text-muted-foreground hover:bg-accent hover:text-foreground'
            }`}
          >
            All
          </a>
          {statusFilters.map((status) => (
            <a
              key={status}
              href={`/crm?status=${status}${params.q ? `&q=${params.q}` : ''}`}
              className={`rounded-md border px-2.5 py-1 text-xs capitalize transition-colors ${
                statusFilter === status
                  ? 'border-primary bg-primary/15 text-primary'
                  : 'border-border text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
            >
              {status}
            </a>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="border-border overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-border bg-muted/50 border-b">
              <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium">
                Name
              </th>
              <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium">
                Company
              </th>
              <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium">
                Email
              </th>
              <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium">
                Source
              </th>
              <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium">
                Status
              </th>
              <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium">
                Score
              </th>
              <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium">
                Signed Up
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-muted-foreground px-4 py-8 text-center">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="border-border hover:bg-muted/30 border-b transition-colors last:border-0"
                >
                  <td className="px-4 py-3 font-medium">{user.full_name ?? '—'}</td>
                  <td className="text-muted-foreground px-4 py-3">{user.company ?? '—'}</td>
                  <td className="text-muted-foreground px-4 py-3 font-mono text-xs">
                    {user.email}
                  </td>
                  <td className="text-muted-foreground px-4 py-3 capitalize">
                    {user.source.replace(/-/g, ' ')}
                  </td>
                  <td className="px-4 py-3">
                    <WaitlistStatusBadge status={user.status} />
                  </td>
                  <td className="text-muted-foreground px-4 py-3 tabular-nums">
                    {user.lead_score}
                  </td>
                  <td className="text-muted-foreground px-4 py-3 text-xs tabular-nums">
                    {new Date(user.created_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
