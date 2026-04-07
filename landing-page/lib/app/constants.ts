export const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'https://anaqio.com';

export const appConstants = {
  name: 'Anaqio',
  title: 'Anaqio — AI Visual Studio for Fashion Commerce',
  titleTemplate: '%s | Anaqio',
  description:
    "Generate studio-quality fashion imagery instantly with Anaqio's AI Visual Studio. Empowering fashion brands with cutting-edge digital tools for modern commerce.",
  descriptionShort:
    'Generate studio-quality fashion imagery instantly. Empowering fashion brands with cutting-edge AI tools for modern commerce.',
  twitterDescription:
    'Generate studio-quality fashion imagery instantly. Join the waitlist for early access.',
  foundingDate: '2026-02',
  keywords: [
    'AI fashion photography',
    'virtual studio',
    'fashion commerce',
    'AI imagery',
    'digital fashion tools',
    'fashion brand marketing',
    'automated studio shoots',
  ],
  authors: [{ name: 'Anaqio Team' }],
  creator: 'Anaqio',
};

export const appFounders = [
  {
    name: 'Amal AIT OUKHARAZ',
    role: 'Founder & CEO',
    linkedin: 'https://www.linkedin.com/in/aitoukhraz/',
  },
  {
    name: 'Mohamed MOUGHAMIR',
    role: 'Co-Founder & CTO',
    linkedin: 'https://www.linkedin.com/in/moughamir/',
  },
];

// Non-founder team members — kept separate so they are never emitted as
// schema.org founders in structured data or layout microdata.
export const appTeam = [
  {
    name: 'Zahir CHAIMAE',
    role: 'Marketing Director',
    linkedin: 'https://shazo.anaqio.com',
    email: 'marketing@anaqio.com',
  },
];

export const appSocials = {
  twitter: 'https://twitter.com/anaqio',
  twitterHandle: '@anaqio',
  linkedin: 'https://www.linkedin.com/company/anaqio',
  instagram: 'https://www.instagram.com/anaqio',
};
