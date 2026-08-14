import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ResumeIQ — AI Resume Analyzer & Interview Coach',
    short_name: 'ResumeIQ',
    description:
      'Optimize your resume, match jobs, practice interviews, and track your career growth with AI-powered insights.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0e17',
    theme_color: '#0ea5e9',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  };
}
