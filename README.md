# Anaqio Platform

AI-powered fashion commerce for the Moroccan market. Democratizes professional fashion imagery via AI virtual try-on and studio photography — targeting a 90% cost reduction vs traditional photoshoots.

## Monorepo Structure

```
com.anaqio/
├── applications/
│   ├── studio/          # AI Virtual Fashion Studio  →  studio.anaqio.com
│   ├── landing-page/    # Brand site + waitlist      →  anaqio.com
│   └── backoffice/      # Internal CRM + dashboard   →  backoffice.anaqio.com
├── packages/
│   ├── @anaqio/ui          # Shared UI components (shadcn/ui New York style)
│   ├── @anaqio/schemas     # Shared Zod validation schemas
│   ├── @anaqio/supabase    # Supabase client factories (browser / server / admin)
│   ├── @anaqio/utils       # cn() utility (clsx + tailwind-merge)
│   ├── @anaqio/tsconfig    # Shared TypeScript config presets
│   └── @anaqio/eslint-config  # Shared ESLint flat config
├── supabase/            # Consolidated DB migrations + config
└── docs/                # Company OS, ADRs, strategy docs
```

**Runtime:** Bun · **Orchestration:** Turborepo · **Framework:** Next.js 16 (App Router) · **Database:** Supabase (single project, multi-schema)

## Quick Start

```bash
# Install all workspace dependencies
bun install

# Run all apps in parallel
TURBO_TELEMETRY_DISABLED=1 bunx turbo run dev

# Or run a single app
TURBO_TELEMETRY_DISABLED=1 bunx turbo run dev --filter=studio
```

Default ports: `studio` → 3000 · `backoffice` → 3001 · `landing-page` → 3002

## Environment Setup

Each app has a `.env.example` — copy to `.env.local` and fill in secrets.

Shared env vars across apps:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY   # studio
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY  # landing-page + backoffice
SUPABASE_SERVICE_ROLE_KEY
```

See each app's `CLAUDE.md` for its full env var list.

## Workspace Commands

```bash
# Quality checks across all apps
TURBO_TELEMETRY_DISABLED=1 bunx turbo run lint
TURBO_TELEMETRY_DISABLED=1 bunx turbo run type-check
TURBO_TELEMETRY_DISABLED=1 bunx turbo run build
TURBO_TELEMETRY_DISABLED=1 bunx turbo run test

# Filter to one app
TURBO_TELEMETRY_DISABLED=1 bunx turbo run build --filter=studio

# Format everything
bun run format

# Full clean
bun run clean
```

## Database

Single Supabase project with isolated schemas:

| Schema    | Owned by     | Key tables                                     |
| --------- | ------------ | ---------------------------------------------- |
| `studio`  | studio app   | `profiles`, `preset_models`, `generations`     |
| `landing` | landing-page | `waitlist`, `campaigns`, `contact_submissions` |
| `public`  | shared       | Cross-schema views for backoffice              |

Migrations live in `supabase/migrations/`. Run locally with `supabase start` from the `supabase/` directory.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE) © 2026 Anaqio Inc.
