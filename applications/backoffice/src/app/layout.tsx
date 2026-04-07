import type { Metadata } from 'next'

import './globals.css'

export const metadata: Metadata = {
  title: 'Anaqio Backoffice',
  description: 'CRM & Campaign Management for Anaqio',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  )
}
