export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm">Backoffice configuration</p>
      </div>

      <div className="space-y-4">
        <div className="border-border bg-card space-y-4 rounded-lg border p-6">
          <h2 className="text-sm font-medium">Supabase Connection</h2>
          <div className="grid gap-3">
            <div>
              <label className="text-muted-foreground text-xs">NEXT_PUBLIC_SUPABASE_URL</label>
              <input
                type="text"
                disabled
                value={process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''}
                placeholder="Not configured"
                className="border-input bg-muted text-muted-foreground mt-1 w-full rounded-md border px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-muted-foreground text-xs">
                NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
              </label>
              <input
                type="password"
                disabled
                value={process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ? '••••••••' : ''}
                placeholder="Not configured"
                className="border-input bg-muted text-muted-foreground mt-1 w-full rounded-md border px-3 py-2 text-sm"
              />
            </div>
          </div>
          <p className="text-muted-foreground text-xs">
            Sharing the same Supabase instance as the landing page.
          </p>
        </div>

        <div className="border-border bg-card space-y-4 rounded-lg border p-6">
          <h2 className="text-sm font-medium">Waitlist Status Workflow</h2>
          <div className="flex items-center gap-2 text-xs">
            <span className="bg-status-pending/15 border-status-pending/30 text-status-pending rounded-full border px-2 py-0.5">
              Pending
            </span>
            <span className="text-muted-foreground">&rarr;</span>
            <span className="bg-status-invited/15 border-status-invited/30 text-status-invited rounded-full border px-2 py-0.5">
              Invited
            </span>
            <span className="text-muted-foreground">&rarr;</span>
            <span className="bg-status-active/15 border-status-active/30 text-status-active rounded-full border px-2 py-0.5">
              Active
            </span>
          </div>
          <p className="text-muted-foreground text-xs">
            Users can be unsubscribed from any state. Status transitions are managed via the CRM
            page.
          </p>
        </div>

        <div className="border-border bg-card space-y-4 rounded-lg border p-6">
          <h2 className="text-sm font-medium">Database Tables</h2>
          <div className="text-muted-foreground grid gap-2 font-mono text-xs">
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
  )
}
