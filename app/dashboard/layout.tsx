import { DashboardShell } from '@/components/dashboard-shell';

export const metadata = {
  title: 'Dashboard — ResumeIQ',
  description: 'Your AI-powered job search dashboard.',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}