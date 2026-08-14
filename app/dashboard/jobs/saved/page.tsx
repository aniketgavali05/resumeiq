'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import {
  ArrowLeft,
  Bookmark,
  Briefcase,
  ExternalLink,
  MapPin,
  RefreshCw,
  Trash2,
} from 'lucide-react';

import savedJobService, {
  type SavedJobResponse,
} from '@/services/savedJobService';

import {
  Card,
  CardContent,
} from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header';
import { CardSkeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/empty-state';

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] =
    useState<SavedJobResponse[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [removingJobId, setRemovingJobId] =
    useState<number | null>(null);

  const loadSavedJobs = async () => {
    try {
      setLoading(true);
      setError('');

      const result =
        await savedJobService.getMySavedJobs();

      setSavedJobs(
        Array.isArray(result)
          ? result
          : []
      );
    } catch (err) {
      console.error(
        'Failed to load saved jobs:',
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load saved jobs.'
      );

      setSavedJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadSavedJobs();
  }, []);

  const removeSavedJob = async (
    jobId: number
  ) => {
    try {
      setRemovingJobId(jobId);
      setError('');

      await savedJobService.unsaveJob(
        jobId
      );

      setSavedJobs((current) =>
        current.filter(
          (savedJob) =>
            savedJob.jobId !== jobId
        )
      );
    } catch (err) {
      console.error(
        'Failed to remove saved job:',
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to remove saved job.'
      );
    } finally {
      setRemovingJobId(null);
    }
  };

  if (loading) {
    return (
      <>
        <PageHeader
          title="Saved Jobs"
          description="Jobs you saved for later."
          action={
            <Button
              variant="outline"
              disabled
            >
              Loading...
            </Button>
          }
        />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map(
            (_, index) => (
              <CardSkeleton key={index} />
            )
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Saved Jobs"
        description="Jobs you saved for later."
        action={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                void loadSavedJobs();
              }}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>

            <Button
              variant="outline"
              asChild
            >
              <Link href="/dashboard/jobs">
                Browse Jobs
              </Link>
            </Button>
          </div>
        }
      />

      {error && (
        <Card className="mb-6 rounded-2xl border-destructive/30">
          <CardContent className="p-4">
            <p className="text-sm text-destructive">
              {error}
            </p>
          </CardContent>
        </Card>
      )}

      {savedJobs.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No saved jobs"
          description="Save jobs from the Jobs page and they will appear here."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {savedJobs.map((savedJob) => {
            const removing =
              removingJobId ===
              savedJob.jobId;

            return (
              <Card
                key={savedJob.id}
                className="h-full rounded-2xl border-border/60 transition-all hover:shadow-soft"
              >
                <CardContent className="flex h-full flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Briefcase className="h-5 w-5" />
                    </div>

                    <Badge variant="secondary">
                      Saved
                    </Badge>
                  </div>

                  <h2 className="mt-4 font-display text-base font-semibold">
                    {savedJob.title}
                  </h2>

                  <p className="mt-1 text-sm font-medium text-muted-foreground">
                    {savedJob.company}
                  </p>

                  <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />

                    <span className="truncate">
                      {savedJob.location}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {savedJob.employmentType && (
                      <Badge variant="outline">
                        {savedJob.employmentType}
                      </Badge>
                    )}

                    {savedJob.experienceLevel && (
                      <Badge variant="outline">
                        {savedJob.experienceLevel}
                      </Badge>
                    )}
                  </div>

                  {savedJob.salaryRange && (
                    <p className="mt-3 text-sm font-medium">
                      {savedJob.salaryRange}
                    </p>
                  )}

                  <p className="mt-3 line-clamp-4 text-sm text-muted-foreground">
                    {savedJob.description ||
                      'No job description available.'}
                  </p>

                  <div className="mt-auto pt-5">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        asChild
                      >
                        <Link
                          href={`/dashboard/jobs/${savedJob.jobId}`}
                        >
                          View Details
                        </Link>
                      </Button>

                      {savedJob.applyUrl && (
                        <Button
                          size="sm"
                          asChild
                        >
                          <a
                            href={
                              savedJob.applyUrl
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Apply
                          </a>
                        </Button>
                      )}

                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        onClick={() => {
                          void removeSavedJob(
                            savedJob.jobId
                          );
                        }}
                        disabled={removing}
                        aria-label={`Remove ${savedJob.title} from saved jobs`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <div className="mt-6">
        <Button
          variant="ghost"
          asChild
          className="-ml-3"
        >
          <Link href="/dashboard/jobs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Jobs
          </Link>
        </Button>
      </div>
    </>
  );
}