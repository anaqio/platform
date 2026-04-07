import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';

import { AuthButton } from '@/components/auth-button';
import { Link } from '@/i18n/routing';

export default async function ProtectedLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'protected' });
  const tFooter = await getTranslations({ locale, namespace: 'footer' });

  return (
    <div className="noise-overlay flex min-h-screen flex-col">
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/50 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link
            href="/"
            className="text-brand-gradient font-display text-xl font-bold tracking-tighter"
          >
            anaqio
          </Link>
          <div className="flex items-center gap-6">
            <Suspense
              fallback={
                <div className="h-8 w-20 animate-pulse rounded-lg bg-secondary/50" />
              }
            >
              <AuthButton />
            </Suspense>
          </div>
        </div>
      </nav>

      <main className="relative z-10 mx-auto w-full max-w-7xl flex-1 p-6 lg:p-12">
        {children}
      </main>

      <footer className="relative z-10 border-t border-border/50 bg-secondary/5 py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 sm:flex-row">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {tFooter('copyright')} &middot; {t('footer.workspace')}
          </p>
          <div className="flex gap-8">
            <Link
              href="/terms"
              className="text-[10px] uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
            >
              {t('footer.terms')}
            </Link>
            <Link
              href="/privacy"
              className="text-[10px] uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
            >
              {t('footer.privacy')}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
