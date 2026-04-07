# CLAUDE.md — Backoffice

Back-office app for Anaqio's internal operations: CRM (waitlist user lifecycle), campaign management, and dashboard analytics. Shares the same Supabase instance as the landing-page (`fslmfiqbhziayxxfsrpz`).

## Commands

```bash
bun run dev           # next dev --turbopack on port 3001
bun run build         # next build
bun run start         # next start on port 3001
bun run lint          # next lint
bun run type-check    # tsc --noEmit
```

## Architecture

- **Framework:** Next.js 16 (App Router, Turbopack, React 19)
- **Styling:** Tailwind CSS v4 (CSS-first `@theme` in `globals.css`) + `tw-animate-css`
- **Database/Auth:** Supabase (3-client pattern: browser/server/admin)
- **Icons:** lucide-react
- **Utility:** `cn()` at `src/lib/utils/cn.ts` (clsx + tailwind-merge)

### Route Structure

```
src/app/
├── layout.tsx          # Root layout (dark mode, metadata)
├── page.tsx            # Redirects to /dashboard
├── globals.css         # Tailwind v4 theme tokens
└── (app)/
    ├── layout.tsx      # AppShell wrapper (sidebar + main)
    ├── dashboard/      # KPI stats, signup funnel, recent signups (server component)
    ├── crm/            # Waitlist table with search + status filters (server component)
    ├── campaigns/      # Campaign cards from campaign_signup_stats view (server component)
    └── settings/       # Supabase config, workflow visualization (static)
```

### Database Schema (shared with landing-page)

**Tables:**

- `public.waitlist` — 22 columns, RLS enabled. Status: `pending → invited → active` (+ `unsubscribed`)
- `public.campaigns` — 14 columns, RLS enabled. Types: email, social, influencer, paid, organic, referral, seo, smo
- `public.waitlist_campaign_attribution` — Junction table (waitlist_id, campaign_id, attributed_at)
- `public.campaign_signup_stats` — View aggregating campaigns with signup counts

**Key Types (`src/types/database.ts`):**

- `WaitlistStatus`: `"pending" | "invited" | "active" | "unsubscribed"`
- `WaitlistUser`: Full waitlist row (email, company, role, revenue_range, UTM fields, lead_score, etc.)
- `Campaign`: Marketing campaign with slug, platform, budget_mad, target_audience JSONB
- `CampaignSignupStats`: Aggregated view with signups_total, signups_invited, signups_active, avg_lead_score

**Data Fetching (`src/lib/data/`):**

- `waitlist.ts` — `getWaitlistUsers(filters?)`, `getWaitlistStats()`
- `campaigns.ts` — `getCampaignStats()`

### Waitlist Status Workflow

```
pending → invited → active
    ↘        ↘        ↘
         unsubscribed (from any state)
```

## Conventions

- All dynamic pages are **async Server Components** fetching live data from Supabase
- Port **3001** to avoid conflict with studio (3000) and landing-page (3002)
- Status colors as CSS custom properties: `--color-status-pending`, `--color-status-invited`, etc.
- Brand colors: navy `#1B2F52`, blue `#2C5F8A`, gold `#D4AF37`
- No `forwardRef` (React 19), async request APIs (`await cookies()`, etc.)
- `@supabase/ssr` for SSR cookie auth — never inline `createClient()`
- No `select('*')` in Supabase queries — always name columns explicitly
- Env var: `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` (not `ANON_KEY`)

## Scope

This is the internal backoffice — not user-facing. Current scope:

- CRM: view, filter, search waitlist users with status/search params
- Campaigns: view campaign performance from `campaign_signup_stats` view
- Dashboard: funnel metrics (by status), recent signups
- Settings: connection config, workflow reference, schema overview

**Out of scope:** billing, Shopify integration, public API, multi-tenant, i18n, write operations (status updates, campaign CRUD — planned next).
