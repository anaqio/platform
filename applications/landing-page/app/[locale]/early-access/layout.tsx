import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Anaqio — AI-Driven Virtual Studio for Fashion Commerce',
  description:
    'Anaqio is the AI-powered virtual studio reshaping how fashion brands create, stage, and sell. Join the waitlist.',
};

export default function EarlyAccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
