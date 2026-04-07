import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Syne } from 'next/font/google'
import { ThemeProvider } from 'next-themes'

import { Toaster } from '@/components/ui/sonner'

import './globals.css'

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Anaqio — Virtual Try-On Studio',
  description: 'Your Digital Atelier — Create. Style. Launch.',
}

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  preload: true,
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  preload: true,
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="dark" suppressHydrationWarning>
      <body className={`${syne.variable} ${plusJakarta.variable} font-body antialiased`}>
        <ThemeProvider attribute="class" forcedTheme="dark">
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
