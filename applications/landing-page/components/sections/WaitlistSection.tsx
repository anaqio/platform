'use client'

import { useTranslations } from 'next-intl'

import { WaitlistForm } from './waitlist-form'

import { Section } from '@/components/ui/section'
import { Link } from '@/i18n/routing'

export function WaitlistSection() {
  const t = useTranslations('waitlist')

  return (
    <Section
      id="waitlist"
      aria-labelledby="waitlist-heading"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden pb-24 pt-32 lg:pt-48"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '1px 1200px' }}
    >
      {/* Background Atmosphere */}
      <div
        data-atom
        data-decorative
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-aq-purple/5 blur-[160px]"
      />

      <div className="relative z-10 mx-auto w-full max-w-3xl px-4 text-center">
        <h2
          id="waitlist-heading"
          data-atom
          className="mb-16 font-display text-[clamp(2.5rem,5vw,4.5rem)] font-light leading-tight text-foreground"
        >
          {t('headline.pre')}{' '}
          <em className="text-brand-gradient not-italic">{t('headline.gradient')}</em>
        </h2>

        {/* The Stage */}
        <div
          data-atom
          className="glass-strong noise-overlay relative mx-auto min-h-[400px] w-full rounded-3xl border border-border/10 bg-card/5 p-8 shadow-2xl backdrop-blur-xl sm:p-12"
        >
          <div className="mb-10 space-y-3">
            <h3
              className="font-display font-light tracking-wide text-foreground/90"
              style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)' }}
            >
              {t('formHeadline')}
            </h3>
            <p className="font-body text-sm font-light text-muted-foreground">{t('formSubline')}</p>
          </div>

          <div className="relative text-left">
            <WaitlistForm source="home" />
          </div>

          <p className="mt-12 text-center font-label text-[0.65rem] uppercase tracking-wider text-muted-foreground/60">
            {t('disclaimer.prefix')}{' '}
            <Link href="/terms" className="text-foreground/80 transition-colors hover:text-aq-blue">
              {t('disclaimer.terms')}
            </Link>{' '}
            {t('disclaimer.and')}{' '}
            <Link
              href="/privacy"
              className="text-foreground/80 transition-colors hover:text-aq-blue"
            >
              {t('disclaimer.privacy')}
            </Link>
            .
          </p>
        </div>
      </div>
    </Section>
  )
}
