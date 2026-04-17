'use client'

import dynamic from 'next/dynamic'
import { useTranslations } from 'next-intl'

import { VoobanHeroSection } from './VoobanHeroSection'

import { MenuSidebar } from '@/components/layout/MenuSidebar'
import { AtelierForm } from '@/components/sections/waitlist/atelier-form'
import { BackButton } from '@/components/ui/back-button'
// Below-fold sections: dynamic imports for code-splitting (ssr: true for SEO)
const MarqueeSection = dynamic(
  () => import('@/components/sections/MarqueeSection').then((mod) => mod.MarqueeSection),
  { ssr: true }
)
const ProblemSection = dynamic(
  () => import('@/components/sections/ProblemSection').then((mod) => mod.ProblemSection),
  { ssr: true }
)
const SolutionSection = dynamic(
  () => import('@/components/sections/SolutionSection').then((mod) => mod.SolutionSection),
  { ssr: true }
)
const FeaturesSection = dynamic(
  () => import('@/components/sections/FeaturesSection').then((mod) => mod.FeaturesSection),
  { ssr: true }
)
const ResultsSection = dynamic(
  () => import('@/components/sections/ResultsSection').then((mod) => mod.ResultsSection),
  { ssr: true }
)
const SegmentsSection = dynamic(
  () => import('@/components/sections/SegmentsSection').then((mod) => mod.SegmentsSection),
  { ssr: true }
)
const HowItWorksSection = dynamic(
  () => import('@/components/sections/HowItWorksSection').then((mod) => mod.HowItWorksSection),
  { ssr: true }
)
const WhyAnaqioSection = dynamic(
  () => import('@/components/sections/WhyAnaqioSection').then((mod) => mod.WhyAnaqioSection),
  { ssr: true }
)
const VisionSection = dynamic(
  () => import('@/components/sections/VisionSection').then((mod) => mod.VisionSection),
  { ssr: true }
)
const TeamSection = dynamic(
  () => import('@/components/sections/TeamSection').then((mod) => mod.TeamSection),
  { ssr: true }
)
const ScrollGridSection = dynamic(
  () => import('@/components/sections/ScrollGridSection').then((mod) => mod.ScrollGridSection),
  { ssr: true }
)

const Footer = dynamic(() => import('@/components/layout/Footer').then((mod) => mod.Footer), {
  ssr: true,
})

export function NewLandingPage() {
  const t = useTranslations('earlyAccess')
  const tAtelier = useTranslations('atelierInvitation')
  return (
    <div className="flex w-full flex-col">
      <MenuSidebar />
      <VoobanHeroSection />
      <ScrollGridSection />
      <MarqueeSection variant="blue" />
      <ProblemSection />
      <SolutionSection />
      <MarqueeSection variant="white" />
      <FeaturesSection />
      <ResultsSection />
      <SegmentsSection />
      {/* <PricingSection /> */}
      <HowItWorksSection />
      <WhyAnaqioSection />
      <VisionSection />
      <TeamSection />
      <>
        <section id="final-cta" className="vb-white relative overflow-hidden px-8 py-24 md:px-16">
          <div className="mx-auto w-full max-w-7xl">
            <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-[1fr_520px]">
              {/* Left — copy */}
              <div className="space-y-8 lg:pt-4">
                <BackButton />

                <div className="flex items-center gap-3">
                  <div className="h-px w-8 bg-[#2B3AE7]" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#2B3AE7]">
                    {t('badge')}
                  </span>
                </div>

                <h1 className="font-display text-5xl font-bold leading-[0.92] tracking-tight text-black sm:text-6xl lg:text-7xl">
                  {t('hero.titleLine1')} <br />
                  <span className="text-[#2B3AE7]">{t('hero.titleGradient')}</span> <br />
                  <span className="font-normal italic">{t('hero.titleLine3')}</span>
                </h1>

                <p className="max-w-md text-base leading-relaxed text-black/60 sm:text-lg">
                  {t('hero.desc')}
                </p>

                {/* Stats — compact horizontal row */}
                <div className="grid grid-cols-2 gap-6 border-t border-black/10 pt-8 sm:grid-cols-4">
                  {(['speed', 'cost', 'creative', 'platform'] as const).map((key) => (
                    <div key={key} className="space-y-1">
                      <div className="font-display text-3xl font-bold tracking-tighter text-black">
                        {t(`stats.${key}.num`)}
                      </div>
                      <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#2B3AE7]/80">
                        {t(`stats.${key}.label`)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — CTA button + Drawer */}
              <div className="w-full lg:sticky lg:top-28">
                <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-white p-8 shadow-sm sm:p-10">
                  <div className="relative z-10 mb-8 space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#2B3AE7]">
                      {tAtelier('card.eyebrow')}
                    </p>
                    <h2 className="font-cormorant text-2xl font-medium text-black sm:text-3xl">
                      {tAtelier('card.title')}
                    </h2>
                  </div>

                  <div className="relative z-10">
                    <AtelierForm
                      trigger={
                        <button
                          type="button"
                          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#2B3AE7] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1e2fc7]"
                        >
                          {tAtelier('ui.requestInvitation')}
                        </button>
                      }
                    />
                  </div>
                </div>

                <p className="mt-4 text-center text-[10px] font-medium uppercase tracking-widest text-black/30">
                  {tAtelier('card.footnote')}
                </p>
              </div>
            </div>
          </div>
        </section>
      </>

      <Footer />
    </div>
  )
}
