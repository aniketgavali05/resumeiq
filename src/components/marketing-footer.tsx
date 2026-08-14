import Link from 'next/link';
import { FileText } from 'lucide-react';

export function MarketingFooter() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"><FileText className="h-5 w-5" /></div>
              <span className="font-display text-lg font-bold">ResumeIQ</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">Land your next role faster with AI-powered resume optimization.</p>
          </div>
          <div><h4 className="text-sm font-semibold">Product</h4><ul className="mt-3 space-y-2"><li><Link href="/#features" className="text-sm text-muted-foreground hover:text-foreground">Features</Link></li><li><Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground">Pricing</Link></li></ul></div>
          <div><h4 className="text-sm font-semibold">Company</h4><ul className="mt-3 space-y-2"><li><Link href="/help" className="text-sm text-muted-foreground hover:text-foreground">Help Center</Link></li></ul></div>
          <div><h4 className="text-sm font-semibold">Legal</h4><ul className="mt-3 space-y-2"><li><span className="text-sm text-muted-foreground">Privacy Policy</span></li><li><span className="text-sm text-muted-foreground">Terms of Service</span></li></ul></div>
        </div>
        <div className="mt-8 border-t border-border/60 pt-6 text-center text-sm text-muted-foreground"><p>&copy; {new Date().getFullYear()} ResumeIQ. All rights reserved.</p></div>
      </div>
    </footer>
  );
}
