# Platform TODO — Audit Fixes

> Generated from full monorepo audit on 2026-04-17.
> Scope: only issues detected in the audit. No new features.
> Verified against repo state on 2026-04-17. Items already completed in code are marked `[x]`.

---

## P0 — Fix Now (4 items, no blockers)

These are independent quick fixes. Can be done in any order.

- [x] **T-01** Remove accidental `"backoffice"` npm dependency
  - File: `applications/backoffice/package.json` line 37
  - Action: delete `"backoffice": "^4.4.0"` from dependencies, run `bun install`
  - Risk: none
  - Effort: 1 min

- [x] **T-02** Fix `public.events` FK → `landing.campaigns`
  - File: `supabase/migrations/20260408000001_backoffice_events.sql` line 21
  - Action: change `references public.campaigns(id)` → `references landing.campaigns(id)`
  - Risk: production already has this applied manually; migration file fix only affects `db reset`
  - Effort: 5 min

- [x] **T-03** Fix backoffice browser client schema (`landing` → default `public`)
  - File: `applications/backoffice/src/lib/supabase/client.ts` line 7
  - Action: remove `{ schema: 'landing' }` or change to `{ schema: 'public' }` (public is default)
  - Risk: low — backoffice CRM reads `public.*` views
  - Effort: 2 min

- [x] **T-04** Fix port swap (studio ↔ landing-page)
  - Files:
    - `applications/studio/package.json` → change `"dev": "next dev -p 3002"` to `"dev": "next dev -p 3000"`
    - `applications/landing-page/package.json` → change `"dev": "next dev -p 3000"` to `"dev": "next dev -p 3002"`
  - Verify: `supabase/config.toml` `site_url` already points to `:3000` (which will be studio — correct after fix)
  - Risk: developers must restart dev servers after
  - Effort: 5 min

---

## P1 — Fix This Week (4 items)

### Independent (no dependencies)

- [x] **T-05** Add `db` to commitlint allowed types
  - File: `commitlint.config.mjs`
  - Action: extend config to allow `db` type alongside the conventional ones
  - Depends on: nothing
  - Effort: 2 min

- [x] **T-06** Add `test` step to CI workflows
  - Files: `.github/workflows/ci.yml`, `.github/workflows/main.yml`
  - Action: add `test` to the `turbo run lint type-check build` command
  - Depends on: nothing
  - Effort: 5 min

### Requires decision

- [x] **T-07** Unify Prettier config across apps
  - Problem: studio (no semi, 100 width, trailingComma: all) vs landing-page (semi, 80 width, trailingComma: es5) vs doc claims (no semi, 100 width, es5)
  - **Decision: Option A** → `semi: false`, `printWidth: 100`, `trailingComma: es5`
  - Then update: landing-page `.prettierrc`, studio `.prettierrc`, AGENTS.md
  - Depends on: nothing (decided)
  - Risk: large git diff from reformatting — commit separately
  - Effort: 15 min + reformat

- [x] **T-08** Replace `tailwindcss-animate` with `tw-animate-css` in landing-page
  - Files: `applications/landing-page/package.json`, `applications/landing-page/tailwind.config.ts`
  - Action: uninstall `tailwindcss-animate`, install `tw-animate-css`, update config accordingly
  - Depends on: nothing (but note landing-page is still Tailwind v3 — `tw-animate-css` import style differs)
  - Risk: animation classes may need updating if API differs
  - Effort: 30 min

---

## P2 — This Quarter (5 items)

These are larger efforts. Listed by dependency order.

- [ ] **T-09** Migrate landing-page from Tailwind v3 → v4
  - Prereq: T-08 must be done first (removes v3-only plugin)
  - Scope: remove `tailwind.config.ts`, move theme to `@theme` in `globals.css`, update to CSS-first config
  - Risk: largest change — all class names should still work, but custom theme tokens need porting
  - Effort: 2–4 hours
  - Depends on: **T-08**

- [ ] **T-10** Migrate shadcn/ui components off `forwardRef` (R-06)
  - 42+ components across studio + landing-page + `packages/ui`
  - Action: convert `React.forwardRef<El, Props>((props, ref) => ...)` to `function Component({ ref, ...props }: Props & { ref?: React.Ref<El> })`
  - Can be done app-by-app
  - Risk: low — React 19 supports both patterns, so no runtime breakage
  - Effort: 2–3 hours
  - Depends on: nothing (but nice to batch after T-09 to avoid double-touching landing-page)

- [x] **T-11** Decide fate of `@anaqio/ui` and `@anaqio/schemas` packages
  - Both exist in `packages/` but no app imports them
  - **Decision: Option A** — Wire apps to use them (add to `package.json` dependencies, replace local copies)
  - Depends on: nothing (decided)
  - Effort: 1 hour

- [x] **T-12** Update all agent context docs with actual package list
  - Files: `AGENTS.md`, `CLAUDE.md`, `QWEN.md`, `README.md`
  - Action: add `@anaqio/ui` and `@anaqio/schemas` to shared packages table (or remove if T-11 goes with Option B)
  - Depends on: **T-11**
  - Effort: 30 min

- [x] **T-13** Fix CODEOWNERS to match intent
  - File: `.github/CODEOWNERS` line 18
  - Comment says "Amal reviews" but assigns `@moughamir`
  - **Decision: Moughamir** — fix the comment to match the assignment
  - Depends on: nothing (decided)
  - Effort: 2 min

---

## P3 — Backlog (5 items, no urgency)

- [x] **T-14** Fix `db:types` placeholder in studio `package.json`
  - Replace `<ref>` with actual Supabase project ref
  - Effort: 5 min (needs the project ref value)

- [x] **T-15** Consolidate `cn()` implementations
  - 3 copies: `packages/utils/src/cn.ts`, `packages/ui/src/cn.ts`, and per-app `lib/utils/cn.ts`
  - Action: single source in `@anaqio/utils/cn`, re-export in apps
  - Effort: 15 min

- [x] **T-16** Clean up stale files in landing-page
  - `applications/landing-page/error.txt` — debug log
  - `applications/landing-page/resume.txt` — temp file
  - `applications/landing-page/skills-lock.json` — AI lock file (gitignore?)
  - Effort: 5 min

- [x] **T-17** Resolve `studio/supabase/` subdirectory
  - `applications/studio/supabase/` exists alongside root `supabase/` (the canonical one)
  - Action: delete if legacy, or document its purpose
  - Effort: 5 min

- [ ] **T-18** Add env secrets to CI for build step
  - `.github/workflows/ci.yml` and `main.yml` don't inject `SUPABASE_SERVICE_ROLE_KEY`, `GOOGLE_AI_API_KEY`, etc.
  - Action: add as GitHub secrets and inject in workflow env
  - Effort: 15 min

---

## Dependency Graph

```
T-01 ─┐
T-02 ─┤
T-03 ─┼─ (all independent, do in any order)
T-04 ─┤
T-05 ─┤
T-06 ─┘

T-07 ──── needs decision (Option A or B)
T-08 ──── T-09 depends on this
T-09 ──── T-10 nice-to-have before (avoid double-touch)
T-10 ──── independent
T-11 ──── T-12 depends on this
T-12 ──── depends on T-11
T-13 ──── needs decision

T-14 through T-18: all independent backlog items
```
