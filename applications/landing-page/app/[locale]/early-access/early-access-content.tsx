'use client';

import { useTranslations } from 'next-intl';

import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { AtelierInvitationForm } from '@/components/sections/atelier-invitation';
import { BackButton } from '@/components/ui/back-button';

export function EarlyAccessContent() {
  const t = useTranslations('earlyAccess');
  const tAtelier = useTranslations('atelierInvitation');

  return (
    <div className="min-h-screen">
      <Header />

      <main className="noise-overlay">
        {/* ── Hero + Form ─────────────────────────────────────── */}
        <section className="relative flex min-h-screen items-center overflow-hidden px-6 pb-16 pt-24">
          {/* Ambient glow */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10 blur-3xl"
            style={{
              background:
                'radial-gradient(circle, var(--color-aq-blue) 0%, transparent 70%)',
            }}
          />

          <div className="relative z-10 mx-auto w-full max-w-7xl">
            <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-[1fr_520px]">
              {/* Left — copy */}
              <div className="space-y-8 lg:pt-4">
                <BackButton />

                <div className="flex items-center gap-3">
                  <div className="h-px w-8 bg-aq-blue" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-aq-blue">
                    {t('badge')}
                  </span>
                </div>

                <h1 className="font-display text-5xl font-bold leading-[0.92] tracking-tight sm:text-6xl lg:text-7xl">
                  {t('hero.titleLine1')} <br />
                  <span className="text-brand-gradient">
                    {t('hero.titleGradient')}
                  </span>{' '}
                  <br />
                  <span className="font-normal italic">
                    {t('hero.titleLine3')}
                  </span>
                </h1>

                <p className="max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {t('hero.desc')}
                </p>

                {/* Stats — compact horizontal row */}
                <div className="grid grid-cols-2 gap-6 border-t border-border/30 pt-8 sm:grid-cols-4">
                  {(['speed', 'cost', 'creative', 'platform'] as const).map(
                    (key) => (
                      <div key={key} className="space-y-1">
                        <div className="font-display text-3xl font-bold tracking-tighter text-foreground">
                          {t(`stats.${key}.num`)}
                        </div>
                        <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-aq-blue/80">
                          {t(`stats.${key}.label`)}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Right — Typeform form card */}
              <div className="w-full lg:sticky lg:top-28">
                <div className="border-white/8 relative overflow-hidden rounded-3xl border bg-white/[0.03] p-8 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-10">
                  {/* Card shimmer */}
                  <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-white/[0.06] via-transparent to-transparent" />

                  <div className="relative z-10 mb-8 space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-aq-blue">
                      {tAtelier('card.eyebrow')}
                    </p>
                    <h2 className="font-cormorant text-2xl font-medium text-foreground sm:text-3xl">
                      {tAtelier('card.title')}
                    </h2>
                  </div>

                  <div className="relative z-10">
                    <AtelierInvitationForm />
                  </div>
                </div>

                <p className="mt-4 text-center text-[10px] font-medium uppercase tracking-widest text-muted-foreground/50">
                  {tAtelier('card.footnote')}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
