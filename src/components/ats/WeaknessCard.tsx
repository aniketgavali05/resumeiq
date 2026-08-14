'use client';

import { AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WeaknessCardProps {
  title?: string;
  weaknesses?: string[];
}

export default function WeaknessCard({
  title = 'Resume Weaknesses',
  weaknesses = [],
}: WeaknessCardProps) {
  const items = weaknesses.filter(
    (item) => typeof item === 'string' && item.trim().length > 0
  );

  return (
    <Card className="h-full rounded-2xl border-border/60 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No major weaknesses were identified.
          </p>
        ) : (
          <div className="space-y-3">
            {items.map((weakness, index) => (
              <div
                key={`${weakness}-${index}`}
                className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3"
              >
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />

                <p className="text-sm leading-6">
                  {weakness}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}