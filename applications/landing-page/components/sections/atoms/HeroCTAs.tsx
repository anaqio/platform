'use client';

import { motion } from 'framer-motion';
import { ArrowDownRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { ScrollLink } from '@/components/ui/scroll-link';
import { Link } from '@/i18n/routing';
import { ease } from '@/lib/data/motion';

interface HeroCTAsProps {
  animated: boolean;
  tier: string;
}

export function HeroCTAs({ animated, tier }: HeroCTAsProps) {
  const t = useTranslations('landing.hero');

  return (
    <motion.div
      data-atom
      initial={animated ? { y: 20, opacity: 0 } : false}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 1.1, ease }}
      className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:justify-start"
    >
      <MagneticButton strength={tier === 'high' ? 0.35 : 0}>
        <Button
          variant="brand"
          asChild
          className="group h-12 gap-3 rounded-xl px-8 text-[0.7rem] font-semibold uppercase tracking-[0.18em]"
        >
          <Link href="/early-access">
            <span>{t('cta.act')}</span>
            <ArrowDownRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
          </Link>
        </Button>
      </MagneticButton>
      <Button
        variant="heroOutline"
        asChild
        className="h-11 gap-2 rounded-xl px-7 text-[0.7rem] font-medium uppercase tracking-[0.18em]"
      >
        <ScrollLink targetId="how-it-works">{t('cta.learn')}</ScrollLink>
      </Button>
    </motion.div>
  );
}
