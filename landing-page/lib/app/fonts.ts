import { Instrument_Serif, Plus_Jakarta_Sans, Syne } from 'next/font/google';

const syne = Syne({
  variable: '--font-syne',
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const jakartaSans = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const instrumentSerif = Instrument_Serif({
  variable: '--font-instrument-serif',
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  display: 'swap',
  preload: false,
});

export const appFonts = {
  syne,
  jakartaSans,
  instrumentSerif,
};
