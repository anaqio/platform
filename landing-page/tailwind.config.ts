import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        // Anaqio Brand Colors
        aq: {
          navy: '#1B2F52',
          gold: '#D4AF37',
          lime: '#CCFF33',
          blue: '#2563EB',
          purple: '#7C3AED',
          white: '#F8F6F0',
          ink: '#0F172A',
          slate: '#334155',
          muted: '#94A3B8',
          border: '#E2E8F0',
          surface: '#F1F5F9',
          grad: {
            start: '#3F57AF',
            mid1: '#484DA9',
            mid2: '#6049A8',
            end: '#6F47A7',
          },
        },
      },
      fontFamily: {
        display: ['var(--font-syne)', 'sans-serif'],
        ui: ['var(--font-jakarta)', 'sans-serif'],
        body: ['var(--font-jakarta)', 'sans-serif'],
        label: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
        editorial: ['var(--font-instrument-serif)', 'Georgia', 'serif'],
        wordmark: ['Georgia', 'serif'],
        sans: ['var(--font-jakarta)', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'monospace'],
        serif: ['var(--font-instrument-serif)', 'serif'],
      },
      letterSpacing: {
        display: '0.01em',
        editorial: '0.04em',
        label: '0.3em',
        'wide-xl': '0.4em',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 4px)',
        sm: 'calc(var(--radius) - 8px)',
        xl: '16px',
        full: '999px',
      },
    },
  },
  plugins: [animate],
} satisfies Config;
