'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FileText, ArrowRight } from 'lucide-react';
import axios from 'axios';

import { loginUser } from '@/services/authService';
import { useAuth } from '@/constants/AuthContext';

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

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      alert('Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      alert('Please enter a valid email address.');
      return;
    }

    if (password.length < 8) {
      alert('Password must be at least 8 characters.');
      return;
    }

    try {
      setLoading(true);

      const response = await loginUser({
        email: normalizedEmail,
        password,
      });

      if (!response?.token) {
        throw new Error(
          'Login succeeded but no authentication token was returned.'
        );
      }

      localStorage.setItem('token', response.token);

      await refreshUser();

      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? (
            error.response?.data as
              | { message?: string }
              | undefined
          )?.message
        : error instanceof Error
          ? error.message
          : undefined;

      alert(message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
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

            <CardTitle className="text-2xl">
              Welcome Back
            </CardTitle>

            <CardDescription>
              Sign in to your ResumeIQ account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleLogin}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>

                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="password">Password</Label>

                  <Link
                    href="/forgot-password"
                    className="text-xs text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Minimum 8 characters"
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}

                {!loading && (
                  <ArrowRight className="ml-2 h-4 w-4" />
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              {"Don't have an account?"}{' '}
              <Link
                href="/register"
                className="font-medium text-primary hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}