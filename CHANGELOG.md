# Changelog

All notable changes to the Anaqio platform monorepo are documented here.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
Versioning: [Semantic Versioning](https://semver.org/spec/v2.0.0.html)

---

## [Unreleased]

### Added

- Consolidated Supabase project design with multi-schema isolation (`studio`, `landing`, `public`)
- Cross-schema views for backoffice: `user_overview`, `generation_stats`, `campaign_signup_stats`
- `@anaqio/supabase` factories now accept optional `schema` option for per-app schema targeting
- Root `supabase/` directory with consolidated migrations and `config.toml`
- `applications/` directory structure — apps moved from root for cleaner monorepo separation
- `README.md`, `LICENSE`, `CHANGELOG.md`, `CONTRIBUTING.md`, `CODEOWNERS`

---

## [0.3.0] — 2026-04-07

### Added

- GitHub CI workflows: PR quality gate (`ci.yml`) + merge-to-main full build (`main.yml`)
- Root-level DX tooling: Husky v9, commitlint (`@commitlint/config-conventional`), lint-staged (prettier-only pre-commit)
- `.editorconfig` for cross-editor baseline consistency
- GitHub PR template and issue templates (bug report, feature request)
- Turborepo Remote Cache linked to Vercel (`psycholium` scope)

### Changed

- Unified git history: per-app `.git` dirs removed, all apps tracked under monorepo root
- Root `.gitignore` expanded to cover full Next.js + monorepo artifacts
- Workspace scripts: `prepare: husky` at root level; per-app Husky removed

### Removed

- Per-app Husky configs (`studio/.husky/`, `landing-page/.husky/`)
- Per-app `bun.lock` files (root lockfile is authoritative in Bun workspaces)
- `.kodo/` from version control (contains API key — now in `.gitignore`)

---

## [0.2.0] — 2026-04-04

### Added

- Bun workspaces monorepo with Turborepo orchestration
- Shared packages: `@anaqio/tsconfig`, `@anaqio/eslint-config`, `@anaqio/utils`, `@anaqio/supabase`
- `packages/supabase`: browser / server / admin client factories (3-client pattern)
- Root `turbo.json` pipeline: build, dev, lint, type-check, test, clean
- Root `.prettierrc` as canonical formatting config

---

## [0.1.0] — 2026-03-01

### Added

- Initial workspace: `studio/`, `landing-page/`, `backoffice/` as independent Next.js apps
- Supabase integration in each app (waitlist, generations, profiles)
- Tailwind CSS v4 + shadcn/ui across all apps
