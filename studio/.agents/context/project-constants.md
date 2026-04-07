# context: project-constants

# Static values — load instead of asking user or searching the codebase

## SUPABASE (psycholium account)

```
Project ref:    [set after project creation]
Dashboard:      https://supabase.com/dashboard/project/<ref>
Env var names:  NEXT_PUBLIC_SUPABASE_URL
                NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
                SUPABASE_SERVICE_ROLE_KEY
Migration dir:  supabase/migrations/
Tables:         profiles · preset_models · generations
Storage:        garments (private) · outputs (private) · presets (public)
Realtime:       generations table on supabase_realtime publication
```

## VERCEL

```
Production:     studio.anaqio.com
Staging:        stage.anaqio.com  (preview branch)
Main domain:    anaqio.com (marketing waitlist — do not touch)
Framework:      Next.js (auto-detected)
vercel.json:    { "functions": { "app/api/generate/route.ts": { "maxDuration": 300 } } }
```

## GITHUB

```
Repo:           [set on project init]
Branches:
  main          → production deploys
  staging       → staging deploys
  feat/*        → feature branches
  fix/*         → bugfix branches
```

## JIRA

```
Cloud ID:       d5eeddb2-3289-41c4-9613-4a814d4f282f
Site:           omnizya.atlassian.net
Project key:    SCRUM
Mohamed ID:     712020:a1c14b83-d259-449c-b4ec-ded8add71817
Transitions:    11=To Do  21=In Progress  31=Done
```

## CONFLUENCE

```
Space:          AIS (ID: 2621445)
Parent page:    6914049
Cloud ID:       same as Jira
```

## DEADLINES

```
Feature freeze: March 28, 2026
Expo 1:         April 2–5   — Morocco Fashion & Tex, Casablanca
Expo 2:         April 7–9   — GITEX Africa, Casablanca
```

## NPM SCRIPTS (package.json)

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "type-check": "tsc --noEmit",
  "test": "vitest run",
  "test:watch": "vitest",
  "test:coverage": "vitest --coverage",
  "test:e2e": "playwright test",
  "db:types": "supabase gen types typescript --project-id <ref> > types/supabase.ts",
  "db:push": "supabase db push",
  "db:reset": "supabase db reset"
}
```

## LOCKED PACKAGE VERSIONS

```json
{
  "next": "16.2.0",
  "@supabase/supabase-js": "latest-2.x",
  "@supabase/ssr": "0.9.0",
  "tailwindcss": "latest-4.x",
  "@tailwindcss/postcss": "latest-4.x",
  "tw-animate-css": "latest",
  "react": "19.x",
  "react-dom": "19.x",
  "typescript": "5.x",
  "class-variance-authority": "latest",
  "clsx": "latest",
  "tailwind-merge": "latest",
  "lucide-react": "latest",
  "@gradio/client": "latest",
  "next-themes": "latest",
  "vitest": "latest",
  "@playwright/test": "latest",
  "@testing-library/react": "latest",
  "@testing-library/jest-dom": "latest",
  "@vitejs/plugin-react": "latest",
  "vite-tsconfig-paths": "latest"
}
```

## BRAND

```
Ink     #0F172A  oklch(0.11 0.03 264)
Navy    #1B2F52  oklch(0.22 0.05 264)
Blue    #2563EB  oklch(0.53 0.24 264)  → --primary
Violet  #7C3AED  oklch(0.56 0.27 293)  → --secondary
Gold    #D4AF37  oklch(0.82 0.12 85)   → --accent

Font display:  Syne (weights 400-800)
Font body:     Plus Jakarta Sans (weights 300-700)
Default theme: dark
Locale:        fr-MA (French primary), ar (Arabic secondary)
```
