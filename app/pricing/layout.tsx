import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing — Simple, transparent plans',
  description:
    'Start free, upgrade when you are ready. ResumeIQ offers flexible plans for job seekers, career coaches, and recruiting teams.',
  alternates: { canonical: '/pricing' },
  openGraph: {
    title: 'ResumeIQ Pricing — Simple, transparent plans',
    description:
      'Start free, upgrade when you are ready. Flexible plans for job seekers, coaches, and teams.',
    url: 'https://resumeiq.app/pricing',
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
