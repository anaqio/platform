'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

import { isRTL, localeLabels, locales, type Locale } from '@/i18n/config';
import { usePathname, useRouter } from '@/i18n/routing';
import { trackUserBehavior } from '@/lib/analytics';

const LOCALE_META: Record<Locale, { flag: string; short: string }> = {
  en: { flag: '🇺🇸', short: 'EN' },
  fr: { flag: '🇫🇷', short: 'FR' },
  ar: { flag: '🇲🇦', short: 'AR' },
};

export function LocaleSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  function switchLocale(loc: Locale) {
    setOpen(false);
    trackUserBehavior.trackClick(`locale_change_${loc}`, 'settings');
    router.replace(pathname, { locale: loc });
  }

  const { flag, short } = LOCALE_META[locale];

  return (
    <div ref={containerRef} className="relative" data-testid="locale-switcher">
      {/* Trigger */}
      <button
        data-testid="locale-switcher-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
      >
        <span aria-hidden="true">{flag}</span>
        <span>{short}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center"
        >
          <ChevronDown className="h-3 w-3" aria-hidden="true" />
        </motion.span>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label="Select language"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute end-0 top-full z-50 mt-1.5 min-w-[140px] overflow-hidden rounded-xl border border-border/20 bg-card/90 shadow-xl backdrop-blur-xl"
          >
            {locales.map((loc) => {
              const meta = LOCALE_META[loc];
              const active = loc === locale;
              return (
                <li key={loc} role="option" aria-selected={active}>
                  <button
                    data-testid={`locale-option-${loc}`}
                    onClick={() => switchLocale(loc)}
                    dir={isRTL(loc) ? 'rtl' : 'ltr'}
                    className={[
                      'flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm transition-colors',
                      active
                        ? 'bg-aq-blue/10 font-semibold text-aq-blue'
                        : 'text-foreground/80 hover:bg-foreground/5 hover:text-foreground',
                    ].join(' ')}
                  >
                    <span aria-hidden="true">{meta.flag}</span>
                    <span>{localeLabels[loc]}</span>
                    {active && (
                      <span
                        className="ms-auto h-1.5 w-1.5 rounded-full bg-aq-blue"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
