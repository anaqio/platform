'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { Button } from '@anaqio/ui'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { Link } from '@/i18n/routing'
import { getAboutTeam } from '@/lib/data/about-page-content'
import { clipReveal, fadeIn, fadeUp } from '@/lib/data/motion'

export default function AboutContent() {
  const t = useTranslations('about')
  const tMeta = useTranslations('meta')
  const reduced = useReducedMotion()

  const team = getAboutTeam(t)

  return (
    <>
      {/* ═══════════════════════════════════════════ */}
      {/* SECTION 1 — HERO                            */}
      {/* ═══════════════════════════════════════════ */}
      <section
        id="about-hero"
        aria-labelledby="about-hero-heading"
        className="relative min-h-[92dvh] overflow-hidden px-4 py-24 sm:px-6 lg:px-8"
      >
        <h1 id="about-hero-heading" className="sr-only">
          {tMeta('about.title')}
        </h1>

        {/* Spotlight Effect */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-aq-blue/10 blur-[120px]"
          animate={reduced ? { opacity: 0.5 } : { opacity: [0.3, 0.6, 0.3], scale: [1, 1.05, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Ambient gradient orbs */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-aq-blue/20 blur-[100px]"
          animate={
            reduced
              ? { opacity: 1 }
              : {
                  x: [0, 80, 0, -80, 0],
                  y: [0, 40, -40, 0, 0],
                  scale: [1, 1.1, 1, 0.9, 1],
                }
          }
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-aq-purple/20 blur-[100px]"
          animate={
            reduced
              ? { opacity: 1 }
              : {
                  x: [0, -80, 0, 80, 0],
                  y: [0, -40, 40, 0, 0],
                  scale: [1, 0.9, 1, 1.1, 1],
                }
          }
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        />

        <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-12 lg:flex-row lg:items-center xl:gap-24">
          {/* Left column */}
          <motion.div className="flex-1" {...fadeUp(reduced)}>
            {/* Navigation Header */}
            <div className="mb-12 md:mb-16">
              <Link
                href="/"
                className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground no-underline transition-colors hover:text-foreground"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform group-hover:-translate-x-1 rtl:rotate-180"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
                {t('hero.back')}
              </Link>
            </div>

            <p className="font-label text-xs font-semibold uppercase tracking-[0.2em] text-aq-blue">
              {t('hero.label')}
            </p>

            <h2
              aria-hidden="true"
              className="mt-6 font-display text-5xl font-light leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl xl:text-[5.5rem]"
            >
              {t('hero.titleLine1')}
              <br />
              <span className="font-medium">{t('hero.titleLine2')}</span>
            </h2>

            <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
              {t('hero.desc')}
            </p>

            <hr className="my-8 border-white/10" />

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-muted-foreground/80">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                {t('hero.founded')}
              </span>
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                {t('hero.location')}
              </span>
              <span className="flex items-center gap-2 text-aq-blue">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-aq-blue opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-aq-blue" />
                </span>
                {t('hero.launch')}
              </span>
            </div>
          </motion.div>

          {/* Right column — hero image */}
          <motion.div
            className="relative mx-auto aspect-[3/4] w-full max-w-sm shrink-0 overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl lg:mx-0 lg:max-h-[640px] lg:max-w-md"
            {...fadeIn(reduced, 0.2)}
          >
            <Image
              src="/media/images/hero-model.png"
              alt={t('hero.imageAlt')}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
              className="object-cover object-top"
              priority
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent"
            />
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* SECTION 2 — THE STUDIO                      */}
      {/* ═══════════════════════════════════════════ */}
      <section
        id="about-solution"
        aria-labelledby="about-solution-heading"
        className="relative border-t border-white/5 bg-background px-4 py-32 sm:px-6 lg:px-8"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-aq-blue/5 via-background to-background" />

        <div className="relative z-10 mx-auto max-w-6xl">
          <motion.div className="mx-auto max-w-3xl text-center" {...fadeUp(reduced)}>
            <p className="font-label text-xs font-semibold uppercase tracking-[0.2em] text-aq-blue">
              {t('solution.overline')}
            </p>
            <h2
              id="about-solution-heading"
              className="mt-6 font-display text-4xl font-light leading-tight sm:text-5xl"
            >
              {t('solution.titleLine1')}
              <br />
              <span className="font-medium text-foreground">{t('solution.titleLine2')}</span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              {t('solution.desc')}
            </p>
          </motion.div>

          {/* Image mosaic */}
          <div className="mt-20 grid grid-cols-12 gap-4 lg:gap-6">
            <motion.div
              className="relative col-span-5 row-span-2 overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl ring-1 ring-white/5"
              style={{ aspectRatio: '2/3' }}
              {...clipReveal(reduced, 0)}
            >
              <Image
                src="/media/images/lookbook-1.png"
                alt={t('lookbook.1alt')}
                fill
                sizes="(max-width: 640px) 100vw, 42vw"
                className="object-cover transition-transform duration-1000 hover:scale-105"
              />
            </motion.div>

            <motion.div
              className="relative col-span-7 overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl ring-1 ring-white/5"
              style={{ aspectRatio: '16/9' }}
              {...clipReveal(reduced, 0.15)}
            >
              <Image
                src="/media/images/lookbook-2.png"
                alt={t('lookbook.2alt')}
                fill
                sizes="(max-width: 640px) 100vw, 58vw"
                className="object-cover transition-transform duration-1000 hover:scale-105"
              />
            </motion.div>

            <motion.div
              className="relative col-span-7 overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl ring-1 ring-white/5"
              style={{ aspectRatio: '16/9' }}
              {...clipReveal(reduced, 0.3)}
            >
              <Image
                src="/media/images/lookbook-3.png"
                alt={t('lookbook.3alt')}
                fill
                sizes="(max-width: 640px) 100vw, 58vw"
                className="object-cover transition-transform duration-1000 hover:scale-105"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* SECTION 4 — BUILT FOR MOROCCO               */}
      {/* ═══════════════════════════════════════════ */}
      <section
        id="about-morocco"
        aria-labelledby="about-morocco-heading"
        className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden border-y border-white/5 bg-background px-4 py-32 sm:px-6 lg:px-8"
      >
        <div className="bg-brand-diag absolute inset-0 opacity-[0.03]" />

        <h2 id="about-morocco-heading" className="sr-only">
          {t('morocco.srLabel')}
        </h2>

        <motion.blockquote
          className="relative z-10 mx-auto max-w-5xl text-center font-display text-4xl font-light italic leading-tight text-foreground sm:text-5xl lg:text-6xl"
          {...fadeUp(reduced)}
        >
          &ldquo;{t('morocco.quote')}{' '}
          <span className="font-medium not-italic text-aq-blue">{t('morocco.quoteAccent')}</span>
          &rdquo;
        </motion.blockquote>

        <motion.div
          className="relative z-10 mt-12 flex items-center justify-center gap-4"
          {...fadeIn(reduced, 0.2)}
        >
          <div className="h-px w-12 bg-white/20" />
          <p className="font-label text-sm uppercase tracking-[0.2em] text-muted-foreground/80">
            {t('morocco.attr')}
          </p>
          <div className="h-px w-12 bg-white/20" />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* SECTION 5 — THE TEAM                        */}
      {/* ═══════════════════════════════════════════ */}
      <section
        id="about-team"
        aria-labelledby="about-team-heading"
        className="relative overflow-hidden bg-background px-4 py-32 sm:px-6 lg:px-8"
      >
        {/* Subtle diagonal stripe texture */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(-45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)',
            backgroundSize: '12px 12px',
          }}
        />

        <div className="relative z-10 mx-auto max-w-7xl">
          {/* Section header */}
          <motion.div className="mb-24 flex flex-col items-start" {...fadeUp(reduced)}>
            <div className="flex items-center gap-4">
              <div className="h-px w-8 bg-aq-blue/40" />
              <p className="font-label text-xs font-semibold uppercase tracking-[0.3em] text-aq-blue">
                {t('team.overline')}
              </p>
            </div>
            <h2
              id="about-team-heading"
              className="mt-6 font-display text-5xl font-light leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
            >
              {t('team.titleLine1')}
              <br />
              <em className="text-brand-gradient not-italic">{t('team.titleLine2')}</em>
            </h2>
          </motion.div>

          {/* Editorial roster */}
          <div className="divide-y divide-white/[0.06]">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                className="group relative py-10 lg:py-12"
                initial={reduced ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {/* Hover background sweep */}
                <div className="absolute inset-0 -mx-4 translate-x-2 scale-[0.98] rounded-2xl bg-white/[0.02] opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:scale-100 group-hover:opacity-100 sm:-mx-6 lg:-mx-8" />

                <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center">
                  {/* Index number */}
                  <span
                    aria-hidden="true"
                    className="hidden shrink-0 font-display text-[0.75rem] font-light tracking-[0.3em] text-muted-foreground/30 transition-colors duration-300 group-hover:text-aq-blue/60 lg:block lg:w-10"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  {/* Avatar */}
                  <div className="relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-xl ring-1 ring-white/10 transition-all duration-500 group-hover:ring-aq-blue/30 lg:h-20 lg:w-20">
                    {member.photo ? (
                      <Image
                        src={member.photo}
                        alt={member.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        unoptimized
                      />
                    ) : (
                      <div
                        aria-label={member.initials}
                        className="from-aq-indigo flex h-full w-full items-center justify-center bg-gradient-to-br to-aq-blue font-display text-xl font-semibold text-white"
                      >
                        {member.initials}
                      </div>
                    )}
                  </div>

                  {/* Name + role */}
                  <div className="min-w-0 flex-1 lg:max-w-[280px]">
                    <p className="font-display text-2xl font-medium tracking-tight text-foreground transition-colors duration-300 group-hover:text-white sm:text-3xl">
                      {member.name}
                    </p>
                    <p className="mt-1.5 font-label text-[0.6rem] font-bold uppercase tracking-widest text-aq-blue/70 transition-colors duration-300 group-hover:text-aq-blue">
                      {member.role}
                    </p>
                  </div>

                  {/* Bio */}
                  <p className="flex-1 text-sm leading-[1.9] text-muted-foreground/70 transition-colors duration-300 group-hover:text-muted-foreground/90 lg:max-w-lg">
                    {member.bio}
                  </p>

                  {/* Social links */}
                  <div className="flex shrink-0 flex-wrap items-center gap-4 font-label text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground/50">
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 transition-colors duration-200 hover:text-foreground"
                    >
                      <svg
                        className="h-3 w-3"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      LinkedIn
                    </a>
                    {'github' in member && member.github && (
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 transition-colors duration-200 hover:text-foreground"
                      >
                        <svg
                          className="h-3 w-3"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.298 24 12c0-6.627-5.373-12-12-12z" />
                        </svg>
                        GitHub
                      </a>
                    )}
                    {'twitter' in member && member.twitter && (
                      <a
                        href={member.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 transition-colors duration-200 hover:text-foreground"
                      >
                        <svg
                          className="h-3 w-3"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                        𝕏
                      </a>
                    )}
                    {'email' in member && member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="flex items-center gap-1.5 transition-colors duration-200 hover:text-foreground"
                      >
                        <svg
                          className="h-3 w-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        Email
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Team descriptor footer */}
          <motion.p
            className="mt-16 text-center font-display text-sm italic text-muted-foreground/40"
            {...fadeUp(reduced, 0.2)}
          >
            {t('team.desc')}
          </motion.p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* SECTION 6 — CTA                             */}
      {/* ═══════════════════════════════════════════ */}
      <section
        id="about-cta"
        aria-labelledby="about-cta-heading"
        className="relative overflow-hidden border-t border-white/5 bg-background px-4 py-32 sm:px-6 lg:px-8"
      >
        <div className="from-aq-indigo/10 absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] via-background to-background" />

        <motion.div
          className="glass-strong relative mx-auto max-w-4xl flex-col items-center justify-center rounded-[3rem] p-12 text-center md:p-20"
          {...fadeUp(reduced)}
        >
          <h2
            id="about-cta-heading"
            className="font-display text-4xl font-light tracking-tight sm:text-5xl lg:text-6xl"
          >
            {t('cta.title')}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {t('cta.desc')}
          </p>
          <div className="mt-12 flex flex-wrap justify-center gap-6">
            <MagneticButton strength={0.2}>
              <Button
                variant="brand"
                size="lg"
                className="h-14 rounded-full px-10 text-[0.7rem] font-bold uppercase tracking-[0.2em] shadow-[0_0_40px_rgba(212,175,55,0.2)]"
                asChild
              >
                <Link href="/early-access">{t('cta.primary')}</Link>
              </Button>
            </MagneticButton>
            <Button
              variant="heroOutline"
              size="lg"
              className="h-14 rounded-full border-white/10 px-10 text-[0.7rem] font-bold uppercase tracking-[0.2em] hover:bg-white/5"
              asChild
            >
              <Link href="/contact">{t('cta.secondary')}</Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </>
  )
}
