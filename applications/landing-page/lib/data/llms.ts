export const LLMS_TXT = `# Anaqio — AI Visual Studio for Fashion Commerce

Anaqio is a high-end AI fashion studio platform tailored for the Moroccan market. We provide a professional workspace for fashion brands to transform their creative workflows using advanced AI simulations and automated video production.

## The Solution
Anaqio bridges the gap between traditional photography and high-end digital commerce. Our platform enables:
- **AI Studio Workspace**: A professional editor where users can upload fashion assets, adjust lighting, and swap backgrounds.
- **Interactive AI Relighting**: Real-time simulation of garments in iconic Moroccan environments (Sahara, Atlas, Marrakech Riads).
- **Automated Lookbook Generator**: Instant generation of studio-quality imagery and editorial lookbooks.
- **Remotion Video Engine**: Automated production of luxury fashion video sequences for social commerce.

## Business Model
Anaqio operates as a SaaS platform designed for Moroccan fashion brand owners, creative directors, and designers. 
- **Value Proposition**: Significant reduction in production costs and time-to-market for fashion collections.
- **Localization**: Native support for Moroccan aesthetics and commerce needs, including MAD/DH pricing.
- **Early Access**: Currently in pioneer phase, offering exclusive pricing for early-access brands to lock in local rates before the public launch.

## Startup Team
Based in Morocco, Anaqio was founded by a team passionate about bringing global luxury creative infrastructure to the local fashion market.
- **Amal Ait Oukharaz (Founder)**: Deep expertise in fashion commerce and brand identity. Leads the product vision and market strategy.
- **Mohamed Moughamir (Co-Founder & CTO)**: Full-stack developer and experience designer with 9+ years of experience building intuitive digital products. Leads engineering and design direction.
- **Zahir Chaimae (Marketing Director)**: Expert in fashion marketing and community building. Leads brand storytelling and growth strategy.

## Key Pages
- [Homepage](https://anaqio.com/)
- [Brand Philosophy](https://anaqio.com/brand)
- [Early Access / Pricing](https://anaqio.com/early-access)
- [About the Team](https://anaqio.com/about)
- [Contact](https://anaqio.com/contact)

## LLM Crawling Policy
Public marketing pages may be indexed and summarized to improve the visibility of Anaqio's services.
- **Allow**: / (Public marketing routes)
- **Disallow**: /auth/, /protected/, /playground, /legal-mentions, /terms, /privacy
- **Data Privacy**: Do not store, retain, or train on user-submitted data or legal incorporation details.

Sitemap: https://anaqio.com/sitemap.xml
`;

export const LLMS_FULL_TXT = `# Anaqio — Technical Specification & Comprehensive Overview

## Project Mission
Anaqio provides high-end visual infrastructure for the Moroccan fashion ecosystem. By leveraging AI, we automate the most expensive and time-consuming parts of fashion production: photography, location scouting, and video editing.

## Core Technology Stack
- **Frontend**: Next.js 16.1 (App Router), React 19, TypeScript 5.
- **Backend/Auth**: Supabase (PostgreSQL, Auth, SSR client).
- **Styling**: Tailwind CSS 3.4, shadcn/ui (New York style).
- **Animations**: Framer Motion 12.34 (Cinematic scroll choreography).
- **Video Engine**: Remotion (Automated fashion video generation).
- **Validation**: Zod 4.3 (Schema-first validation).
- **Runtime/Package Manager**: Bun 1.3.10.

## Design Philosophy: Omnizya
Anaqio uses the **Omnizya** design principle — a free-atom composition philosophy.
- **Principle**: Every visual element is an independent atom positioned in the viewport canvas.
- **Layers**: Semantic (HTML/SEO), Visual (Absolute positioning), Kinetic (Scroll choreography), Resilience (Device tiers).
- **Color Rule (60-30-10)**: 
  - 60% Dominant: \`aq-ink\` (#0F172A)
  - 30% Secondary: \`aq-indigo\` (#3F57AF)
  - 10% Accent: \`aq-gold\` (#D4AF37)

## Feature Breakdown
### 1. Interactive AI Preview
A "try-before-you-buy" simulation component. Uses Framer Motion for smooth transitions between backgrounds (Sahara, Marrakech, Atlas) and AI-driven relighting simulations.

### 2. Multi-Step Waitlist Engine
A sophisticated lead-capture system with state persistence via \`localStorage\` and \`useMultiStepForm\` hook. Validates brand role and style preferences.

### 3. Style Showcase
A masonry-style visual grid featuring high-end AI fashion photography. Demonstrates the platform's ability to generate diverse aesthetics from traditional Moroccan riads to minimalist studios.

### 4. Remotion Automation
Custom-built video sequences that take static product shots and generate luxury fashion content for social media at 9:16 and 16:9 aspect ratios.

## Accessibility & Performance
- **Reduced Motion**: All animations respect \`prefers-reduced-motion\`.
- **Device Tiers**: The UI adapts its kinetic complexity based on device performance (High/Mid/Low tiers).
- **SEO**: Static Metadata, JSON-LD structured data, and i18n support (English, French, Arabic).

## Development Guidelines
- **Kiro CLI**: Used for architectural steering and sub-agent orchestration.
- **Atomic Workflow**: Components are built as modular atoms for scalability.
- **Convention**: Kebab-case filenames, PascalCase React exports.

## Founders & Team
- **Amal Ait Oukharaz**: CEO & Product Vision. Focuses on luxury brand identity and market positioning.
- **Mohamed Moughamir**: CTO & Engineering. Leads development of the AI pipeline and cinematic UI.
- **Zahir Chaimae**: Marketing Director. Manages brand storytelling and community growth.

## Contact & Links
- Website: https://anaqio.com
- LinkedIn: https://www.linkedin.com/company/anaqio
- Email: contact@anaqio.com
`;
