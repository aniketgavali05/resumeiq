'use client';

import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import Link from 'next/link';

import {
  Bookmark,
  Briefcase,
  ExternalLink,
  MapPin,
  Search,
  RefreshCw,
} from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/page-header';
import { FadeIn } from '@/components/motion';
import { EmptyState } from '@/components/empty-state';
import { CardSkeleton } from '@/components/ui/skeleton';

import { useJobs } from '@/hooks';

import savedJobService, {
  type SavedJobResponse,
} from '@/services/savedJobService';

export default function JobsPage() {
  const {
    jobs,
    loading,
    error,
    refresh,
  } = useJobs();

  const [query, setQuery] = useState('');

  const [savedJobs, setSavedJobs] =
    useState<SavedJobResponse[]>([]);

  const [savedLoading, setSavedLoading] =
    useState(true);

  const [savingJobId, setSavingJobId] =
    useState<number | null>(null);

  const [saveMessage, setSaveMessage] =
    useState('');

  // =====================================================
  // Load user's saved jobs
  // =====================================================

  const loadSavedJobs = async () => {
    try {
      setSavedLoading(true);

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

      setSavedJobs([]);
    } finally {
      setSavedLoading(false);
    }
  };

  useEffect(() => {
    void loadSavedJobs();
  }, []);

  // =====================================================
  // Saved job IDs
  // =====================================================

  const savedJobIds = useMemo(() => {
  return new Set(
    savedJobs
      .map((savedJob) => savedJob.jobId)
      .filter(
        (id): id is number =>
          typeof id === 'number'
      )
  );
}, [savedJobs]);

  // =====================================================
  // Search
  // =====================================================

  const filteredJobs = useMemo(() => {
    const normalizedQuery =
      query.trim().toLowerCase();

    if (!normalizedQuery) {
      return jobs;
    }

    return jobs.filter((job) => {
      return (
        job.title
          .toLowerCase()
          .includes(normalizedQuery) ||
        job.company
          .toLowerCase()
          .includes(normalizedQuery) ||
        job.location
          .toLowerCase()
          .includes(normalizedQuery) ||
        (job.description ?? '')
          .toLowerCase()
          .includes(normalizedQuery) ||
        (job.employmentType ?? '')
          .toLowerCase()
          .includes(normalizedQuery) ||
        (job.experienceLevel ?? '')
          .toLowerCase()
          .includes(normalizedQuery)
      );
    });
  }, [jobs, query]);

  // =====================================================
  // Save / Unsave
  // =====================================================

  const handleSaveJob = async (
    jobId: number
  ) => {
    try {
      setSavingJobId(jobId);
      setSaveMessage('');

      if (savedJobIds.has(jobId)) {
        await savedJobService.unsaveJob(
          jobId
        );

        setSavedJobs((current) =>
  current.filter(
    (savedJob) =>
      savedJob.jobId !== jobId
  )
);

        setSaveMessage(
          'Job removed from saved jobs.'
        );
      } else {
        const saved =
          await savedJobService.saveJob(
            jobId
          );

        setSavedJobs((current) => [
          saved,
          ...current,
        ]);

        setSaveMessage(
          'Job saved successfully.'
        );
      }
    } catch (err) {
      console.error(
        'Failed to save job:',
        err
      );

      setSaveMessage(
        err instanceof Error
          ? err.message
          : 'Failed to update saved job.'
      );
    } finally {
      setSavingJobId(null);
    }
  };

  // =====================================================
  // Loading
  // =====================================================

  if (loading) {
    return (
      <>
        <PageHeader
          title="Browse Jobs"
          description="Find your next opportunity."
          action={
            <Button
              variant="outline"
              disabled
            >
              Loading...
            </Button>
          }
        />

        <div className="mb-6">
          <Input
            placeholder="Search jobs..."
            disabled
            readOnly
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map(
            (_, index) => (
              <CardSkeleton
                key={index}
              />
            )
          )}
        </div>
      </>
    );
  }

  // =====================================================
  // Error
  // =====================================================

  if (error) {
    return (
      <>
        <PageHeader
          title="Browse Jobs"
          description="Find your next opportunity."
        />

        <Card className="rounded-2xl">
          <CardContent className="flex flex-col items-center justify-center p-10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
              <Briefcase className="h-6 w-6" />
            </div>

            <h3 className="mt-4 text-lg font-semibold">
              Unable to load jobs
            </h3>

            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              {error}
            </p>

            <Button
              className="mt-5"
              variant="outline"
              onClick={() => {
                void refresh();
              }}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Browse Jobs"
        description="Find your next opportunity."
        action={
          <div className="flex gap-2">
            <Button
              asChild
              variant="outline"
            >
              <Link href="/dashboard/jobs/saved">
                <Bookmark className="mr-2 h-4 w-4" />
                Saved Jobs
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
            >
              <Link href="/dashboard/jobs/matches">
                View Matches
              </Link>
            </Button>
          </div>
        }
      />

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
            }}
            placeholder="Search by title, company, location, or experience..."
            className="pl-9"
          />
        </div>
      </div>

      {/* Save message */}
      {saveMessage && (
        <div className="mb-5 rounded-lg border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
          {saveMessage}
        </div>
      )}

      {/* Empty */}
      {filteredJobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title={
            query.trim()
              ? 'No jobs found'
              : 'No jobs available'
          }
          description={
            query.trim()
              ? 'Try a different search term.'
              : 'There are currently no active jobs available.'
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map(
            (job, index) => {
              const isSaved =
                savedJobIds.has(job.id);

              const isSaving =
                savingJobId === job.id;

              return (
                <FadeIn
                  key={job.id}
                  delay={Math.min(
                    index * 0.05,
                    0.3
                  )}
                >
                  <Card className="h-full rounded-2xl border-border/60 transition-all hover:shadow-soft">
                    <CardContent className="flex h-full flex-col p-5">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Briefcase className="h-5 w-5" />
                        </div>

                        <div className="flex items-center gap-2">
                          {job.active && (
                            <Badge variant="success">
                              Active
                            </Badge>
                          )}

                          <Button
                            type="button"
                            size="icon"
                            variant={
                              isSaved
                                ? 'default'
                                : 'outline'
                            }
                            onClick={() => {
                              void handleSaveJob(
                                job.id
                              );
                            }}
                            disabled={
                              isSaving ||
                              savedLoading
                            }
                            aria-label={
                              isSaved
                                ? `Remove ${job.title} from saved jobs`
                                : `Save ${job.title}`
                            }
                            title={
                              isSaved
                                ? 'Remove from saved jobs'
                                : 'Save job'
                            }
                          >
                            <Bookmark
                              className={`h-4 w-4 ${
                                isSaved
                                  ? 'fill-current'
                                  : ''
                              }`}
                            />
                          </Button>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="mt-4 font-display text-base font-semibold">
                        {job.title}
                      </h3>

                      {/* Company */}
                      <p className="mt-1 text-sm font-medium text-muted-foreground">
                        {job.company}
                      </p>

                      {/* Location */}
                      <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />

                        <span className="truncate">
                          {job.location}
                        </span>
                      </div>

                      {/* Metadata */}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {job.employmentType && (
                          <Badge variant="outline">
                            {job.employmentType}
                          </Badge>
                        )}

                        {job.experienceLevel && (
                          <Badge variant="outline">
                            {job.experienceLevel}
                          </Badge>
                        )}
                      </div>

                      {/* Salary */}
                      {job.salaryRange && (
                        <p className="mt-3 text-sm font-medium">
                          {job.salaryRange}
                        </p>
                      )}

                      {/* Description */}
                      <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
                        {job.description ||
                          'No job description available.'}
                      </p>

                      {/* Actions */}
                      <div className="mt-auto pt-5">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            asChild
                          >
                            <Link
                              href={`/dashboard/jobs/${job.id}`}
                            >
                              View Details
                            </Link>
                          </Button>

                          {job.applyUrl && (
                            <Button
                              size="sm"
                              variant="default"
                              asChild
                            >
                              <a
                                href={
                                  job.applyUrl
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Apply for ${job.title} at ${job.company}`}
                              >
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Apply
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </FadeIn>
              );
            }
          )}
        </div>
      )}

      {/* Count */}
      {filteredJobs.length > 0 && (
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Showing {filteredJobs.length}{' '}
          {filteredJobs.length === 1
            ? 'job'
            : 'jobs'}
          {query.trim()
            ? ' matching your search'
            : ''}
        </p>
      )}
    </>
  );
}