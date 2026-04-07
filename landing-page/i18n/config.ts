export const locales = ['en', 'fr', 'ar'] as const;
export const defaultLocale = 'en' as const;
export type Locale = (typeof locales)[number];

export const rtlLocales: Locale[] = ['ar'];
export const isRTL = (locale: Locale) => rtlLocales.includes(locale);

export const localeLabels: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
  ar: 'العربية',
};
