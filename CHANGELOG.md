# Changelog

All notable changes to the com.anaqio workspace are documented here.
See individual app changelogs for app-level changes.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)

## [Unreleased]

### Added
- Bun workspaces monorepo setup at workspace root
- Turborepo pipeline for build/lint/test/type-check orchestration with caching
- Shared packages: `@anaqio/tsconfig`, `@anaqio/eslint-config`, `@anaqio/utils`, `@anaqio/supabase`
- Canonical `.prettierrc` standardizing formatting across all apps (semi: false, width: 100)
- Root `.gitignore` covering Turborepo cache, workspace node_modules, lockfile
