'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FileText, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FadeIn } from '@/components/motion';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <FadeIn className="w-full max-w-md">
        <Card className="rounded-2xl border-border/60 shadow-premium">
          <CardHeader className="text-center">
            <Link href="/" className="mx-auto mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"><FileText className="h-6 w-6" /></div>
            </Link>
            <CardTitle className="text-2xl">Reset password</CardTitle>
            <CardDescription>{sent ? 'Check your email for a reset link' : 'Enter your email to receive a reset link'}</CardDescription>
          </CardHeader>
          <CardContent>
            {!sent ? (
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
                <div className="space-y-2">
                  <Label htmlFor="forgot-email">Email</Label>
                  <Input id="forgot-email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <Button type="submit" className="w-full" size="lg">Send reset link<ArrowRight className="ml-2 h-4 w-4" /></Button>
              </form>
            ) : (
              <div className="text-center">
                <p className="text-sm text-muted-foreground">We&apos;ve sent a password reset link to <span className="font-medium text-foreground">{email}</span>.</p>
                <Button variant="outline" className="mt-4" asChild><Link href="/login"><ArrowLeft className="mr-2 h-4 w-4" />Back to sign in</Link></Button>
              </div>
            )}
            <p className="mt-6 text-center text-sm text-muted-foreground">Remember your password? <Link href="/login" className="font-medium text-primary hover:underline">Sign in</Link></p>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}
