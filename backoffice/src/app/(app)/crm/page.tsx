import { Search, Download } from "lucide-react";

import type { WaitlistStatus } from "@/types/database";

import { WaitlistStatusBadge } from "@/components/ui/status-badge";
import { getWaitlistUsers } from "@/lib/data/waitlist";


const statusFilters: WaitlistStatus[] = [
  "pending",
  "invited",
  "active",
  "unsubscribed",
];

export default async function CRMPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const params = await searchParams;
  const statusFilter = statusFilters.includes(params.status as WaitlistStatus)
    ? (params.status as WaitlistStatus)
    : undefined;

  const users = await getWaitlistUsers({
    status: statusFilter,
    search: params.q,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">CRM</h1>
          <p className="text-sm text-muted-foreground">
            {users.length} waitlist signup{users.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-md bg-card border border-border px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <form className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            name="q"
            defaultValue={params.q ?? ""}
            placeholder="Search by name, email, or company..."
            className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </form>
        <div className="flex items-center gap-1">
          <a
            href="/crm"
            className={`rounded-md border px-2.5 py-1 text-xs transition-colors capitalize ${
              !statusFilter
                ? "border-primary bg-primary/15 text-primary"
                : "border-border text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            All
          </a>
          {statusFilters.map((status) => (
            <a
              key={status}
              href={`/crm?status=${status}${params.q ? `&q=${params.q}` : ""}`}
              className={`rounded-md border px-2.5 py-1 text-xs transition-colors capitalize ${
                statusFilter === status
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              {status}
            </a>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                Company
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                Source
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                Score
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                Signed Up
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3 font-medium">
                    {user.full_name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {user.company ?? "—"}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {user.email}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground capitalize">
                    {user.source.replace(/-/g, " ")}
                  </td>
                  <td className="px-4 py-3">
                    <WaitlistStatusBadge status={user.status} />
                  </td>
                  <td className="px-4 py-3 tabular-nums text-muted-foreground">
                    {user.lead_score}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground tabular-nums">
                    {new Date(user.created_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
