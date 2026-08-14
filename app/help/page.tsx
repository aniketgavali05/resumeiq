'use client';

import { useState } from 'react';
import { Search, ChevronDown, ChevronUp, FileText, HelpCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MarketingNav } from '@/components/marketing-nav';
import { MarketingFooter } from '@/components/marketing-footer';
import { FadeIn } from '@/components/motion';

const helpCategories = [
  {
    title: 'Getting Started',
    questions: [
      { q: 'How do I upload my resume?', a: 'Go to the Resumes section in your dashboard and click "Upload Resume". We support PDF, DOCX, and TXT formats.' },
      { q: 'How does ATS scoring work?', a: 'Our AI analyzes your resume against common ATS parsing rules and job description keywords to give you a compatibility score.' },
      { q: 'What is a match score?', a: 'The match score compares your skills and experience to a job description, giving you a percentage that indicates how well you fit.' },
    ],
  },
  {
    title: 'Account and Billing',
    questions: [
      { q: 'How do I change my password?', a: 'Go to Settings > Security and enter your current and new password.' },
      { q: 'Can I cancel my subscription?', a: 'Yes, you can cancel anytime from Settings. You keep access until the end of your billing period.' },
      { q: 'How do I get a refund?', a: 'We offer a 30-day money-back guarantee. Contact support to request a refund.' },
    ],
  },
  {
    title: 'Features',
    questions: [
      { q: 'How many resumes can I analyze?', a: 'Free plan: 1 resume. Pro plan: unlimited. Teams plan: unlimited across all seats.' },
      { q: 'Can I generate cover letters?', a: 'Yes, the Cover Letters feature generates personalized cover letters based on your resume and the job description.' },
      { q: 'How does interview prep work?', a: 'We generate practice questions based on the role and company you are applying to, with suggested answers.' },
    ],
  },
];

export default function HelpPage() {
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = helpCategories.map((cat) => ({
    ...cat,
    questions: cat.questions.filter(
      (q) => q.q.toLowerCase().includes(query.toLowerCase()) || q.a.toLowerCase().includes(query.toLowerCase())
    ),
  })).filter((cat) => cat.questions.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <MarketingNav />
      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        <FadeIn className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary"><HelpCircle className="h-8 w-8" /></div>
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Help Center</h1>
          <p className="mt-4 text-lg text-muted-foreground">Find answers to common questions.</p>
        </FadeIn>
        <div className="mx-auto mt-8 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search for help..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" />
          </div>
        </div>
        <div className="mt-12 space-y-8">
          {filtered.map((cat, ci) => (
            <FadeIn key={cat.title} delay={Math.min(ci * 0.05, 0.3)}>
              <h2 className="mb-4 font-display text-xl font-semibold">{cat.title}</h2>
              <div className="space-y-3">
                {cat.questions.map((item) => {
                  const id = `${cat.title}-${item.q}`;
                  const isOpen = expanded === id;
                  return (
                    <Card key={id} className="rounded-2xl border-border/60">
                      <button className="flex w-full items-center justify-between p-5 text-left" onClick={() => setExpanded(isOpen ? null : id)} aria-expanded={isOpen}>
                        <span className="font-medium">{item.q}</span>
                        {isOpen ? <ChevronUp className="h-5 w-5 shrink-0 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground" />}
                      </button>
                      {isOpen && <div className="border-t border-border/60 px-5 py-4"><p className="text-sm leading-relaxed text-muted-foreground">{item.a}</p></div>}
                    </Card>
                  );
                })}
              </div>
            </FadeIn>
          ))}
        </div>
        {filtered.length === 0 && <div className="py-16 text-center"><p className="text-muted-foreground">No results found. Try a different search.</p></div>}
        <FadeIn className="mt-16">
          <Card className="rounded-2xl border-border/60 bg-primary/5">
            <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><FileText className="h-6 w-6" /></div>
              <div><h3 className="font-display text-lg font-semibold">Still need help?</h3><p className="mt-1 text-sm text-muted-foreground">Our support team is here to help you.</p></div>
              <Button>Contact Support</Button>
            </CardContent>
          </Card>
        </FadeIn>
      </section>
      <MarketingFooter />
    </div>
  );
}
