'use client';

import { Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SuggestionCardProps {
  title?: string;
  suggestions?: string[];
}

export default function SuggestionCard({
  title = 'AI Suggestions',
  suggestions = [],
}: SuggestionCardProps) {
  const items = suggestions.filter(
    (item) => typeof item === 'string' && item.trim().length > 0
  );

  return (
    <Card className="rounded-2xl border-border/60 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Lightbulb className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No suggestions are available yet.
          </p>
        ) : (
          <div className="space-y-3">
            {items.map((suggestion, index) => (
              <div
                key={`${suggestion}-${index}`}
                className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-3"
              >
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {index + 1}
                </div>

                <p className="text-sm leading-6">
                  {suggestion}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}