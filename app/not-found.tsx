import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center">
        <h1 className="font-display text-6xl font-bold text-primary">404</h1>
        <p className="mt-4 text-lg text-muted-foreground">This page could not be found.</p>
        <Button className="mt-6" asChild>
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </div>
  );
}
