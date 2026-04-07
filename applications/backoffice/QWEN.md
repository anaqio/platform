# Anaqio Backoffice

Internal back-office application for Anaqio's operations: CRM (waitlist user lifecycle), campaign management, and dashboard analytics.

## Tech Stack

- **Framework:** Next.js 16.2.1 (App Router, Turbopack, React 19)
- **Language:** TypeScript 5.8.3 (strict mode, ES2017 target)
- **Styling:** Tailwind CSS v4 (CSS-first `@theme` in `globals.css`) + `tw-animate-css`
- **Database/Auth:** Supabase (3-client pattern: browser/server/admin)
- **Icons:** lucide-react
- **Runtime:** Bun

## Building & Running

```bash
bun run dev           # Development server (port 3001, Turbopack)
bun run build         # Production build
bun run start         # Production server (port 3001)
bun run lint          # ESLint check (next lint)
bun run type-check    # TypeScript type checking (tsc --noEmit)
```

## Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── (app)/                # Authenticated app routes (grouped)
│   │   ├── layout.tsx        # AppShell wrapper (sidebar + main)
│   │   ├── dashboard/        # KPI stats, funnel, recent signups
│   │   ├── crm/              # Waitlist table with search + status filters
│   │   ├── campaigns/        # Campaign performance cards
│   │   └── settings/         # Configuration (static)
│   ├── api/                  # API routes (empty)
│   ├── layout.tsx            # Root layout (dark mode, metadata)
│   ├── page.tsx              # Redirects to /dashboard
│   └── globals.css           # Tailwind v4 theme tokens
├── components/
│   ├── layout/               # AppShell, Sidebar
│   └── ui/                   # StatusBadge component
├── lib/
│   ├── data/                 # Server-side data fetching
│   │   ├── waitlist.ts       # getWaitlistUsers(), getWaitlistStats()
│   │   └── campaigns.ts      # getCampaignStats()
│   ├── supabase/             # 3-client pattern
│   │   ├── client.ts         # Browser client (@supabase/ssr)
│   │   ├── server.ts         # Server client (cookies via next/headers)
│   │   └── admin.ts          # Admin client (service role key)
│   └── utils/
│       └── cn.ts             # clsx + tailwind-merge utility
└── types/
    └── database.ts           # TypeScript types for DB schema
```

## Key Conventions

### Server Components

- All pages are **async Server Components** fetching live data from Supabase
- No client state needed for data fetching
- Use `"use client"` only for interactive components (e.g., Sidebar with `usePathname()`)

### Supabase Clients

- **Browser:** `createBrowserClient()` for client-side operations
- **Server:** `createServerClient()` with cookie handling for Server Components
- **Admin:** `createClient()` with service role key for admin operations
- Never inline `createClient()` — always import from `src/lib/supabase/*`
- Use `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` (not `ANON_KEY`)

### Query Patterns

- **No `select('*')`:** Always name columns explicitly
- Example: `.select("id, email, full_name, created_at")`
- Use typed returns: `as WaitlistUser[]`

### Status Workflow

```
pending → invited → active
    ↘        ↘        ↘
         unsubscribed (from any state)
```

### Styling

- Dark mode by default (`<html className="dark">`)
- Brand colors: Navy, Blue, Gold (defined in `globals.css`)
- Status colors: `--color-status-pending`, `--color-status-invited`, etc.
- Use `cn()` utility for conditional class merging
- Tailwind CSS v4 uses CSS-first `@theme` configuration

### React 19 Patterns

- No `forwardRef` (built-in in React 19)
- Async request APIs supported (`await cookies()`, etc.)
- Use `use client` directive only when needed

## Database Schema

### Tables

**waitlist** (22 columns, RLS enabled)

- Core fields: `email`, `full_name`, `role`, `company`, `revenue_range`
- UTM tracking: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`
- Status: `status` (pending | invited | active | unsubscribed)
- Scoring: `lead_score`
- Timestamps: `created_at`, `updated_at`, `invited_at`

**campaigns** (14 columns, RLS enabled)

- Types: email, social, influencer, paid, organic, referral, seo, smo
- Platforms: instagram, tiktok, facebook, google, linkedin, x, whatsapp, email, other
- Fields: `budget_mad`, `target_audience` (JSONB), `is_active`

**waitlist_campaign_attribution**

- Junction table: `waitlist_id`, `campaign_id`, `attributed_at`

**campaign_signup_stats** (view)

- Aggregates campaigns with signup counts
- Fields: `signups_total`, `signups_invited`, `signups_active`, `avg_lead_score`

### TypeScript Types

Located in `src/types/database.ts`:

- `WaitlistStatus`: Status enum type
- `WaitlistUser`: Full waitlist row type
- `Campaign`: Campaign row type
- `CampaignSignupStats`: View row type
- `DashboardStats`: Aggregated stats type

## Environment Variables

```bash
# Supabase (same instance as landing-page: fslmfiqbhziayxxfsrpz)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

## Route Structure

| Route        | Description                                      |
| ------------ | ------------------------------------------------ |
| `/`          | Redirects to `/dashboard`                        |
| `/dashboard` | KPI stats, signup funnel, recent signups         |
| `/crm`       | Waitlist user table with search + status filters |
| `/campaigns` | Campaign performance cards from view             |
| `/settings`  | Supabase config, workflow visualization (static) |

## Port Configuration

- **Backoffice:** 3001
- **Studio:** 3000 (external)
- **Landing Page:** 3002 (external)

## Scope

**In scope:**

- CRM: View, filter, search waitlist users
- Campaigns: View campaign performance
- Dashboard: Funnel metrics, recent signups
- Settings: Connection config, workflow reference

**Out of scope:**

- Write operations (status updates, campaign CRUD — planned next)
- Billing, Shopify integration
- Public API, multi-tenant support
- i18n
