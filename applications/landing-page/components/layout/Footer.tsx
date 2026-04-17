'use client'

import { useTranslations } from 'next-intl'

import { SocialLinks } from './SocialLinks'

import { LocaleSwitcher } from '@/components/locale-switcher'
import { AnaqioTypographyLogo } from '@/components/ui/anaqio-typography-logo'
import { Link } from '@/i18n/routing'

export function Footer() {
  const t = useTranslations('footer')

  return (
    <footer className="vb-white border-t border-black/10 px-8 py-16 md:px-16">
      {/* Top grid */}
      <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-[1fr_auto_auto_auto]">
        {/* Brand */}
        <div>
          <Link href="/" aria-label="Anaqio Home">
            <AnaqioTypographyLogo instanceId="footer-logo" className="mb-3 w-24" variant="none" />
          </Link>
          <p className="max-w-xs text-sm text-black/50">{t('desc')}</p>
          <div className="mt-4">
            <SocialLinks />
          </div>
        </div>

        {/* Platform */}
        <div>
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-black/40">
            {t('platform.title')}
          </p>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="text-sm text-black/60 transition-colors hover:text-black">
                {t('platform.studio')}
              </Link>
            </li>
            <li>
              <Link href="/" className="text-sm text-black/60 transition-colors hover:text-black">
                {t('platform.lookbook')}
              </Link>
            </li>
            <li>
              <Link href="/" className="text-sm text-black/60 transition-colors hover:text-black">
                {t('platform.tryon')}
              </Link>
            </li>
            <li>
              <Link href="/" className="text-sm text-black/60 transition-colors hover:text-black">
                {t('platform.pricing')}
              </Link>
            </li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-black/40">
            {t('company.title')}
          </p>
          <ul className="space-y-2">
            <li>
              <Link
                href="/about"
                className="text-sm text-black/60 transition-colors hover:text-black"
              >
                {t('company.about')}
              </Link>
            </li>
            <li>
              <Link
                href="/brand"
                className="text-sm text-black/60 transition-colors hover:text-black"
              >
                {t('resources.brand')}
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-black/40">
            Legal
          </p>
          <ul className="space-y-2">
            <li>
              <Link
                href="/privacy"
                className="text-sm text-black/60 transition-colors hover:text-black"
              >
                {t('company.privacy')}
              </Link>
            </li>
            <li>
              <Link
                href="/terms"
                className="text-sm text-black/60 transition-colors hover:text-black"
              >
                {t('company.terms')}
              </Link>
            </li>
            <li>
              <Link
                href="/legal-mentions"
                className="text-sm text-black/60 transition-colors hover:text-black"
              >
                {t('company.legal')}
              </Link>
            </li>
            <li>
              <Link
                href="/cookies"
                className="text-sm text-black/60 transition-colors hover:text-black"
              >
                {t('company.cookies')}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex flex-col items-start justify-between gap-4 border-t border-black/10 pt-6 md:flex-row md:items-center">
        <p className="text-xs text-black/40">
          {t('copyright')} · {t('rights')}
        </p>
        <LocaleSwitcher />
      </div>
    </footer>
  )
}
