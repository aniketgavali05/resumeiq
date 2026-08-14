import { Skeleton, StatCardSkeleton, ChartSkeleton } from '@/components/ui/skeleton';

export default function AnalyticsLoading() {
  return (
    <>
      <div className="mb-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-2 h-4 w-72" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2"><ChartSkeleton /></div>
        <ChartSkeleton />
      </div>
      <div className="mt-6">
        <ChartSkeleton />
      </div>
    </>
  );
}
