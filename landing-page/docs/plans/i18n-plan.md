# ANAQIO — i18n / l10n Implementation Plan

**Branch:** `feature/i18n` (from `develop`)
**Target locales:** `en-US` (default) · `fr-FR` · `ar-MA`
**Extracted strings:** `i18n/strings.csv` (152 keys)

---

## 1. Library Choice — `next-intl`

**Recommended:** [`next-intl`](https://next-intl-docs.vercel.app/)

| Factor                  | next-intl | next-i18next | lingui |
| ----------------------- | --------- | ------------ | ------ |
| App Router native       | ✅        | ⚠️           | ✅     |
| RSC / Server components | ✅        | ❌           | ✅     |
| Bundle size             | ~18 KB    | ~50 KB       | ~12 KB |
| RTL support             | Built-in  | Manual       | Manual |
| ICU plurals             | ✅        | ✅           | ✅     |
| Middleware routing      | ✅        | ✅           | ❌     |

**Install:**

```bash
bun add next-intl
```

---

## 2. Directory Structure (post-migration)

```
justwaitit/
├── messages/
│   ├── en-US.json          # Source of truth
│   ├── fr-FR.json
│   └── ar-MA.json
├── i18n/
│   ├── config.ts           # Locale definitions
│   ├── routing.ts          # createNavigation() routing
│   └── request.ts          # getRequestConfig()
├── app/
│   └── [locale]/           # Locale-prefixed App Router segment
│       ├── layout.tsx      # NextIntlClientProvider + dir="rtl"
│       ├── page.tsx
│       ├── about/
│       ├── contact/
│       ├── auth/
│       └── ...
├── middleware.ts            # Locale detection & redirect
└── next.config.ts          # withNextIntl() plugin
```

---

## 3. Core Config Files

### `i18n/config.ts`

```ts
export const locales = ['en-US', 'fr-FR', 'ar-MA'] as const;
export const defaultLocale = 'en-US' as const;
export type Locale = (typeof locales)[number];

export const rtlLocales: Locale[] = ['ar-MA'];
export const isRTL = (locale: Locale) => rtlLocales.includes(locale);

export const localeLabels: Record<Locale, string> = {
  'en-US': 'English',
  'fr-FR': 'Français',
  'ar-MA': 'العربية',
};
```

### `i18n/routing.ts`

```ts
import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';
import { locales, defaultLocale } from './config';

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'always', // /en/... /fr/... /ar/...
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
```

### `i18n/request.ts`

```ts
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

### `middleware.ts`

```ts
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
```

---

## 4. Message File Structure (`messages/en-US.json`)

Derived from `i18n/strings.csv`. Grouped by feature domain:

```json
{
  "header": {
    "nav": {
      "about": "About",
      "brand": "Brand",
      "contact": "Contact",
      "legal": "Legal",
      "terms": "Terms of Service",
      "privacy": "Privacy Policy",
      "cookies": "Cookie Policy",
      "legalMentions": "Legal Mentions"
    },
    "button": { "waitlist": "Join Waitlist" },
    "logo": { "aria": "Anaqio Home" },
    "menu": { "aria": "Toggle menu" }
  },
  "footer": {
    "desc": "Your Digital Atelier...",
    "copyright": "© 2026 Anaqio",
    "rights": "All rights reserved.",
    "platform": {
      "title": "Platform",
      "studio": "AI Studio",
      "lookbook": "Lookbook Generator",
      "tryon": "Virtual Try-On",
      "pricing": "Pricing"
    },
    "resources": {
      "title": "Resources",
      "brand": "Brand",
      "blog": "Blog",
      "help": "Help Center"
    },
    "company": {
      "title": "Company",
      "about": "About",
      "early": "Early Access",
      "badge": "JOIN"
    }
  },
  "loading": {
    "tagline": "Digital Atelier",
    "stages": {
      "initializing": "Initializing",
      "assets": "Loading assets",
      "rendering": "Rendering",
      "studio": "Preparing studio",
      "ready": "Ready"
    }
  },
  "comingSoon": {
    "hero": {
      "tagline": "Coming Soon",
      "main": "ANAQIO is an AI-Driven Virtual built for Fashion Commerce.",
      "sub1": "Generate lookbooks, swap backgrounds, adjust lighting, and produce cinematic collections.",
      "sub2": "— all from a single shot."
    },
    "form": {
      "email": { "placeholder": "Enter your email", "aria": "Email address" },
      "button": { "submit": "Notify me", "pending": "Sending..." },
      "terms": "By joining, you agree to our Terms and Privacy Policy."
    },
    "footer": {
      "launch": "Launching Q3 2026 · Casablanca",
      "copyright": "Anaqio © 2026"
    }
  },
  "about": {
    "hero": {
      "label": "ANAQIO · AI Visual Studio",
      "title": "Fashion, Reimagined.",
      "desc": "The AI-powered visual studio giving Moroccan fashion brands the infrastructure to produce studio-quality imagery — without a studio.",
      "founded": "Est. 2026",
      "location": "Casablanca, Morocco",
      "launch": "Launching Q3 2026"
    },
    "problem": {
      "overline": "The Problem",
      "title": "The broken studio pipeline.",
      "desc": "Every fashion shoot in Morocco means renting a space..."
    },
    "solution": {
      "overline": "The Solution",
      "title": "One workspace. Infinite looks.",
      "desc": "Upload your garments, models, or brand assets..."
    },
    "workflow": {
      "upload": {
        "step": "01 — Upload",
        "title": "Upload",
        "desc": "Drop in your garments, models, or raw assets."
      },
      "generate": {
        "step": "02 — Generate",
        "title": "Generate",
        "desc": "AI composes studio-quality scenes in minutes."
      },
      "export": {
        "step": "03 — Export",
        "title": "Export",
        "desc": "Download lookbooks, videos, or individual shots."
      }
    },
    "morocco": {
      "quote": "Morocco has one of the richest fashion cultures in the world. It deserves world-class tools.",
      "attr": "— Anaqio, Casablanca 2026"
    },
    "team": {
      "overline": "Founding Team",
      "title": "Two founders, one mission.",
      "desc": "Built by people who believe Moroccan fashion deserves the same creative infrastructure as the global luxury market."
    },
    "cta": {
      "overline": "Early Access",
      "title": "Join the first wave.",
      "desc": "We're onboarding select fashion brands ahead of our Q3 2026 launch. Get in early.",
      "primary": "Join the waitlist",
      "secondary": "Contact us"
    }
  },
  "auth": {
    "login": {
      "title": "Welcome back",
      "desc": "Sign in to your Anaqio studio account",
      "email": { "label": "Email", "placeholder": "name@company.com" },
      "password": { "label": "Password" },
      "forgot": "Forgot password?",
      "submit": "Sign In",
      "submitPending": "Authenticating...",
      "signupIntro": "New to Anaqio?",
      "signupLink": "Create an account"
    },
    "signup": {
      "title": "Join Anaqio",
      "desc": "Create your studio account to get started",
      "passwordRepeat": { "label": "Repeat Password" },
      "submit": "Create Account",
      "submitPending": "Provisioning Account...",
      "loginIntro": "Already have an account?",
      "loginLink": "Sign in"
    },
    "forgot": {
      "title": "Recover Access",
      "desc": "Enter your email to receive recovery instructions",
      "submit": "Recover Password",
      "submitPending": "Sending Link...",
      "success": {
        "title": "Check Your Inbox",
        "desc": "Password reset instructions sent",
        "msg": "If you have an account registered with that email, you will receive a link to securely reset your credentials shortly."
      },
      "back": "Back to Sign In"
    }
  }
}
```

---

## 5. Routing — Locale-Prefixed URLs

| Current    | After migration       |
| ---------- | --------------------- |
| `/`        | `/en` → `/fr` → `/ar` |
| `/about`   | `/en/about`           |
| `/contact` | `/fr/contact`         |
| `/terms`   | `/ar/terms`           |

**Root layout** (`app/[locale]/layout.tsx`):

```tsx
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { locales, isRTL, type Locale } from '@/i18n/config';

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();

  const messages = await getMessages();
  const dir = isRTL(locale as Locale) ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

---

## 6. RTL Support for `ar-MA`

### Tailwind RTL modifiers

```tsx
// Flex row reverses in RTL
<div className="flex rtl:flex-row-reverse gap-4">
  <Icon />
  <span>Label</span>
</div>

// Text align
<p className="text-left rtl:text-right">...</p>

// Margin/padding (prefer logical properties)
<div className="ms-4">  {/* margin-inline-start */}
<div className="pe-6">  {/* padding-inline-end */}
```

### CSS logical properties in `globals.css`

```css
/* Replace physical with logical */
.section-padding {
  padding-inline: 1rem; /* instead of padding-left/right */
  padding-block: 2rem; /* instead of padding-top/bottom */
}
```

### Enable Tailwind RTL variant

```ts
// tailwind.config.ts
export default {
  // Already supported in Tailwind v3+ via dir="rtl" on <html>
};
```

---

## 7. Font Strategy for Arabic

**Current fonts** (Latin-only):

- `Cormorant` — display/editorial
- `DM Sans` — UI/body
- `Instrument Serif` — editorial accents

**Add for `ar-MA`** in `app/[locale]/layout.tsx`:

```ts
import { Noto_Sans_Arabic } from 'next/font/google';

const notoArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-arabic',
  display: 'swap',
});
```

**Apply via CSS:**

```css
:lang(ar) {
  font-family: var(--font-arabic), system-ui, sans-serif;
}

/* Keep Cormorant for display headings (brand consistency) */
:lang(ar) .font-display {
  font-family: var(--font-arabic), serif;
}
```

---

## 8. Component Migration Pattern

**Before (hardcoded):**

```tsx
<h2>Fashion, Reimagined.</h2>
<p>The AI-powered visual studio...</p>
```

**After (server component):**

```tsx
import { getTranslations } from 'next-intl/server';

export default async function AboutHero() {
  const t = await getTranslations('about.hero');
  return (
    <>
      <h2>{t('title')}</h2>
      <p>{t('desc')}</p>
    </>
  );
}
```

**After (client component):**

```tsx
'use client';
import { useTranslations } from 'next-intl';

export function Header() {
  const t = useTranslations('header');
  return <nav aria-label={t('nav.aria')}>...</nav>;
}
```

---

## 9. SEO — `hreflang` Tags

Add to every page's `generateMetadata()`:

```ts
export async function generateMetadata({ params }) {
  const { locale } = await params;
  return {
    alternates: {
      languages: {
        'x-default': 'https://anaqio.com/en',
        'en-US': 'https://anaqio.com/en',
        'fr-FR': 'https://anaqio.com/fr',
        'ar-MA': 'https://anaqio.com/ar',
      },
    },
  };
}
```

---

## 10. Locale Switcher Component

```tsx
// components/locale-switcher.tsx
'use client';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { locales, localeLabels, isRTL, type Locale } from '@/i18n/config';

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-2">
      {locales.map((loc) => (
        <button
          key={loc}
          onClick={() => router.replace(pathname, { locale: loc })}
          aria-current={loc === locale ? 'true' : undefined}
          dir={isRTL(loc) ? 'rtl' : 'ltr'}
          className={loc === locale ? 'text-aq-blue' : 'text-muted-foreground'}
        >
          {localeLabels[loc]}
        </button>
      ))}
    </div>
  );
}
```

---

## 11. Migration Checklist

### Week 1 — Setup

- [ ] Create `feature/i18n` branch from `develop`
- [ ] `bun add next-intl`
- [ ] Create `i18n/config.ts`, `i18n/routing.ts`, `i18n/request.ts`
- [ ] Create `middleware.ts`
- [ ] Generate `messages/en-US.json` from `i18n/strings.csv`
- [ ] Translate `messages/fr-FR.json` and `messages/ar-MA.json`
- [ ] Update `next.config.ts` with `withNextIntl()`

### Week 2–3 — Routing

- [ ] Move `app/` content into `app/[locale]/`
- [ ] Update `layout.tsx` with `NextIntlClientProvider` + `dir` attribute
- [ ] Add `generateStaticParams()` to every layout

### Week 3–4 — Component Refactoring

- [ ] `components/layout/Header.tsx` → `useTranslations('header')`
- [ ] `components/layout/Footer.tsx` → `useTranslations('footer')`
- [ ] `app/[locale]/about/about-content.tsx` → `useTranslations('about')`
- [ ] `components/sections/ComingSoonPage.tsx` → `useTranslations('comingSoon')`
- [ ] `lib/loading-stages.ts` → export keys only, translate in components
- [ ] All auth forms → `useTranslations('auth')`
- [ ] Add `LocaleSwitcher` to `Header`

### Week 4–5 — Metadata & SEO

- [ ] Update `generateMetadata()` in each page to use `getTranslations()`
- [ ] Add `alternates.languages` to all pages
- [ ] Add `x-default` hreflang

### Week 5–6 — Testing & QA

- [ ] Playwright: navigate locale switcher, verify content per locale
- [ ] RTL smoke tests: dir="rtl", button positions, form layouts
- [ ] Font rendering QA for Noto Arabic on mobile
- [ ] Core Web Vitals per locale (check for CLS in RTL)
- [ ] Deploy to staging → gather native speaker feedback
- [ ] Production deploy

---

## 12. Performance Notes

- **Message splitting:** next-intl loads only the active locale's JSON — no bundle bloat
- **Static generation:** `generateStaticParams()` pre-renders all locale variants at build time
- **Font loading:** Noto Sans Arabic ~80 KB woff2; use `display: swap` and `preload`
- **Bundle impact:** next-intl adds ~18 KB gzipped to client bundle

---

## 13. Common Pitfalls

| Pitfall                           | Fix                                                                                      |
| --------------------------------- | ---------------------------------------------------------------------------------------- |
| Hardcoded strings in RSC          | Use `getTranslations()` from `next-intl/server`                                          |
| Missing hreflang                  | Add `alternates.languages` to every `generateMetadata()`                                 |
| RTL layout breakage               | Replace physical CSS (`margin-left`) with logical (`margin-inline-start`)                |
| Arabic numerals in dates          | Use `Intl.DateTimeFormat` with locale; or set `numberingSystem: 'latn'`                  |
| Plural forms (`1 item / 2 items`) | ICU syntax: `t('count', { count })` with `{count, plural, one {# item} other {# items}}` |
| Missing Arabic glyphs             | Always include Noto Sans Arabic as font fallback for `ar-MA`                             |
| Locale detection loop             | Ensure middleware `matcher` excludes `api/`, `_next/`, static files                      |

---

_Generated: March 2026 · 152 string keys extracted across 14 files_
