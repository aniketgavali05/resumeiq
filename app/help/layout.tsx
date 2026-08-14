import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Help Center — Guides & FAQs',
  description:
    'Learn how ResumeIQ works — ATS scoring, interview prep, cover letters, career roadmaps, billing, and more.',
  alternates: { canonical: '/help' },
  openGraph: {
    title: 'ResumeIQ Help Center — Guides & FAQs',
    description:
      'Learn how ResumeIQ works — ATS scoring, interview prep, cover letters, and more.',
    url: 'https://resumeiq.app/help',
  },
};

export default function HelpLayout({ children }: { children: React.ReactNode }) {
  return children;
}
