import { Skeleton, ChartSkeleton, CardSkeleton } from '@/components/ui/skeleton';

export default function SkillsLoading() {
  return (
    <>
      <div className="mb-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-2 h-4 w-72" />
      </div>
      <ChartSkeleton />
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </>
  );
}
