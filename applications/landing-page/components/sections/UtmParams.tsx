'use client';
import { type UTM_KEYS } from './UTM_KEYS';

export type UtmParams = Partial<
  Record<(typeof UTM_KEYS)[number] | 'referrer', string>
>;
