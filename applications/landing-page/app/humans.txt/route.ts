import { NextResponse } from 'next/server'

const HUMANS_TXT = `/* TEAM */
  Founder & CEO: Amal Ait Oukharaz
  LinkedIn: https://www.linkedin.com/in/aitoukhraz/

  Co-Founder & CTO: Mohamed Moughamir
  GitHub: https://github.com/moughamir
  Twitter: https://twitter.com/omnizya
  LinkedIn: https://www.linkedin.com/in/moughamir/

  Marketing Director: Zahir Chaimae
  Contact: marketing@anaqio.com

/* THANKS */
  Next.js, Supabase, Framer Motion, Tailwind CSS, shadcn/ui,
  Remotion, next-intl, Vercel

/* SITE */
  Last update: 2026-03-16
  Language: English, Français, العربية
  Doctype: HTML5
  IDE: Cursor, Claude Code
  Standards: WCAG 2.1 AA, HTTPS, Content Security Policy
  Components: React 19, TypeScript
  Hosting: Vercel
  Location: Casablanca, Morocco
`

export async function GET() {
  return new NextResponse(HUMANS_TXT, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}
