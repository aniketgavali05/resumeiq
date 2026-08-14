'use client';

import { CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StrengthCardProps {
  title?: string;
  strengths?: string[];
}

export default function StrengthCard({
  title = 'Resume Strengths',
  strengths = [],
}: StrengthCardProps) {
  const items = strengths.filter(
    (item) => typeof item === 'string' && item.trim().length > 0
  );

  return (
    <Card className="h-full rounded-2xl border-border/60 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No strengths were identified yet.
          </p>
        ) : (
          <div className="space-y-3">
            {items.map((strength, index) => (
              <div
                key={`${strength}-${index}`}
                className="flex items-start gap-3 rounded-xl border border-green-500/20 bg-green-500/5 p-3"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />

                <p className="text-sm leading-6">
                  {strength}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}