import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { BackButton } from '@/components/ui/back-button';

interface LegalPageLayoutProps {
  /** Eyebrow label (e.g., "Data Protection", "Legal Framework") */
  eyebrow: string;
  /** Page title */
  title: string;
  /** Optional subtitle (e.g., French translation) */
  subtitle?: string;
  /** Effective date (e.g., "Feb 21, 2026") */
  effectiveDate?: string;
  /** Version string (e.g., "Version 1.0") */
  version?: string;
  /** Page content */
  children: React.ReactNode;
}

/**
 * Shared layout wrapper for legal/policy pages.
 * Provides consistent Header + noise overlay + eyebrow + title + Footer
 * per the MASTER.md design system.
 */
export function LegalPageLayout({
  eyebrow,
  title,
  subtitle,
  effectiveDate,
  version,
  children,
}: LegalPageLayoutProps) {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="noise-overlay relative px-6 pb-24 pt-32">
        <div className="mx-auto max-w-3xl">
          <header className="mb-16 border-b border-border/50 pb-12">
            <BackButton />
            <div className="mb-6 flex items-center gap-3">
              <div className="h-px w-8 bg-aq-blue" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-aq-blue">
                {eyebrow}
              </span>
            </div>
            <h1 className="mb-4 font-display text-5xl font-bold tracking-tight sm:text-6xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mb-6 font-display text-xl italic text-muted-foreground">
                {subtitle}
              </p>
            )}
            {(effectiveDate ?? version) && (
              <div className="flex flex-wrap gap-x-8 gap-y-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {effectiveDate && <span>{effectiveDate}</span>}
                {version && <span>{version}</span>}
              </div>
            )}
          </header>

          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}
