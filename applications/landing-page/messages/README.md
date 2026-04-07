# i18n Structure

This document describes the internationalization (i18n) structure for the Anaqio project.

## Namespace-Based Architecture

The application uses a **namespace-based** i18n structure to organize translations by feature/domain. This approach:

- Improves maintainability by separating concerns
- Enables code-splitting of translation files
- Makes it easier for translators to find context
- Supports Crowdin integration with proper file mapping
- Enables `useTranslations('namespace')` pattern in components

## Directory Structure

```
messages/
├── en/           # English (source language)
│   ├── actions.json
│   ├── about.json
│   ├── common.json
│   ├── earlyAccess.json
│   ├── footer.json
│   ├── header.json
│   ├── landing.json
│   ├── loading.json
│   ├── meta.json
│   ├── scrollNav.json
│   ├── social.json
│   ├── startupProfile.json
│   ├── studio.json
│   └── waitlist.json
├── fr/           # French
│   └── [same namespaces]
└── ar/           # Arabic (RTL)
    └── [same namespaces]
```

## Namespaces

### UI Component Namespaces

#### `header.json`

Header navigation and logo.

- Navigation links (about, brand, contact, legal, etc.)
- CTA buttons
- Logo aria labels
- Menu toggle labels

**Usage:** `useTranslations('header')`

#### `footer.json`

Footer content and links.

- Footer description
- Copyright text
- Platform links
- Resources links
- Company links

**Usage:** `useTranslations('footer')`

#### `scrollNav.json`

Scroll navigation labels for section navigation.

- Section labels (intro, problem, solution, morocco, team, join)

**Usage:** `useTranslations('scrollNav')`

#### `loading.json`

Loading states and messages.

- Loading tagline
- Loading stage messages

**Usage:** `useTranslations('loading')`

#### `social.json`

Social media platform names.

- Twitter/X, Instagram, TikTok, LinkedIn, YouTube, Pinterest

**Usage:** `useTranslations('social')`

#### `actions.json`

Common action buttons and labels.

- submit, cancel, back, continue
- download, generate, upload
- joinWaitlist, earlyAccess
- send, saving, next, previous, skip, confirm

**Usage:** `useTranslations('actions')`

### Page/Feature Namespaces

#### `common.json`

Shared utilities and generic components.

- Newsletter subscription
- Pagination labels
- Search labels
- Filter labels
- Sort options
- Status messages
- Validation messages
- Date formatting

**Usage:** `useTranslations('common')`

#### `meta.json`

SEO metadata and page titles for all routes.

- Page titles
- Meta descriptions

**Usage:** `useTranslations('meta')`

#### `landing.json`

Main landing page content.

- Hero section
- Style showcase
- Problem section
- Solution section
- How it works
- Why Anaqio
- Who it's for
- Vision & philosophy
- Final CTA

**Usage:** `useTranslations('landing')`

#### `about.json`

About page content.

- Hero section
- Problem statement
- Pain points statistics
- Solution overview
- Lookbook gallery
- Workflow steps
- Morocco section
- Team bios
- CTA section

**Usage:** `useTranslations('about')`

#### `waitlist.json`

Waitlist form and related content.

- Disclaimer text
- Headlines
- Social proof
- Form labels

**Usage:** `useTranslations('waitlist')`

#### `earlyAccess.json`

Early access page content.

- Meta information
- Hero section
- Statistics
- CTA section

**Usage:** `useTranslations('earlyAccess')`

#### `studio.json`

AI Studio workspace translations.

- Workspace dashboard
- Upload interface
- Model selection
- Generate controls
- Results display
- Error messages

**Usage:** `useTranslations('studio')`

#### `startupProfile.json`

Startup profile form for brand onboarding.

- Form fields
- Categories
- Options and selections

**Usage:** `useTranslations('startupProfile')`

## Locale Codes

| Code  | Language | Directory | RTL |
| ----- | -------- | --------- | --- |
| en-US | English  | en/       | No  |
| fr-FR | French   | fr/       | No  |
| ar-MA | Arabic   | ar/       | Yes |

## File Naming Convention

- **Source files**: `messages/en/{namespace}.json`
- **Translation files**: `messages/{two_letters_code}/{namespace}.json`
- All filenames use **camelCase** for namespaces
- Locale directories use **two-letter codes** (en, fr, ar)

## Crowdin Integration

The project uses Crowdin for translation management. The configuration is in `crowdin.yml`.

### Sync Commands

```bash
# Upload source files to Crowdin
crowdin upload sources

# Download translations from Crowdin
crowdin download

# Sync all (upload + download)
crowdin sync
```

### Configuration

See `crowdin.yml` for:

- Project ID and authentication
- Source file patterns
- Translation file output paths
- Update options
- Ignore rules

## Usage in Components

### With next-intl (Recommended)

```typescript
import { useTranslations } from 'next-intl';

export function Header() {
  const t = useTranslations('header');

  return (
    <nav>
      <a href="/about">{t('nav.about')}</a>
      <a href="/contact">{t('nav.contact')}</a>
    </nav>
  );
}
```

### Server Components

```typescript
import { getTranslations } from 'next-intl/server';

export default async function Page() {
  const t = await getTranslations('landing');

  return <h1>{t('hero.headline.pre')}</h1>;
}
```

### Accessing Multiple Namespaces

```typescript
import { useTranslations } from 'next-intl';

export function Footer() {
  const footer = useTranslations('footer');
  const social = useTranslations('social');

  return (
    <footer>
      <p>{footer('desc')}</p>
      <a href={social('twitter')}>Twitter</a>
    </footer>
  );
}
```

## Adding New Translations

1. **Add to English source**: Create/edit `messages/en/{namespace}.json`
2. **Upload to Crowdin**: `crowdin upload sources`
3. **Translate in Crowdin**: Translators work in the Crowdin UI
4. **Download translations**: `crowdin download`
5. **Commit changes**: All locale files are updated

## Best Practices

- **Keep namespaces focused**: Each namespace should cover a specific component or feature
- **Use descriptive keys**: Keys should be meaningful within their namespace context
- **Avoid duplication**: If text is reused across namespaces, put it in `common.json` or `actions.json`
- **Maintain consistency**: Use the same terminology across all namespaces
- **Test RTL**: Always test Arabic translations for RTL layout issues
- **Review in Crowdin**: Enable review workflow before approving translations
- **Use `useTranslations('namespace')`**: Always specify the namespace for better code organization

## Namespace Naming Conventions

- **Component-based**: `header`, `footer`, `scrollNav`
- **Feature-based**: `waitlist`, `earlyAccess`, `studio`, `startupProfile`
- **Page-based**: `landing`, `about`
- **Utility**: `common`, `actions`, `social`, `loading`, `meta`

## Related Files

- `i18n/config.ts` - Locale configuration
- `i18n/request.ts` - Message loading logic with namespace support
- `i18n/routing.ts` - Locale routing configuration
- `crowdin.yml` - Crowdin CLI configuration
- `next.config.ts` - Next.js i18n settings
