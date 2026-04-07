# Changelog

All notable changes to this project will be documented in this file.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Changed

- `lib/content/` (15 files) merged into `lib/data/` — all section text, navigation, llms routes, atelier configs, and type definitions now live in a single canonical data directory
- `lib/motion.ts` → `lib/data/motion.ts` — animation presets colocated with other static data
- `lib/tokens.ts` → `lib/data/tokens.ts` — design tokens colocated with other static data
- All `@/lib/content/` and `@/lib/motion` import paths updated across 20+ consumers

### Added

- `AtelierForm` component (`components/sections/waitlist/atelier-form.tsx`) — shadcn Drawer wrapper around `AtelierInvitationForm`; accepts optional `trigger` prop; uses `useToggle` from `@uidotdev/usehooks` for open state; `DataManager` for bulk card translation access
- `components/sections/waitlist/index.ts` barrel export
- `__spec__/components/sections/waitlist/atelier-form.test.tsx` — 4 unit tests covering render, drawer content, header, and custom trigger
- `CHANGELOG.md` — Keep a Changelog format adopted

### Changed

- `DataManagerWithExtras` generic constrained to `TRaw extends object` — resolves TS2698 spread errors in tests and improves type safety
- `lib/data/atelier-form-data.ts` — static ICONS, SLIDE_VARIANTS, SLIDE_TRANSITION extracted from form component
- `components/sections/atelier-invitation/atelier-invitation-form.tsx` — refactored to use `DataManager<RawStepTranslation>` replacing ~90 lines of manual `t()` calls
