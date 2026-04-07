import { getTranslations } from 'next-intl/server';

import type { Metadata } from 'next';

import { LegalPageLayout } from '@/components/layout/LegalPageLayout';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.privacy' });
  return { title: t('title'), description: t('desc') };
}

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      eyebrow="Data Protection"
      title="Privacy Policy"
      effectiveDate="Effective: Feb 21, 2026"
      version="Version 1.0"
    >
      <div className="mb-12 rounded-r-xl border-l-2 border-aq-blue bg-secondary/30 p-6">
        <p className="text-sm leading-relaxed text-muted-foreground">
          <strong className="text-foreground">
            Moroccan Law Compliance Notice.
          </strong>{' '}
          This Privacy Policy is governed by{' '}
          <strong className="font-bold text-aq-blue">Law No. 09-08</strong> on
          the Protection of Individuals with regard to the Processing of
          Personal Data. Activities are declared to the{' '}
          <strong className="text-foreground">CNDP</strong>.
        </p>
      </div>

      <article className="prose prose-invert prose-aq max-w-none space-y-16">
        <section id="controller">
          <h2 className="mb-6 font-display text-3xl font-bold tracking-tight">
            1. Data Controller
          </h2>
          <div className="space-y-4 rounded-[2rem] border border-border/50 bg-secondary/20 p-8 shadow-sm">
            <h3 className="font-display text-xl font-bold italic text-foreground">
              Anaqio SARL
            </h3>
            <div className="grid gap-3 text-sm">
              <p className="text-muted-foreground">
                Location: Casablanca, Morocco
              </p>
              <p className="text-muted-foreground">
                Email:{' '}
                <a
                  href="mailto:privacy@anaqio.com"
                  className="text-aq-blue hover:underline"
                >
                  privacy@anaqio.com
                </a>
              </p>
              <p className="text-muted-foreground">
                CNDP Declaration:{' '}
                <span className="font-mono text-foreground">PENDING</span>
              </p>
            </div>
          </div>
        </section>

        <section id="collection">
          <h2 className="mb-6 border-t border-border/30 pt-16 font-display text-3xl font-bold tracking-tight">
            2. Personal Data We Collect
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-border/30 bg-secondary/10 p-6">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-aq-purple">
                Direct Data
              </h3>
              <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
                <li>Waitlist email &amp; names</li>
                <li>Account credentials</li>
                <li>Company information</li>
                <li>Support communications</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-border/30 bg-secondary/10 p-6">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-aq-blue">
                Automated Data
              </h3>
              <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
                <li>IP Addresses &amp; Device ID</li>
                <li>Usage patterns &amp; session info</li>
                <li>Browser configurations</li>
                <li>Error logs</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="rights">
          <h2 className="mb-6 border-t border-border/30 pt-16 font-display text-3xl font-bold tracking-tight">
            3. Your Rights
          </h2>
          <p className="mb-8 text-muted-foreground">
            Under Law 09-08, you hold the following fundamental rights:
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              [
                'Right of Access',
                'Request a copy of all personal data we hold about you.',
              ],
              [
                'Right to Rectification',
                'Request correction of inaccurate or incomplete data.',
              ],
              [
                'Right to Erasure',
                'Request deletion of data no longer necessary for purposes.',
              ],
              [
                'Right to Object',
                'Object to processing for marketing or legitimate interests.',
              ],
            ].map(([title, desc]) => (
              <div
                key={title}
                className="rounded-xl border border-border/50 bg-secondary/20 p-6"
              >
                <h4 className="mb-2 text-sm font-bold uppercase tracking-widest text-foreground">
                  {title}
                </h4>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="contact">
          <h2 className="mb-6 border-t border-border/30 pt-16 font-display text-3xl font-bold tracking-tight">
            14. Contact
          </h2>
          <div className="rounded-2xl border border-border/50 bg-secondary/50 p-8">
            <h3 className="mb-4 font-display text-xl font-bold">
              Data Protection Officer
            </h3>
            <p className="mb-2 text-muted-foreground">
              Email:{' '}
              <a
                href="mailto:privacy@anaqio.com"
                className="text-aq-blue hover:underline"
              >
                privacy@anaqio.com
              </a>
            </p>
            <p className="mb-4 text-muted-foreground">
              Address: Casablanca, Morocco
            </p>
            <div className="inline-block rounded-xl bg-aq-blue/10 p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-aq-blue">
                Regulated by CNDP — www.cndp.ma
              </p>
            </div>
          </div>
        </section>
      </article>
    </LegalPageLayout>
  );
}
