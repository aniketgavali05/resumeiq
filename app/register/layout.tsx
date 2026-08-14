import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create your free ResumeIQ account',
  description:
    'Start optimizing your resume, matching jobs, and practicing interviews — free, no credit card required.',
  alternates: { canonical: '/register' },
  robots: { index: false, follow: false },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
