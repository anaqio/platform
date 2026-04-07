import { getTranslations } from 'next-intl/server';

import type { Metadata } from 'next';

import { LegalPageLayout } from '@/components/layout/LegalPageLayout';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.legal' });
  return {
    title: t('title'),
    description: t('desc'),
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
        'max-image-preview': 'none',
        'max-snippet': 0,
        'max-video-preview': 0,
      },
    },
  };
}

export default function LegalMentionsPage() {
  return (
    <LegalPageLayout
      eyebrow="Corporate Identity"
      title="Legal Mentions"
      subtitle="Mentions Légales"
      effectiveDate="Last Updated: Feb 21, 2026"
    >
      <div className="mb-12 rounded-r-xl border-l-2 border-aq-blue bg-secondary/30 p-6">
        <p className="text-sm leading-relaxed text-muted-foreground">
          <strong className="font-bold text-foreground">
            Mandatory Disclosure.
          </strong>{' '}
          In accordance with{' '}
          <strong className="text-aq-blue">Law No. 53-05</strong> on the
          Electronic Exchange of Legal Data and applicable Moroccan commercial
          legislation, the following information is published for all users of
          this platform.
        </p>
      </div>

      <article className="space-y-12">
        <section className="space-y-6 rounded-[2rem] border border-border/50 bg-secondary/20 p-8 shadow-sm">
          <h2 className="border-b border-border/30 pb-4 font-display text-2xl font-bold tracking-tight text-foreground">
            1. Publisher / Éditeur
          </h2>
          <div className="grid gap-4 text-sm">
            {[
              ['Company', 'Anaqio Studio'],
              ['Structure', 'SARL au capital de 10,000 MAD'],
              ['Headquarters', 'Casablanca, Morocco'],
              ['Registration', 'RC Casablanca n° PENDING'],
              ['Tax ID / IF', 'n° PENDING'],
              ['ICE', 'PENDING'],
              ['CNSS', 'PENDING'],
            ].map(([label, value]) => (
              <div
                key={label}
                className="grid grid-cols-1 gap-2 sm:grid-cols-[160px_1fr] sm:gap-8"
              >
                <span className="pt-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  {label}
                </span>
                <span className="font-medium text-foreground">{value}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6 rounded-[2rem] border border-border/50 bg-secondary/20 p-8 shadow-sm">
          <h2 className="border-b border-border/30 pb-4 font-display text-2xl font-bold tracking-tight text-foreground">
            2. Responsibility
          </h2>
          <div className="grid gap-4 text-sm">
            {[
              ['Director', 'Amal Ait Oukharaz'],
              ['Contact', 'legal@anaqio.com'],
            ].map(([label, value]) => (
              <div
                key={label}
                className="grid grid-cols-1 gap-2 sm:grid-cols-[160px_1fr] sm:gap-8"
              >
                <span className="pt-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  {label}
                </span>
                <span
                  className={
                    label === 'Contact'
                      ? 'font-bold text-aq-blue'
                      : 'font-semibold text-foreground'
                  }
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6 rounded-[2rem] border border-border/50 bg-secondary/20 p-8 shadow-sm">
          <h2 className="border-b border-border/30 pb-4 font-display text-2xl font-bold tracking-tight text-foreground">
            3. Hosting / Hébergement
          </h2>
          <div className="grid gap-4 text-sm">
            {[
              ['Provider', 'Vercel Inc.'],
              ['Address', '440 N Barranca Ave #4133, Covina, CA 91723'],
              ['Website', 'www.vercel.com'],
            ].map(([label, value]) => (
              <div
                key={label}
                className="grid grid-cols-1 gap-2 sm:grid-cols-[160px_1fr] sm:gap-8"
              >
                <span className="pt-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  {label}
                </span>
                <span className="text-foreground">{value}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6 p-8">
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground">
            4. Intellectual Property
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            The entire content of this site — including but not limited to
            graphics, images, texts, videos, and AI models — is the exclusive
            property of
            <strong className="text-foreground"> Anaqio Studio</strong>. Any
            reproduction, distribution, or publication, even partial, is
            strictly prohibited without express written consent.
          </p>
          <div className="rounded-2xl border border-aq-blue/20 bg-aq-blue/5 p-6">
            <p className="text-xs font-medium italic leading-relaxed text-muted-foreground">
              For legal inquiries or notification of illicit content, please
              contact the legal department at legal@anaqio.com.
            </p>
          </div>
        </section>
      </article>
    </LegalPageLayout>
  );
}
