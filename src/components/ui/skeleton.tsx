import { cn } from '@/utils';

export function Skeleton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={cn('relative overflow-hidden rounded-md bg-muted/50', className)} style={style}>
      <div className="absolute inset-0 animate-shimmer" />
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-border/60 p-6">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="mt-4 h-8 w-2/3" />
      <Skeleton className="mt-4 h-20 w-full" />
    </div>
  );
}

export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      <Skeleton className="h-10 w-full" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" style={{ animationDelay: `${i * 0.1}s` }} />
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="rounded-2xl border border-border/60 p-6">
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="mt-6 h-48 w-full" />
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border/60 p-5">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <Skeleton className="h-3 w-16" />
      </div>
      <Skeleton className="mt-4 h-7 w-20" />
      <Skeleton className="mt-1.5 h-3 w-24" />
    </div>
  );
}
