import { MarqueeTickerAtom } from '@/components/atoms/MarqueeTickerAtom'
import { MARQUEE_ITEMS } from '@/lib/data/marquee-content'

interface MarqueeSectionProps {
  variant?: 'blue' | 'white'
}

export function MarqueeSection({ variant = 'white' }: MarqueeSectionProps) {
  return (
    <section
      aria-hidden="true"
      className={`w-full py-0 ${variant === 'blue' ? 'bg-[#2B3AE7]' : 'bg-[#F5F5F0]'}`}
    >
      <MarqueeTickerAtom
        items={MARQUEE_ITEMS}
        background={
          variant === 'blue'
            ? 'bg-[#2B3AE7] border-y border-white/10'
            : 'bg-[#F5F5F0] border-y border-black/10'
        }
        textColor={variant === 'blue' ? 'text-white/50' : 'text-black/40'}
      />
    </section>
  )
}
