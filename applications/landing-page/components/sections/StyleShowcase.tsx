'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useRef } from 'react'

import { Section, SectionContainer } from '@/components/ui/section'
import { useAnimationReady } from '@/hooks/use-animation-ready'
import { ease } from '@/lib/data/motion'
import { NANOBANANA_VISUALS } from '@/lib/data/nanobanana-assets'

export function StyleShowcase() {
  const t = useTranslations('landing.styleShowcase')
  const sectionRef = useRef<HTMLElement>(null)
  const { animated } = useAnimationReady()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const y1 = useTransform(scrollYProgress, [0, 1], ['0px', '-100px'])
  const y2 = useTransform(scrollYProgress, [0, 1], ['0px', '100px'])
  const y3 = useTransform(scrollYProgress, [0, 1], ['0px', '-150px'])

  const images = [
    {
      src: NANOBANANA_VISUALS.studio.riad,
      alt: 'Luxury Riad',
      y: y1,
      className: 'col-span-2 row-span-2 h-[400px]',
    },
    {
      src: NANOBANANA_VISUALS.fashion.emerald,
      alt: 'Emerald Fashion',
      y: y2,
      className: 'col-span-1 row-span-1 h-[250px]',
    },
    {
      src: NANOBANANA_VISUALS.studio.arches,
      alt: 'Modern Arches',
      y: y3,
      className: 'col-span-1 row-span-2 h-[350px]',
    },
    {
      src: NANOBANANA_VISUALS.fashion.silk,
      alt: 'Silk Detail',
      y: y1,
      className: 'col-span-1 row-span-1 h-[200px]',
    },
    {
      src: NANOBANANA_VISUALS.studio.goldenHour,
      alt: 'Golden Hour',
      y: y2,
      className: 'col-span-2 row-span-1 h-[250px]',
    },
  ]

  return (
    <Section ref={sectionRef} id="showcase" className="overflow-hidden bg-background py-32">
      <SectionContainer>
        <div className="flex flex-col gap-16 lg:flex-row lg:items-center">
          <div className="flex-1 space-y-8">
            <motion.p
              initial={animated ? { opacity: 0, x: -20 } : false}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease }}
              className="font-label text-xs uppercase tracking-label text-aq-gold"
            >
              {t('eyebrow')}
            </motion.p>
            <motion.h2
              initial={animated ? { opacity: 0, y: 20 } : false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease, delay: 0.1 }}
              className="font-display text-[clamp(2.5rem,5vw,4.5rem)] font-light leading-tight text-foreground"
            >
              {t('title.pre')}
              <br />
              <span className="text-brand-gradient italic">{t('title.accent')}</span>
            </motion.h2>
            <motion.p
              initial={animated ? { opacity: 0 } : false}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease, delay: 0.2 }}
              className="max-w-md font-body text-lg leading-relaxed text-muted-foreground"
            >
              {t('description')}
            </motion.p>
          </div>

          <div className="flex-1">
            <div className="grid grid-cols-3 gap-4 lg:gap-6">
              {images.map((img, i) => (
                <motion.div
                  key={i}
                  style={animated ? { y: img.y } : {}}
                  className={`relative overflow-hidden rounded-3xl border border-white/5 shadow-2xl ${img.className}`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 hover:opacity-100" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </SectionContainer>
    </Section>
  )
}
