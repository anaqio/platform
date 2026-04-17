'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

import { useAnimationReady } from '@/hooks/use-animation-ready'
import { ease } from '@/lib/data/motion'
import { PRICING_TIERS } from '@/lib/data/pricing-section'

export function PricingSection() {
  const { animated, reduced } = useAnimationReady()

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="vb-blue relative overflow-hidden px-8 py-24 md:px-16"
    >
      <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">
        Simple, Transparent Pricing
      </p>
      <h2
        id="pricing-heading"
        className="mb-16 max-w-2xl font-display font-black text-white"
        style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
      >
        Plans for every <span className="vb-underline">stage</span> of growth
      </h2>

      <div className="grid w-full max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
        {PRICING_TIERS.map((tier, i) => (
          <motion.div
            key={tier.name}
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: animated ? i * 0.1 : 0 }}
            whileHover={animated ? { scale: 1.02, y: -8, transition: { duration: 0.3, ease } } : {}}
            className={`group relative flex flex-col rounded-xl border transition-all ${
              tier.highlighted
                ? 'border-white/20 bg-white text-[#2B3AE7]'
                : 'border-white/10 bg-white/5'
            }`}
          >
            {tier.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <div className="rounded-full bg-[#D4AF37] px-3 py-1 text-xs font-bold text-black">
                  Popular
                </div>
              </div>
            )}

            <div
              className="flex flex-col gap-4 border-b p-6"
              style={{
                borderColor: tier.highlighted ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
              }}
            >
              <h3 className={`text-xl font-bold ${tier.highlighted ? '' : 'text-white'}`}>
                {tier.name}
              </h3>
              <p className={`text-sm ${tier.highlighted ? 'text-[#2B3AE7]/60' : 'text-white/60'}`}>
                {tier.description}
              </p>

              <div className="flex items-baseline gap-1">
                {typeof tier.price === 'number' ? (
                  <>
                    <span className={`text-4xl font-bold ${tier.highlighted ? '' : 'text-white'}`}>
                      {tier.price.toLocaleString()}
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        tier.highlighted ? 'text-[#2B3AE7]/60' : 'text-white/60'
                      }`}
                    >
                      {tier.currency} / {tier.period}
                    </span>
                  </>
                ) : (
                  <span className={`text-3xl font-bold ${tier.highlighted ? '' : 'text-white'}`}>
                    {tier.price}
                  </span>
                )}
              </div>

              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full rounded-lg px-4 py-3 font-semibold transition-all ${
                  tier.highlighted
                    ? 'bg-[#2B3AE7] text-white hover:bg-[#2B3AE7]/90'
                    : 'border border-white/30 text-white hover:bg-white/10'
                }`}
              >
                {tier.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
              </motion.button>
            </div>

            <div className="flex flex-1 flex-col gap-4 p-6">
              <ul className="space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check
                      className={`mt-0.5 h-5 w-5 shrink-0 ${
                        tier.highlighted ? 'text-[#2B3AE7]' : 'text-white'
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        tier.highlighted ? 'text-[#2B3AE7]/80' : 'text-white/80'
                      }`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
