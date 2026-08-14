'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import {
  Sparkles,
  MapPin,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';

import {
  Card,
  CardContent,
} from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';

import { Button } from '@/components/ui/button';

import { PageHeader } from '@/components/page-header';

import { FadeIn } from '@/components/motion';

import { EmptyState } from '@/components/empty-state';

import { CardSkeleton } from '@/components/ui/skeleton';

import jobMatchingService, {
  JobMatchResponse,
} from '@/services/jobMatchingService';

function getMatchVariant(
  score: number
) {
  if (score >= 90) {
    return 'success' as const;
  }

  if (score >= 75) {
    return 'default' as const;
  }

  if (score >= 60) {
    return 'warning' as const;
  }

  return 'secondary' as const;
}

export default function MatchesPage() {
  const [matches, setMatches] =
    useState<JobMatchResponse[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const loadMatches = async () => {
    try {
      setLoading(true);
      setError('');

      const result =
        await jobMatchingService.getMatches();

      setMatches(
        Array.isArray(result)
          ? result
          : []
      );
    } catch (err) {
      console.error(
        'Failed to load job matches:',
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load job matches.'
      );

      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadMatches();
  }, []);

  if (loading) {
    return (
      <>
        <PageHeader
          title="Job Matches"
          description="Roles ranked using your resume and profile."
        />

        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map(
            (_, index) => (
              <CardSkeleton key={index} />
            )
          )}
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageHeader
          title="Job Matches"
          description="Roles ranked using your resume and profile."
        />

        <div className="mb-4 flex justify-end">
          <Button
            variant="outline"
            onClick={loadMatches}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>

        <EmptyState
          icon={Sparkles}
          title="Unable to load job matches"
          description={error}
        />
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <PageHeader
          title="Job Matches"
          description="Roles ranked using your latest resume."
        />

        <Button
          variant="outline"
          onClick={loadMatches}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {matches.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="No job matches yet"
          description="Upload a resume first, then we'll match it against the active jobs."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {matches.map((match, index) => (
            <FadeIn
              key={match.jobId}
              delay={Math.min(
                index * 0.05,
                0.3
              )}
            >
              <Card className="h-full rounded-2xl border-border/60 transition-all hover:shadow-soft">
                <CardContent className="flex h-full flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Sparkles className="h-5 w-5" />
                    </div>

                    <Badge
                      variant={getMatchVariant(
                        match.matchScore
                      )}
                    >
                      {match.matchScore}% Match
                    </Badge>
                  </div>

                  <h3 className="mt-4 font-display text-base font-semibold">
                    {match.jobTitle}
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    {match.company}
                  </p>

                  <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {match.location}
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        Resume ATS Score
                      </p>

                      <p className="text-sm font-semibold">
                        {match.atsScore}%
                      </p>
                    </div>

                    {match.matchedSkills.length > 0 && (
                      <div>
                        <p className="mb-2 text-xs font-medium text-muted-foreground">
                          Matched Skills
                        </p>

                        <div className="flex flex-wrap gap-1.5">
                          {match.matchedSkills
                            .slice(0, 8)
                            .map((skill) => (
                              <Badge
                                key={skill}
                                variant="secondary"
                              >
                                {skill}
                              </Badge>
                            ))}
                        </div>
                      </div>
                    )}

                    {match.missingSkills.length > 0 && (
                      <div>
                        <p className="mb-2 text-xs font-medium text-muted-foreground">
                          Missing Skills
                        </p>

                        <div className="flex flex-wrap gap-1.5">
                          {match.missingSkills
                            .slice(0, 8)
                            .map((skill) => (
                              <Badge
                                key={skill}
                                variant="outline"
                              >
                                {skill}
                              </Badge>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <p className="mt-4 line-clamp-3 text-sm text-muted-foreground">
                    {match.recommendation}
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
                          href={`/dashboard/jobs/${match.jobId}`}
                        >
                          View Details
                        </Link>
                      </Button>

                      <Button
                        size="sm"
                        variant="default"
                        asChild
                      >
                        <Link
                          href={`/dashboard/jobs/${match.jobId}`}
                        >
                          View
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      )}

      {matches.length > 0 && (
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Showing {matches.length}{' '}
          {matches.length === 1
            ? 'job'
            : 'jobs'}{' '}
          ranked using your resume.
        </p>
      )}
    </>
  );
}