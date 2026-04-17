'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

import { Button } from '@anaqio/ui'
import { Link } from '@/i18n/routing'

export default function NotFound() {
  const t = useTranslations('notFound')

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background">
      {/* Full-bleed atmospheric background */}
      <div className="pointer-events-none absolute inset-0">
        {/* Deep radial gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(37,99,235,0.12),transparent)]" />
        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.7)_100%)]" />
      </div>

      {/* Ambient orbs */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-[15%] top-[20%] h-[400px] w-[400px] rounded-full bg-aq-blue/10 blur-[100px]"
        animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[20%] right-[15%] h-[300px] w-[300px] rounded-full bg-aq-purple/10 blur-[80px]"
        animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        {/* Overline */}
        <motion.p
          className="mb-8 font-label text-xs font-semibold uppercase tracking-[0.3em] text-aq-blue/70"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          ANAQIO · Error
        </motion.p>

        {/* Giant 404 */}
        <motion.div
          className="relative select-none"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Blurred glow layer behind number */}
          <span
            aria-hidden="true"
            className="text-brand-gradient pointer-events-none absolute inset-0 select-none font-display text-[clamp(7rem,20vw,14rem)] font-black leading-none tracking-tighter opacity-30 blur-[2px]"
          >
            404
          </span>
          {/* Main number */}
          <span className="text-brand-gradient relative font-display text-[clamp(7rem,20vw,14rem)] font-black leading-none tracking-tighter">
            404
          </span>
          {/* Glitch layer 1 */}
          <span
            aria-hidden="true"
            className="text-brand-gradient pointer-events-none absolute inset-0 select-none font-display text-[clamp(7rem,20vw,14rem)] font-black leading-none tracking-tighter opacity-60 mix-blend-screen"
            style={{
              animation: 'glitch-1 3s infinite linear alternate-reverse',
            }}
          />
          {/* Glitch layer 2 */}
          <span
            aria-hidden="true"
            className="text-brand-gradient pointer-events-none absolute inset-0 select-none font-display text-[clamp(7rem,20vw,14rem)] font-black leading-none tracking-tighter opacity-40 mix-blend-screen"
            style={{
              animation: 'glitch-2 4s infinite linear alternate-reverse',
            }}
          />
        </motion.div>

        {/* Separator */}
        <motion.div
          className="mt-6 flex items-center gap-4"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-white/20" />
          <span className="font-label text-[0.6rem] font-bold uppercase tracking-[0.4em] text-muted-foreground/50">
            Page Not Found
          </span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-white/20" />
        </motion.div>

        {/* Heading + description */}
        <motion.div
          className="mt-8 max-w-md space-y-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="font-display text-2xl font-medium italic tracking-tight text-foreground sm:text-3xl">
            {t('title')}
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground/70">{t('desc')}</p>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <Button
            asChild
            variant="brand"
            className="h-12 rounded-full px-8 text-[0.7rem] font-bold uppercase tracking-[0.15em] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_2rem_-0.5rem_rgba(37,99,235,0.5)]"
          >
            <Link href="/">{t('back')}</Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="h-12 rounded-full px-8 text-[0.7rem] font-bold uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground"
          >
            <Link href="/#waitlist">{t('waitlist')}</Link>
          </Button>
        </motion.div>

        {/* Bottom decorative element */}
        <motion.div
          className="mt-20 flex items-center gap-3 text-muted-foreground/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <div className="h-px w-8 bg-current" />
          <span className="font-label text-[0.55rem] uppercase tracking-[0.4em]">
            ANAQIO · AI Visual Studio · Casablanca
          </span>
          <div className="h-px w-8 bg-current" />
        </motion.div>
      </div>
    </div>
  )
}
