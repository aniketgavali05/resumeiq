
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FileText, ArrowRight } from 'lucide-react';
import axios from 'axios';

import { registerUser } from '@/services/authService';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

import { FadeIn } from '@/components/motion';

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const normalizedName = fullName.trim();
    const normalizedEmail =
      email.trim().toLowerCase();

    if (normalizedName.length < 5) {
      alert('Please enter your full name.');
      return;
    }

    const nameParts = normalizedName
      .split(/\s+/)
      .filter(Boolean);

    if (nameParts.length < 2) {
      alert(
        'Please enter both your first name and last name.'
      );
      return;
    }

    const firstName = nameParts[0];
    const lastName = nameParts
      .slice(1)
      .join(' ');

    if (firstName.length < 2) {
      alert(
        'First name must be at least 2 characters.'
      );
      return;
    }

    if (lastName.length < 2) {
      alert(
        'Last name must be at least 2 characters.'
      );
      return;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      alert(
        'Please enter a valid email address.'
      );
      return;
    }

    if (password.length < 8) {
      alert(
        'Password must be at least 8 characters.'
      );
      return;
    }

    if (password.length > 100) {
      alert(
        'Password cannot exceed 100 characters.'
      );
      return;
    }

    try {
      setLoading(true);

      await registerUser({
        firstName,
        lastName,
        email: normalizedEmail,
        password,
      });

      /*
       * Important:
       * Do NOT store the registration response token.
       * Do NOT call refreshUser().
       * The user must explicitly log in.
       */

      alert(
        'Account created successfully. Please sign in.'
      );

      router.push('/login');
      router.refresh();
    } catch (error) {
      const message =
        axios.isAxiosError(error)
          ? (
              error.response?.data as
                | { message?: string }
                | undefined
            )?.message
          : error instanceof Error
            ? error.message
            : undefined;

      alert(
        message ||
          'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <FadeIn className="w-full max-w-md">
        <Card className="rounded-2xl border-border/60 shadow-premium">
          <CardHeader className="text-center">
            <Link
              href="/"
              className="mx-auto mb-4 flex items-center gap-2"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <FileText className="h-6 w-6" />
              </div>
            </Link>

            <CardTitle>
              Create your account
            </CardTitle>

            <CardDescription>
              Start your job search journey today
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleRegister}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="fullName">
                  Full Name
                </Label>

                <Input
                  id="fullName"
                  placeholder="John Doe"
                  autoComplete="name"
                  minLength={5}
                  required
                  value={fullName}
                  onChange={(e) =>
                    setFullName(e.target.value)
                  }
                />

                <p className="text-xs text-muted-foreground">
                  Enter your first and last name.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email
                </Label>

                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  Password
                </Label>

                <Input
                  id="password"
                  type="password"
                  placeholder="Minimum 8 characters"
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={100}
                  required
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading
                  ? 'Creating Account...'
                  : 'Create Account'}

                {!loading && (
                  <ArrowRight className="ml-2 h-4 w-4" />
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-medium text-primary hover:underline"
              >
                Sign In
              </Link>
            </p>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}

