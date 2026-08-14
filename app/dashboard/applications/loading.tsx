import { Skeleton, TableSkeleton } from '@/components/ui/skeleton';

export default function ApplicationsLoading() {
  return (
    <>
      <div className="mb-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-2 h-4 w-72" />
      </div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-10 w-full max-w-md" />
        <Skeleton className="h-10 w-64" />
      </div>
      <TableSkeleton />
    </>
  );
}
