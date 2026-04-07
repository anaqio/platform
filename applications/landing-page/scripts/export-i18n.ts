#!/usr/bin/env bun
import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

const LOCALES = ['en-US', 'fr-FR', 'ar-MA'] as const;
const MESSAGES_DIR = join(process.cwd(), 'messages');
const OUTPUT_PATH = join(process.cwd(), 'i18n', 'translations.csv');

type JSONValue = string | number | boolean | null | JSONObject | JSONArray;
type JSONObject = { [key: string]: JSONValue };
type JSONArray = JSONValue[];

function flattenObject(obj: JSONObject, prefix = ''): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (Array.isArray(value)) {
      (value as JSONArray).forEach((item, i) => {
        if (item !== null && typeof item === 'object' && !Array.isArray(item)) {
          Object.assign(
            result,
            flattenObject(item as JSONObject, `${fullKey}.${i}`)
          );
        } else {
          result[`${fullKey}.${i}`] = String(item ?? '');
        }
      });
    } else if (value !== null && typeof value === 'object') {
      Object.assign(result, flattenObject(value as JSONObject, fullKey));
    } else {
      result[fullKey] = String(value ?? '');
    }
  }
  return result;
}

function escapeCSV(value: string): string {
  if (/[,"\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

const messages: Record<string, Record<string, string>> = {};
for (const locale of LOCALES) {
  const raw = readFileSync(join(MESSAGES_DIR, `${locale}.json`), 'utf-8');
  messages[locale] = flattenObject(JSON.parse(raw) as JSONObject);
}

const allKeys = Object.keys(messages['en-US']).sort();
const header = ['key', ...LOCALES].map(escapeCSV).join(',');
const rows = allKeys.map((key) =>
  [key, ...LOCALES.map((locale) => messages[locale]?.[key] ?? '')]
    .map(escapeCSV)
    .join(',')
);

const csv = [header, ...rows].join('\n');
writeFileSync(OUTPUT_PATH, csv, 'utf-8');

process.stdout.write(`✅ Exported ${allKeys.length} translation keys\n`);
process.stdout.write(`   Output: ${OUTPUT_PATH}\n`);
process.stdout.write(`   Locales: ${LOCALES.join(', ')}\n`);
