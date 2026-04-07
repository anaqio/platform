# skill: brand

# load when: Tailwind v4 CSS · brand colors · typography · dark mode · theming

## ANAQIO BRAND TOKENS

```
Ink     #0F172A  — darkest bg, dark mode base
Navy    #1B2F52  — secondary dark bg
Blue    #2563EB  — primary CTA, links
Violet  #7C3AED  — secondary accent, gradients
Gold    #D4AF37  — accent, highlights, Moroccan cultural tie
```

## globals.css — COMPLETE REFERENCE

```css
@import 'tailwindcss';
@import 'tw-animate-css';

@custom-variant dark (&:is(.dark *));

@theme inline {
  /* Brand palette */
  --color-brand-ink: #0f172a;
  --color-brand-navy: #1b2f52;
  --color-brand-blue: #2563eb;
  --color-brand-violet: #7c3aed;
  --color-brand-gold: #d4af37;

  /* Semantic (mapped from :root CSS vars) */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);

  /* Typography */
  --font-display: 'Syne', sans-serif;
  --font-body: 'Plus Jakarta Sans', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Radius */
  --radius: 0.5rem;
}

/* ---- LIGHT MODE ---- */
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.13 0.03 264);
  --card: oklch(0.99 0 0);
  --card-foreground: oklch(0.13 0.03 264);
  --primary: oklch(0.53 0.24 264); /* blue  #2563EB */
  --primary-foreground: oklch(0.98 0 0);
  --secondary: oklch(0.56 0.27 293); /* violet #7C3AED */
  --secondary-foreground: oklch(0.98 0 0);
  --muted: oklch(0.96 0.01 264);
  --muted-foreground: oklch(0.55 0.02 264);
  --accent: oklch(0.82 0.12 85); /* gold #D4AF37 */
  --accent-foreground: oklch(0.13 0.03 264);
  --destructive: oklch(0.62 0.22 25);
  --destructive-foreground: oklch(0.98 0 0);
  --border: oklch(0.92 0.01 264);
  --input: oklch(0.92 0.01 264);
  --ring: oklch(0.53 0.24 264);
}

/* ---- DARK MODE ---- */
.dark {
  --background: oklch(0.11 0.03 264); /* ink #0F172A */
  --foreground: oklch(0.97 0.01 264);
  --card: oklch(0.14 0.03 264); /* navy #1B2F52 ish */
  --card-foreground: oklch(0.97 0.01 264);
  --primary: oklch(0.6 0.24 264);
  --primary-foreground: oklch(0.11 0.03 264);
  --secondary: oklch(0.62 0.27 293);
  --secondary-foreground: oklch(0.11 0.03 264);
  --muted: oklch(0.22 0.02 264);
  --muted-foreground: oklch(0.65 0.02 264);
  --accent: oklch(0.78 0.12 85);
  --accent-foreground: oklch(0.11 0.03 264);
  --destructive: oklch(0.65 0.22 25);
  --destructive-foreground: oklch(0.97 0.01 264);
  --border: oklch(0.22 0.02 264);
  --input: oklch(0.22 0.02 264);
  --ring: oklch(0.6 0.24 264);
}
```

## GRADIENT UTILITIES (add to globals.css)

```css
/* Hero gradient */
.gradient-brand {
  background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
}

/* Gold shimmer (for accent elements) */
.gradient-gold {
  background: linear-gradient(135deg, #d4af37 0%, #f5d47a 50%, #d4af37 100%);
  background-size: 200% auto;
}

/* Dark overlay for image text legibility */
.overlay-dark {
  background: linear-gradient(to top, rgba(15, 23, 42, 0.8) 0%, transparent 60%);
}
```

## TYPOGRAPHY CLASSES

```css
/* Add to globals.css */
.font-display { font-family: var(--font-display); }
.font-body    { font-family: var(--font-body); }

/* Usage */
<h1 className="font-display text-4xl font-bold tracking-tight" />
<p  className="font-body text-base text-muted-foreground" />
```

## TAILWIND v4 RULES

```
NO tailwind.config.js — all config in globals.css @theme block
NO tailwindcss-animate — use tw-animate-css
NO @apply in component files — utility classes only
YES custom CSS vars in @theme for brand tokens
YES cn() for all className composition
```

## DARK MODE IMPLEMENTATION

```typescript
// app/layout.tsx — ThemeProvider wraps everything
// Use next-themes (already in shadcn setup)
import { ThemeProvider } from 'next-themes'

export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"    // Anaqio defaults to dark
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

## KIOSK MODE VISUAL (expo)

```typescript
// When NEXT_PUBLIC_KIOSK_MODE=true:
// - Force dark mode
// - Larger touch targets (min 48px)
// - Hidden scrollbars
// - Auto-reset after 3min inactivity

const isKiosk = process.env.NEXT_PUBLIC_KIOSK_MODE === 'true'

<div className={cn(
  'touch-target',
  isKiosk && 'min-h-[48px] min-w-[48px] text-lg'
)} />
```
