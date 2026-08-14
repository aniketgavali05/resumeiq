import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';

import './globals.css';

import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/constants/AuthContext';

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const display = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ResumeIQ — AI-Powered Job Search Platform',
  description:
    'Land your next role faster with AI-powered resume optimization, job matching, and interview prep.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
  manifest: '/manifest.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${display.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans">
        <ThemeProvider>
          <AuthProvider>
            <a href="#main-content" className="skip-link">
              Skip to content
            </a>

            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}