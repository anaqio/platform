import type { WaitlistStatus } from '@/types/database'
import { getWaitlistUsers } from '@/lib/data/waitlist'
import { CRMClient } from '@/components/crm/crm-client'

export const dynamic = 'force-dynamic'

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

  const users = await getWaitlistUsers({ status: statusFilter, search: params.q })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">CRM</h1>
        <p className="text-muted-foreground text-sm">
          {users.length} waitlist signup{users.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <form className="relative max-w-sm flex-1">
          <svg
            className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" strokeWidth="2" />
            <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
          </svg>
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

      <CRMClient users={users} statusFilter={statusFilter} searchQuery={params.q} />
    </div>
  )
}
