export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Backoffice configuration
        </p>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg border border-border bg-card p-6 space-y-4">
          <h2 className="text-sm font-medium">Supabase Connection</h2>
          <div className="grid gap-3">
            <div>
              <label className="text-xs text-muted-foreground">
                NEXT_PUBLIC_SUPABASE_URL
              </label>
              <input
                type="text"
                disabled
                value={process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""}
                placeholder="Not configured"
                className="mt-1 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">
                NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
              </label>
              <input
                type="password"
                disabled
                value={process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ? "••••••••" : ""}
                placeholder="Not configured"
                className="mt-1 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Sharing the same Supabase instance as the landing page.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-6 space-y-4">
          <h2 className="text-sm font-medium">Waitlist Status Workflow</h2>
          <div className="flex items-center gap-2 text-xs">
            <span className="rounded-full bg-status-pending/15 border border-status-pending/30 text-status-pending px-2 py-0.5">
              Pending
            </span>
            <span className="text-muted-foreground">&rarr;</span>
            <span className="rounded-full bg-status-invited/15 border border-status-invited/30 text-status-invited px-2 py-0.5">
              Invited
            </span>
            <span className="text-muted-foreground">&rarr;</span>
            <span className="rounded-full bg-status-active/15 border border-status-active/30 text-status-active px-2 py-0.5">
              Active
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Users can be unsubscribed from any state. Status transitions are
            managed via the CRM page.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-6 space-y-4">
          <h2 className="text-sm font-medium">Database Tables</h2>
          <div className="grid gap-2 text-xs font-mono text-muted-foreground">
            <div className="flex justify-between">
              <span>public.waitlist</span>
              <span className="text-foreground">RLS enabled</span>
            </div>
            <div className="flex justify-between">
              <span>public.campaigns</span>
              <span className="text-foreground">RLS enabled</span>
            </div>
            <div className="flex justify-between">
              <span>public.waitlist_campaign_attribution</span>
              <span className="text-foreground">RLS enabled</span>
            </div>
            <div className="flex justify-between">
              <span>public.campaign_signup_stats</span>
              <span className="text-foreground">View</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
