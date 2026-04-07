# i18n Implementation Tasks — ANAQIO

Branch: `feature/i18n` · PR: [#17](https://github.com/anaqio/justwaitit/pull/17)

---

## Phase 1 — Foundation ✅

> Install next-intl, configure routing, scaffold locale files, and wire up the app shell.

- [x] Install `next-intl@4.8.3`
- [x] Create `i18n/config.ts` — define `locales` (`en-US`, `fr-FR`, `ar-MA`) and `defaultLocale`
- [x] Create `i18n/routing.ts` — `defineRouting` + `createNavigation` (exports `Link`, `redirect`, `useRouter`, `usePathname`)
- [x] Create `i18n/request.ts` — `getRequestConfig` with `getMessages` per locale
- [x] Create `middleware.ts` — next-intl locale detection and prefix routing (`localePrefix: 'always'`)
- [x] Restructure pages under `app/[locale]/`
- [x] Update root `app/layout.tsx` to `app/[locale]/layout.tsx` with `NextIntlClientProvider`
- [x] Add `generateStaticParams` for locale segments
- [x] Scaffold `messages/en-US.json`, `messages/fr-FR.json`, `messages/ar-MA.json`
- [x] Configure RTL support — `dir={locale === 'ar-MA' ? 'rtl' : 'ltr'}` on `<html>`
- [x] Add Noto Sans Arabic font for `ar-MA`
- [x] Update `next.config.ts` with `next-intl` plugin
- [x] Remove stale `pnpm-lock.yaml`

---

## Phase 2 — Auth & Protected Pages ✅

> Migrate authentication flow and protected workspace to next-intl.

- [x] `components/login-form.tsx` — `useTranslations('auth.login')`, locale-aware `useRouter`
- [x] `components/sign-up-form.tsx` — `useTranslations('auth.signup')`, locale-aware `useRouter`
- [x] `components/forgot-password-form.tsx` — `useTranslations('auth.forgot')`, locale-aware `useRouter`
- [x] `components/update-password-form.tsx` — `useTranslations('auth.update')`, locale-aware `useRouter`
- [x] `components/logout-button.tsx` — `useTranslations('auth.button')`, `useRouter` from `@/i18n/routing`
- [x] `components/auth-button.tsx` — async RSC, `getTranslations('auth.button')`, ICU interpolation for greeting, locale-aware `Link`
- [x] `app/[locale]/auth/layout.tsx` — async RSC, footer copyright with `getTranslations('footer')`, locale-aware `Link`
- [x] `app/[locale]/protected/layout.tsx` — async RSC, `getTranslations('protected')` + `getTranslations('footer')`, locale-aware `Link`
- [x] `app/[locale]/protected/page.tsx` — keep `redirect` from `next/navigation` (middleware handles locale)
- [x] Add `auth.login`, `auth.signup`, `auth.forgot`, `auth.update`, `auth.button` namespaces to all 3 locale files

---

## Phase 3 — Content Pages ✅

> Migrate marketing and informational pages to next-intl.

- [x] `app/[locale]/about/page.tsx` — `generateMetadata` with `getTranslations`, hreflang alternates, JSON-LD
- [x] `app/[locale]/about/about-content.tsx` — `useTranslations('about')`, `founders` array moved inside component, split-title keys (`titleLine1`/`titleLine2`), RTL back-arrow (`rtl:rotate-180`)
- [x] `components/layout/AboutScrollNav.tsx` — `useTranslations('scrollNav')`, section IDs mapped to translation keys
- [x] `app/[locale]/contact/page.tsx` — `generateMetadata`, `getTranslations('contact')` + `getTranslations('social')`, JSON-LD, locale-aware `Link`
- [x] `app/[locale]/not-found.tsx` — `'use client'`, `useTranslations('notFound')`, locale-aware `Link`
- [x] `app/[locale]/early-access/early-access-content.tsx` — `useTranslations('earlyAccess')`, badge, hero, stats, CTA, disclaimer; locale-aware `Link`
- [x] `app/[locale]/early-access/page.tsx` — `generateMetadata` with `getTranslations`
- [x] `app/[locale]/brand/brand-content.tsx` — locale-aware `Link`
- [x] Add `about`, `contact`, `scrollNav`, `notFound`, `earlyAccess` namespaces to all 3 locale files

---

## Phase 4 — Legal Pages ✅

> Convert static metadata to async generateMetadata on all legal pages.

- [x] `app/[locale]/terms/page.tsx` — `generateMetadata`, locale-aware `Link` (privacy cross-link)
- [x] `app/[locale]/privacy/page.tsx` — `generateMetadata`
- [x] `app/[locale]/cookies/page.tsx` — `generateMetadata`
- [x] `app/[locale]/legal-mentions/page.tsx` — `generateMetadata` (preserves `robots: noindex`)
- [x] Add `meta.terms`, `meta.privacy`, `meta.cookies`, `meta.legal` to all 3 locale files

---

## Phase 5 — UI Utilities ✅

> Migrate shared UI components to locale-aware navigation hooks.

- [x] `components/ui/back-button.tsx` — `useRouter` from `@/i18n/routing` (`.back()` still works)
- [x] `components/ui/view-transition-link.tsx` — `Link` + `useRouter` from `@/i18n/routing`
- [x] `components/ui/NavigationProgress.tsx` — `usePathname` from `@/i18n/routing`

---

## Phase 6 — Sitemap & SEO ✅

> Generate locale-specific sitemap entries for all routes.

- [x] `app/sitemap.ts` — `locales.flatMap()` generates 24 entries (3 locales × 8 routes)
- [x] Routes: `/`, `/early-access`, `/brand`, `/about`, `/contact`, `/terms`, `/privacy`, `/cookies`
- [x] `getBaseUrl()` reads `NEXT_PUBLIC_APP_URL` → `VERCEL_URL` → `https://anaqio.com`

---

## Phase 7 — Loading & Theming ✅

> Translate the animated loading screen.

- [x] `lib/loading-stages.ts` — rename `label` → `key` on each stage; export `LoadingStageKey` type
- [x] `components/sections/LoadingScreen.tsx` — `useTranslations('loading')`, tagline from `t('tagline')`, stage labels from ``t(`stages.${stage.key}`)``
- [x] Add `loading.tagline` + `loading.stages.*` keys to all 3 locale files

---

## Phase 8 — WaitlistSection ✅

> Add locale-aware links and translated disclaimer to the waitlist signup form.

- [x] `components/sections/WaitlistSection.tsx` — `useTranslations('waitlist')`, disclaimer text (`prefix`, `terms`, `and`, `privacy` keys), locale-aware `Link`
- [x] Add `waitlist.disclaimer` namespace to all 3 locale files

---

## Phase 9 — Landing Page Sections ✅

> Migrate all `lib/content/*.ts` static TypeScript objects to `messages/*.json` under `landing.*` namespace. Replace content imports with `useTranslations` in all section components.

- [x] Add `landing.hero` keys + `waitlist.headline/formHeadline/formSubline` to all 3 locale files
- [x] Add `landing.problem` keys to all 3 locale files
- [x] Add `landing.solution` keys (incl. stat comparison) to all 3 locale files
- [x] Add `landing.howItWorks` keys to all 3 locale files
- [x] Add `landing.whyAnaqio` keys to all 3 locale files
- [x] Add `landing.whoItsFor` keys (incl. features array) to all 3 locale files
- [x] Add `landing.vision` keys to all 3 locale files
- [x] Add `landing.philosophy` keys to all 3 locale files
- [x] Add `landing.finalCta` keys to all 3 locale files
- [x] `components/sections/HeroSection.tsx` — `useTranslations('landing.hero')`, char-split animation preserved
- [x] `components/sections/SupportLine.tsx` — `useTranslations('landing.hero')`, `t.raw('supportLine.words')` for rotating words
- [x] `components/sections/ProblemSection.tsx` — `useTranslations('landing.problem')`, icons kept in component via `PAIN_ICONS` array + `t.raw('painPoints')`
- [x] `components/sections/SolutionSection.tsx` — `useTranslations('landing.solution')`, `PIPELINE_COLORS` merged with `t.raw('pipeline')`; stat comparison labels translated
- [x] `components/sections/HowItWorksSection.tsx` — `useTranslations('landing.howItWorks')`, `t.raw('steps')` array
- [x] `components/sections/WhyAnaqioSection.tsx` — `useTranslations('landing.whyAnaqio')`, `POINT_ICONS` merged with `t.raw('points')`
- [x] `components/sections/WhoItsForSection.tsx` — `useTranslations('landing.whoItsFor')`, `AUDIENCE_ICONS` merged with `t.raw('audiences')`, `t.raw('features')`
- [x] `components/sections/VisionSection.tsx` — `useTranslations('landing.vision')`, `VISION_ICONS` merged with `t.raw('points')`
- [x] `components/sections/PhilosophySection.tsx` — `useTranslations('landing.philosophy')`, `t('body').split(' ')` for scroll-word animation
- [x] `components/sections/FinalCTA.tsx` — `useTranslations('landing.finalCta')`
- [x] `components/sections/WaitlistSection.tsx` — extended to use `t('headline.*')`, `t('formHeadline')`, `t('formSubline')` (was only using disclaimer)

### icon-array pattern (t.raw)

Icon arrays (lucide-react `LucideIcon` components) cannot be stored in JSON. Pattern used:

```typescript
const POINT_ICONS = [Ruler, Move3D, Sun, Zap, ShieldCheck];
const points = (t.raw('points') as Array<{ title: string; body: string }>).map(
  (p, i) => ({ ...p, icon: POINT_ICONS[i] })
);
```

---

## Phase 10 — Locale Switcher UX + Tests + CSV Export ✅

> Upgrade the locale switcher to a flag-icon dropdown, add a full E2E test suite, and generate a translator-ready CSV.

- [x] `components/locale-switcher.tsx` — redesigned with `LOCALE_META` (flag emoji + 2-letter code); compact trigger `[🇺🇸] [EN] [▾]`; `AnimatePresence` dropdown with `role="listbox"`; outside-click close via `useRef`/`useEffect`; active dot indicator; `data-testid` contract: `locale-switcher`, `locale-switcher-trigger`, `locale-option-{locale}`; `aria-haspopup="listbox"`, `aria-expanded`, `aria-selected` on `<li>`; RTL `dir` preserved per option
- [x] `__tests__/i18n/locale-switcher.test.ts` — 6 Playwright describe suites covering: Component Visibility, Dropdown Interaction, URL Navigation, RTL Support (`dir=rtl` on `<html>`), Active State (`aria-selected`), Accessibility (`aria-haspopup`, `aria-expanded`, keyboard focus)
- [x] `scripts/export-i18n.ts` — Bun CLI: flattens `messages/*.json` → 4-column CSV (`key,en-US,fr-FR,ar-MA`); JSON arrays expanded with indexed keys; proper CSV escaping; run with `bun run export:i18n`
- [x] `i18n/translations.csv` — 346 translation keys × 3 locales; ready to upload to Google Drive for translators
- [x] `package.json` — added `"export:i18n"` script

---

## Remaining / Out of Scope

| File                                         | Reason deferred                                                   |
| -------------------------------------------- | ----------------------------------------------------------------- |
| `app/[locale]/playground/page.tsx`           | Internal dev page, not user-facing                                |
| `components/tutorial/sign-up-user-steps.tsx` | Tutorial demo component, not production UI                        |
| `components/layout/SocialLinks.tsx`          | All hrefs are external URLs (`target="_blank"`), no locale needed |
| `app/[locale]/auth/confirm/route.ts`         | Route handler — `redirect` from `next/navigation` is correct here |
| Legal page body copy (terms, privacy, etc.)  | Legal text is Moroccan law — English is the authoritative version |

---

## Implementation Notes

### app/layout.tsx (Root Shell)

The `app/layout.tsx` file is intentionally kept as a thin shell required by Next.js when using locale-prefixed routing with `app/[locale]/layout.tsx`. It simply renders children without any providers or layout logic.

### Translation Key Structure

All translation keys use camelCase format (e.g., `comingSoon`, `loading.stages`). The CSV file (`i18n/strings.csv`) has been updated to match the actual JSON structure used in the codebase.

### Legal Pages

Legal page body content (terms, privacy, cookies, legal-mentions) remains in English as the authoritative version for Moroccan law. Only metadata titles are translated.

### SocialLinks Component

The `components/layout/SocialLinks.tsx` component contains only external URLs with `target="_blank"` and aria-labels that are platform names (Twitter, Instagram, etc.). No i18n is needed since:

- All hrefs point to external social media URLs
- Icon labels are universal brand names
- Adding translations would add complexity without user-facing benefit

---

## Translation Key Namespaces

| Namespace     | Used in                               |
| ------------- | ------------------------------------- |
| `meta.*`      | All page `generateMetadata` functions |
| `header`      | Header nav, logo aria, menu aria      |
| `footer`      | Footer copyright, links               |
| `auth.login`  | LoginForm                             |
| `auth.signup` | SignUpForm                            |
| `auth.forgot` | ForgotPasswordForm                    |
| `auth.update` | UpdatePasswordForm                    |
| `auth.button` | AuthButton, LogoutButton              |
| `about`       | AboutContent, AboutScrollNav          |
| `contact`     | ContactPage                           |
| `social`      | ContactPage social links              |
| `scrollNav`   | AboutScrollNav                        |
| `loading`     | LoadingScreen                         |
| `notFound`    | not-found.tsx                         |
| `protected`   | ProtectedLayout footer                |
| `earlyAccess` | EarlyAccessContent, early-access page |
| `waitlist`    | WaitlistSection disclaimer            |
| `scrollNav`   | AboutScrollNav section labels         |

---

## Technical Decisions

- **`localePrefix: 'always'`** — every URL is prefixed (`/en-US/about`), no ambiguous root
- **`middleware.ts` is next-intl only** — Supabase auth uses a server-side route handler proxy (`app/[locale]/auth/confirm/route.ts`), not middleware
- **Split-title pattern** — headings use `titleLine1` / `titleLine2` keys to preserve typographic line breaks across locales
- **ICU interpolation** — `t('greeting', { email })` for personalised strings
- **`redirect` from `next/navigation`** — kept in server components that redirect to auth; the middleware handles locale-prefixing on the resulting redirect
