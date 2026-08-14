'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BarChart3, CheckCircle2, FileText, Target, Zap, Sparkles, Briefcase, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AuroraBackground } from '@/components/aurora-background';
import { MarketingNav } from '@/components/marketing-nav';
import { MarketingFooter } from '@/components/marketing-footer';
import { FadeIn, Stagger, StaggerItem, AnimatedNumber } from '@/components/motion';
import { useTestimonials, usePricing } from '@/hooks';
import { CardSkeleton } from '@/components/ui/skeleton';

const features = [
  { icon: FileText, title: 'ATS Resume Scoring', description: 'Get instant ATS compatibility scores and actionable suggestions to beat the bots.' },
  { icon: Sparkles, title: 'Smart Job Matching', description: 'AI matches your skills to thousands of jobs and ranks them by fit score.' },
  { icon: MessageSquare, title: 'Interview Prep', description: 'Practice with AI-generated questions tailored to each role and company.' },
  { icon: Target, title: 'Skill Gap Analysis', description: 'See exactly what skills you need to learn to qualify for your dream roles.' },
  { icon: Briefcase, title: 'Application Tracker', description: 'Track every application, interview, and offer in one beautiful dashboard.' },
  { icon: Zap, title: 'Cover Letter Generator', description: 'Generate personalized cover letters in seconds with the right tone for each job.' },
];

const stats = [
  { value: 250000, suffix: '+', label: 'Professionals hired' },
  { value: 92, suffix: '%', label: 'ATS pass rate' },
  { value: 3, suffix: 'x', label: 'More interviews' },
  { value: 18, suffix: ' days', label: 'Avg. time to offer' },
];

export default function LandingPage() {
  const { data: testimonials, loading: testimonialsLoading } = useTestimonials();
  const { data: pricingPlans, loading: pricingLoading } = usePricing();

  return (
    <div className="min-h-screen bg-background">
      <AuroraBackground variant="bold" className="min-h-screen">
        <MarketingNav />
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <FadeIn>
              <Badge variant="secondary" className="mb-6"><Sparkles className="mr-1.5 h-3.5 w-3.5" /> AI-powered job search</Badge>
              <h1 className="font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">Land your next role <span className="text-primary">faster</span></h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">ResumeIQ uses AI to optimize your resume, match you with the right jobs, and prepare you for interviews — all in one place.</p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button size="lg" asChild><Link href="/register">Get started for free<ArrowRight className="ml-2 h-5 w-5" /></Link></Button>
                <Button size="lg" variant="outline" asChild><Link href="/pricing">View pricing</Link></Button>
              </div>
            </FadeIn>
          </div>
          <Stagger className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((s) => (
              <StaggerItem key={s.label} className="text-center">
                <AnimatedNumber value={s.value} suffix={s.suffix} className="font-display text-3xl font-bold text-primary sm:text-4xl" />
                <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      </AuroraBackground>

      <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Everything you need to get hired</h2>
          <p className="mt-4 text-lg text-muted-foreground">From resume optimization to interview prep, ResumeIQ has every tool you need.</p>
        </FadeIn>
        <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <StaggerItem key={f.title}>
              <Card className="h-full rounded-2xl border-border/60 transition-all hover:border-primary/30 hover:shadow-premium">
                <CardContent className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><f.icon className="h-6 w-6" /></div>
                  <h3 className="mt-4 font-display text-lg font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Loved by job seekers</h2>
          <p className="mt-4 text-lg text-muted-foreground">Join 250,000+ professionals who found their next role with ResumeIQ.</p>
        </FadeIn>
        <Stagger className="mt-12 grid gap-5 sm:grid-cols-3">
          {testimonialsLoading ? (
            <div className="col-span-full grid gap-5 sm:grid-cols-3">{Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}</div>
          ) : (testimonials ?? []).map((t) => (
            <StaggerItem key={t.name}>
              <Card className="h-full rounded-2xl border-border/60">
                <CardContent className="p-6">
                  <p className="text-sm leading-relaxed text-foreground">&ldquo;{t.content}&rdquo;</p>
                  <div className="mt-4 flex items-center gap-3">
                    <Image src={t.avatar} alt={t.name} width={40} height={40} className="h-10 w-10 rounded-full object-cover" />
                    <div><p className="text-sm font-semibold">{t.name}</p><p className="text-xs text-muted-foreground">{t.role} at {t.company}</p></div>
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Simple, transparent pricing</h2>
          <p className="mt-4 text-lg text-muted-foreground">Start free. Upgrade when you are ready.</p>
        </FadeIn>
        <Stagger className="mt-12 grid gap-5 sm:grid-cols-3">
          {pricingLoading ? (
            <div className="col-span-full grid gap-5 sm:grid-cols-3">{Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}</div>
          ) : (pricingPlans ?? []).map((p) => (
            <StaggerItem key={p.name}>
              <Card className={`relative h-full rounded-2xl transition-all duration-300 ${p.highlight ? 'border-primary/50 shadow-glow' : 'border-border/60 hover:border-primary/30 hover:shadow-soft'}`}>
                {p.highlight && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">Most popular</Badge>}
                <CardContent className="p-6">
                  <h3 className="font-display text-lg font-semibold">{p.name}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
                  <div className="mt-5 flex items-baseline gap-1"><span className="font-display text-4xl font-bold">${p.price}</span><span className="text-sm text-muted-foreground">/{p.period}</span></div>
                  <ul className="mt-6 space-y-3">
                    {p.features.slice(0, 5).map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-chart-2" /><span className="text-muted-foreground">{f}</span></li>
                    ))}
                  </ul>
                  <Button className="mt-6 w-full" variant={p.highlight ? 'default' : 'outline'} asChild><Link href="/register">{p.cta}</Link></Button>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <AuroraBackground className="overflow-hidden rounded-3xl border border-border/60 px-5 py-12 text-center sm:px-6 sm:py-16">
          <FadeIn>
            <BarChart3 className="mx-auto h-10 w-10 text-primary" />
            <h2 className="mt-5 font-display text-2xl font-bold tracking-tight text-balance sm:text-4xl">Ready to land your next role?</h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">Join 250,000+ professionals using ResumeIQ to get hired faster.</p>
            <Button size="lg" asChild className="mt-6 h-12 rounded-xl text-base sm:mt-8"><Link href="/register">Get started for free<ArrowRight className="ml-2 h-5 w-5" /></Link></Button>
          </FadeIn>
        </AuroraBackground>
      </section>

      <MarketingFooter />
    </div>
  );
}
