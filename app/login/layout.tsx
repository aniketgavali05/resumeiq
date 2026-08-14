import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign in to ResumeIQ',
  description: 'Sign in to your ResumeIQ account to access your dashboard, resumes, and interview coach.',
  alternates: { canonical: '/login' },
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
