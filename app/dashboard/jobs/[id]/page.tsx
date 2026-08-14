'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import {
  ArrowLeft,
  Briefcase,
  ExternalLink,
  MapPin,
  RefreshCw,
  Bookmark,
} from 'lucide-react';

import jobService, {
  type JobResponse,
} from '@/services/jobService';

import applicationService from '@/services/applicationService';
import savedJobService from '@/services/savedJobService';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header';
import { CardSkeleton } from '@/components/ui/skeleton';

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [job, setJob] =
    useState<JobResponse | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [applying, setApplying] =
    useState(false);

  const [applied, setApplied] =
    useState(false);

  const [applicationMessage, setApplicationMessage] =
    useState('');

  const [saved, setSaved] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [saveMessage, setSaveMessage] =
    useState('');

  const handleApply = async () => {
    if (!job) {
      return;
    }

    try {
      setApplying(true);
      setApplicationMessage('');

      const application =
        await applicationService.createApplication({
          jobId: job.id,
        });

      console.log(
        'Application created:',
        application,
      );

      setApplied(true);

      setApplicationMessage(
        'Application saved successfully!',
      );

      if (job.applyUrl) {
        window.open(
          job.applyUrl,
          '_blank',
          'noopener,noreferrer',
        );
      }
    } catch (err) {
      console.error(
        'Failed to create application:',
        err,
      );

      setApplicationMessage(
        err instanceof Error
          ? err.message
          : 'Failed to save application.',
      );
    } finally {
      setApplying(false);
    }
  };

  const handleSaveJob = async () => {
    if (!job) {
      return;
    }

    try {
      setSaving(true);
      setSaveMessage('');

      if (saved) {
        await savedJobService.unsaveJob(job.id);

        setSaved(false);
        setSaveMessage('Job removed from saved jobs.');
      } else {
        await savedJobService.saveJob(job.id);

        setSaved(true);
        setSaveMessage('Job saved successfully.');
      }
    } catch (err) {
      console.error(
        'Failed to update saved job:',
        err,
      );

      setSaveMessage(
        err instanceof Error
          ? err.message
          : 'Failed to update saved job.',
      );
    } finally {
      setSaving(false);
    }
  };

  const fetchJob = useCallback(async () => {
    const rawId = params?.id;

    const id =
      typeof rawId === 'string'
        ? Number(rawId)
        : Array.isArray(rawId)
          ? Number(rawId[0])
          : NaN;

    if (!Number.isInteger(id) || id <= 0) {
      setError('Invalid job ID.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');

      const result =
        await jobService.getJobById(id);

      setJob(result);

      try {
        const isSaved =
          await savedJobService.isJobSaved(id);

        setSaved(isSaved);
      } catch (saveError) {
        console.error(
          'Failed to load saved status:',
          saveError,
        );

        setSaved(false);
      }
    } catch (err) {
      console.error(
        'Failed to load job:',
        err,
      );

      setJob(null);

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load job details.',
      );
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    void fetchJob();
  }, [fetchJob]);

  if (loading) {
    return (
      <>
        <PageHeader
          title="Job Details"
          description="Loading job information..."
        />

        <div className="space-y-4">
          <CardSkeleton />
        </div>
      </>
    );
  }

  if (error || !job) {
    return (
      <>
        <PageHeader
          title="Job Details"
          description="Unable to load this job."
        />

        <Card className="rounded-2xl">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
              <Briefcase className="h-6 w-6" />
            </div>

            <h2 className="mt-4 text-lg font-semibold">
              Unable to load job
            </h2>

            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              {error ||
                'The requested job could not be found.'}
            </p>

            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  void fetchJob();
                }}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>

              <Link href="/dashboard/jobs">
                <Button>
                  Back to Jobs
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={job.title}
        description={job.company}
        action={
          <Button
            variant="outline"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="rounded-2xl border-border/60">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Briefcase className="h-7 w-7" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-display text-2xl font-bold">
                    {job.title}
                  </h1>

                  {job.active && (
                    <Badge variant="success">
                      Active
                    </Badge>
                  )}
                </div>

                <p className="mt-1 text-base text-muted-foreground">
                  {job.company}
                </p>

                <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </span>

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
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-semibold">
                Job Description
              </h2>

              <div className="mt-3 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
                {job.description ||
                  'No job description is available for this position.'}
              </div>
            </div>

            {job.salaryRange && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold">
                  Salary
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                  {job.salaryRange}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="rounded-2xl border-border/60">
            <CardContent className="p-5">
              <h2 className="font-semibold">
                Job Information
              </h2>

              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Company
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {job.company}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Location
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {job.location}
                  </p>
                </div>

                {job.employmentType && (
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Employment Type
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      {job.employmentType}
                    </p>
                  </div>
                )}

                {job.experienceLevel && (
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Experience Level
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      {job.experienceLevel}
                    </p>
                  </div>
                )}

                {job.salaryRange && (
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Salary Range
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      {job.salaryRange}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/60">
            <CardContent className="p-5">
              <h2 className="font-semibold">
                Application
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                {job.applyUrl
                  ? 'Use the application link provided by the employer.'
                  : 'No external application link is currently available.'}
              </p>

              <Button
                className="mt-4 w-full"
                onClick={() => {
                  void handleApply();
                }}
                disabled={
                  applying ||
                  applied ||
                  !job.active
                }
              >
                {applied
                  ? 'Applied'
                  : applying
                    ? 'Applying...'
                    : 'Apply Now'}

                {!applying &&
                  !applied &&
                  job.applyUrl && (
                    <ExternalLink className="ml-2 h-4 w-4" />
                  )}
              </Button>

              {applied && (
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  Your application has been saved. You can now
                  continue to the employers application page.
                </p>
              )}

              {applicationMessage &&
                !applied && (
                  <p className="mt-2 text-center text-xs text-destructive">
                    {applicationMessage}
                  </p>
                )}
            </CardContent>
          </Card>

          {/* Saved Job */}
          <Card className="rounded-2xl border-border/60">
            <CardContent className="p-5">
              <h2 className="font-semibold">
                Save Job
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Save this job so you can find it later.
              </p>

              <Button
                type="button"
                variant={saved ? 'default' : 'outline'}
                className="mt-4 w-full"
                onClick={() => {
                  void handleSaveJob();
                }}
                disabled={saving}
              >
                <Bookmark
                  className={`mr-2 h-4 w-4 ${
                    saved
                      ? 'fill-current'
                      : ''
                  }`}
                />

                {saving
                  ? 'Saving...'
                  : saved
                    ? 'Saved'
                    : 'Save Job'}
              </Button>

              {saveMessage && (
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  {saveMessage}
                </p>
              )}
            </CardContent>
          </Card>

          <Link href="/dashboard/jobs">
            <Button
              variant="ghost"
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Browse All Jobs
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}