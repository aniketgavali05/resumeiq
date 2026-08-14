'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';

export function MarketingNav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"><FileText className="h-5 w-5" /></div>
          <span className="font-display text-lg font-bold">ResumeIQ</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Features</Link>
          <Link href="/pricing" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Pricing</Link>
          <Link href="/help" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Help</Link>
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <Button variant="ghost" asChild><Link href="/login">Sign in</Link></Button>
          <Button asChild><Link href="/register">Get started</Link></Button>
        </div>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
      </div>
      {open && (
        <div className="border-t border-border/60 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <Link href="/#features" onClick={() => setOpen(false)} className="text-sm text-muted-foreground">Features</Link>
            <Link href="/pricing" onClick={() => setOpen(false)} className="text-sm text-muted-foreground">Pricing</Link>
            <Link href="/help" onClick={() => setOpen(false)} className="text-sm text-muted-foreground">Help</Link>
            <div className="flex gap-2 pt-2">
              <ThemeToggle />
              <Button variant="outline" className="flex-1" asChild><Link href="/login">Sign in</Link></Button>
              <Button className="flex-1" asChild><Link href="/register">Get started</Link></Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
