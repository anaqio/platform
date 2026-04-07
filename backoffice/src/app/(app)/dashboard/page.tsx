import {
  Users,
  UserCheck,
  Clock,
  UserX,
  TrendingUp,
  Calendar,
} from "lucide-react";

import { WaitlistStatusBadge } from "@/components/ui/status-badge";
import { getWaitlistStats , getWaitlistUsers } from "@/lib/data/waitlist";

export default async function DashboardPage() {
  const [stats, recentUsers] = await Promise.all([
    getWaitlistStats(),
    getWaitlistUsers().then((users) => users.slice(0, 5)),
  ]);

  const kpis = [
    { label: "Total Signups", value: stats.total, icon: Users, color: "text-primary" },
    { label: "Pending", value: stats.pending, icon: Clock, color: "text-status-pending" },
    { label: "Invited", value: stats.invited, icon: TrendingUp, color: "text-status-invited" },
    { label: "Active", value: stats.active, icon: UserCheck, color: "text-status-active" },
    { label: "Unsubscribed", value: stats.unsubscribed, icon: UserX, color: "text-status-unsubscribed" },
    { label: "This Week", value: stats.this_week, icon: Calendar, color: "text-muted-foreground" },
  ];

  const funnelStages = [
    { label: "Pending", count: stats.pending },
    { label: "Invited", count: stats.invited },
    { label: "Active", count: stats.active },
  ];
  const maxFunnel = Math.max(...funnelStages.map((s) => s.count), 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Waitlist funnel & signup overview
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-lg border border-border bg-card p-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{kpi.label}</span>
              <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
            </div>
            <p className="mt-2 text-2xl font-semibold tabular-nums">
              {kpi.value}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-sm font-medium text-muted-foreground mb-4">
          Signup Funnel
        </h2>
        <div className="flex items-end gap-2 h-40">
          {funnelStages.map((stage) => (
            <div key={stage.label} className="flex flex-1 flex-col items-center gap-2">
              <div
                className="w-full rounded-t-md bg-primary/20"
                style={{ height: `${(stage.count / maxFunnel) * 100}%`, minHeight: stage.count > 0 ? "8px" : "2px" }}
              />
              <div className="text-center">
                <span className="text-xs text-muted-foreground">{stage.label}</span>
                <p className="text-sm font-medium tabular-nums">{stage.count}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-sm font-medium text-muted-foreground mb-4">
          Recent Signups
        </h2>
        {recentUsers.length === 0 ? (
          <p className="text-sm text-muted-foreground">No signups yet.</p>
        ) : (
          <div className="space-y-3">
            {recentUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="font-medium truncate">
                    {user.full_name ?? user.email}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.company ? `${user.company} · ` : ""}
                    {user.source}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <WaitlistStatusBadge status={user.status} />
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {new Date(user.created_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
