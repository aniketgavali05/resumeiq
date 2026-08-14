'use client';

import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AuroraBackground } from '@/components/aurora-background';
import { MarketingNav } from '@/components/marketing-nav';
import { MarketingFooter } from '@/components/marketing-footer';
import { FadeIn, Stagger, StaggerItem } from '@/components/motion';
import { usePricing } from '@/hooks';
import { CardSkeleton } from '@/components/ui/skeleton';
import { cn } from '@/utils';

export default function PricingPage() {
  const { data: plans, loading } = usePricing();

  return (
    <div className="min-h-screen bg-background">
      <AuroraBackground className="min-h-screen">
        <MarketingNav />
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <FadeIn className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary" className="mb-6">Pricing</Badge>
            <h1 className="font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl">Choose the plan that fits</h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">Start free. Upgrade when you are ready. Cancel anytime.</p>
          </FadeIn>
          <Stagger className="mx-auto mt-12 grid max-w-5xl gap-6 sm:mt-16 md:grid-cols-3">
            {loading ? (
              <div className="col-span-full grid gap-6 sm:grid-cols-3">{Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}</div>
            ) : (plans ?? []).map((p) => (
              <StaggerItem key={p.name}>
                <Card className={cn('relative h-full rounded-2xl transition-all duration-300', p.highlight ? 'border-primary/50 shadow-glow' : 'border-border/60 hover:border-primary/30 hover:shadow-soft')}>
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
          <FadeIn className="mx-auto mt-20 max-w-3xl">
            <h2 className="text-center font-display text-2xl font-bold tracking-tight sm:text-3xl">Frequently asked questions</h2>
            <div className="mt-8 space-y-4">
              {faqs.map((faq) => (
                <Card key={faq.q} className="rounded-2xl border-border/60">
                  <CardContent className="p-5">
                    <h3 className="font-semibold">{faq.q}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </FadeIn>
          <FadeIn className="mt-16 text-center">
            <Button size="lg" asChild><Link href="/register">Get started for free<ArrowRight className="ml-2 h-5 w-5" /></Link></Button>
          </FadeIn>
        </section>
        <MarketingFooter />
      </AuroraBackground>
    </div>
  );
}

const faqs = [
  { q: 'Can I cancel anytime?', a: 'Yes, you can cancel your subscription at any time. You will keep access until the end of your billing period.' },
  { q: 'Is there a free trial?', a: 'The Free plan is free forever. The Pro plan includes a 7-day free trial with no credit card required.' },
  { q: 'Do you offer refunds?', a: 'We offer a 30-day money-back guarantee on all paid plans. No questions asked.' },
  { q: 'Can I switch plans?', a: 'You can upgrade or downgrade your plan at any time. Changes take effect immediately.' },
];
