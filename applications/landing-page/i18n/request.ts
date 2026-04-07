import { readdirSync } from 'node:fs';
import { join } from 'node:path';

import { getRequestConfig } from 'next-intl/server';

import { routing } from './routing';

// Map locale codes to directory names
const localeToDir: Record<string, string> = {
  'en-US': 'en',
  'fr-FR': 'fr',
  'ar-MA': 'ar',
  // Fallback for two-letter codes
  en: 'en',
  fr: 'fr',
  ar: 'ar',
};

const messagesDir = join(process.cwd(), 'messages');

function getNamespaces(locale: string): string[] {
  const dir = localeToDir[locale] || locale;
  try {
    return readdirSync(join(messagesDir, dir))
      .filter((f) => f.endsWith('.json'))
      .map((f) => f.replace('.json', ''));
  } catch {
    return [];
  }
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as never)) {
    locale = routing.defaultLocale;
  }

  const dir = localeToDir[locale] || locale;
  const namespaces = getNamespaces(locale);
  const messages: Record<string, unknown> = {};

  await Promise.all(
    namespaces.map(async (ns) => {
      try {
        const mod = await import(`../messages/${dir}/${ns}.json`);
        messages[ns] = mod.default;
      } catch (error) {
        // Namespace file missing for this locale — skip gracefully
        console.warn(
          `Failed to load namespace '${ns}' for locale '${locale}':`,
          error
        );
      }
    })
  );

  return { locale, messages };
});
