'use client';

import { CheckCircle2, Clock, Circle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/page-header';
import { FadeIn } from '@/components/motion';
import { CardSkeleton } from '@/components/ui/skeleton';
import { useRoadmap } from '@/hooks';
import type { RoadmapItem } from '@/types';

const statusConfig: Record<RoadmapItem['status'], { icon: typeof CheckCircle2; label: string; variant: 'success' | 'warning' | 'secondary' }> = {
  completed: { icon: CheckCircle2, label: 'Completed', variant: 'success' },
  'in-progress': { icon: Clock, label: 'In Progress', variant: 'warning' },
  pending: { icon: Circle, label: 'Pending', variant: 'secondary' },
};

export default function RoadmapPage() {
  const { data: roadmap, loading } = useRoadmap();

  if (loading) {
    return (
      <>
        <PageHeader title="Roadmap" description="Your personalized learning path." />
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Roadmap" description="Your personalized learning path." />
      <div className="relative">
        <div className="absolute left-[19px] top-2 bottom-2 w-px bg-border" />
        <div className="space-y-4">
          {(roadmap ?? []).map((item, i) => {
            const config = statusConfig[item.status];
            const Icon = config.icon;
            return (
              <FadeIn key={item.id} delay={Math.min(i * 0.05, 0.3)}>
                <div className="relative flex gap-4">
                  <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-background bg-card">
                    <Icon className={`h-5 w-5 ${item.status === 'completed' ? 'text-success' : item.status === 'in-progress' ? 'text-warning' : 'text-muted-foreground'}`} />
                  </div>
                  <Card className="flex-1 rounded-2xl border-border/60 transition-all hover:shadow-soft">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">Week {item.week}</Badge>
                            <Badge variant={config.variant}>{config.label}</Badge>
                          </div>
                          <h3 className="mt-2 font-display text-base font-semibold">{item.title}</h3>
                          <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                        </div>
                        <Badge variant="secondary" className="shrink-0">{item.category}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </>
  );
}
