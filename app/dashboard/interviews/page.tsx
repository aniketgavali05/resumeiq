'use client';

import { useEffect, useState } from 'react';

import {
  Calendar,
  ChevronDown,
  Clock,
  ExternalLink,
  HelpCircle,
  MapPin,
  Trash2,
} from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header';
import { FadeIn } from '@/components/motion';
import { CardSkeleton } from '@/components/ui/skeleton';

import {
  useInterviewQuestions,
} from '@/hooks';

import interviewService, {
  type InterviewResponse,
} from '@/services/interviewService';

import { cn } from '@/utils';

import type { InterviewQuestion } from '@/types';

const difficultyConfig: Record<
  InterviewQuestion['difficulty'],
  {
    variant:
      | 'success'
      | 'warning'
      | 'destructive';
  }
> = {
  easy: {
    variant: 'success',
  },
  medium: {
    variant: 'warning',
  },
  hard: {
    variant: 'destructive',
  },
};

function formatDateTime(
  value?: string | null
) {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}

function getStatusVariant(
  status: string
): 'default' | 'success' | 'warning' | 'destructive' | 'secondary' {
  switch (status.toUpperCase()) {
    case 'COMPLETED':
      return 'success';

    case 'CANCELLED':
      return 'destructive';

    case 'RESCHEDULED':
      return 'warning';

    default:
      return 'default';
  }
}

export default function InterviewsPage() {
  const {
    data: questions,
    loading: questionsLoading,
  } = useInterviewQuestions();

  const [expanded, setExpanded] =
    useState<string | null>(null);

  const [interviews, setInterviews] =
    useState<InterviewResponse[]>([]);

  const [interviewsLoading, setInterviewsLoading] =
    useState(true);

  const [interviewsError, setInterviewsError] =
    useState('');

  const [
    deletingInterviewId,
    setDeletingInterviewId,
  ] = useState<number | null>(null);

  const loadInterviews = async () => {
    try {
      setInterviewsLoading(true);
      setInterviewsError('');

      const result =
        await interviewService.getMyInterviews();

      setInterviews(
        Array.isArray(result)
          ? result
          : []
      );
    } catch (error) {
      console.error(
        'Failed to load interviews:',
        error
      );

      setInterviewsError(
        error instanceof Error
          ? error.message
          : 'Failed to load interviews.'
      );

      setInterviews([]);
    } finally {
      setInterviewsLoading(false);
    }
  };

  useEffect(() => {
    void loadInterviews();
  }, []);

  const handleDeleteInterview = async (
    interviewId: number
  ) => {
    const confirmed =
      window.confirm(
        'Delete this interview?'
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingInterviewId(
        interviewId
      );

      await interviewService.deleteInterview(
        interviewId
      );

      setInterviews((current) =>
        current.filter(
          (interview) =>
            interview.id !== interviewId
        )
      );
    } catch (error) {
      console.error(
        'Failed to delete interview:',
        error
      );

      setInterviewsError(
        error instanceof Error
          ? error.message
          : 'Failed to delete interview.'
      );
    } finally {
      setDeletingInterviewId(null);
    }
  };

  const pageLoading =
    questionsLoading &&
    interviewsLoading;

  if (pageLoading) {
    return (
      <>
        <PageHeader
          title="Interviews"
          description="Manage your interviews and practice for upcoming opportunities."
        />

        <div className="space-y-4">
          {Array.from({
            length: 4,
          }).map((_, index) => (
            <CardSkeleton
              key={index}
            />
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Interviews"
        description="Manage your interviews and practice for upcoming opportunities."
      />

      {/* ================================================= */}
      {/* My Interviews */}
      {/* ================================================= */}

      <div className="mt-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              My Interviews
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Your scheduled interviews from your applications.
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() => {
              void loadInterviews();
            }}
            disabled={
              interviewsLoading
            }
          >
            {interviewsLoading
              ? 'Refreshing...'
              : 'Refresh'}
          </Button>
        </div>

        {interviewsError && (
          <Card className="mb-4 rounded-2xl border-destructive/30">
            <CardContent className="p-4">
              <p className="text-sm text-destructive">
                {interviewsError}
              </p>
            </CardContent>
          </Card>
        )}

        {interviewsLoading ? (
          <div className="space-y-4">
            <CardSkeleton />
          </div>
        ) : interviews.length === 0 ? (
          <Card className="rounded-2xl border-border/60">
            <CardContent className="p-8 text-center">
              <Calendar className="mx-auto h-10 w-10 text-muted-foreground" />

              <h3 className="mt-4 text-lg font-semibold">
                No interviews scheduled
              </h3>

              <p className="mt-2 text-sm text-muted-foreground">
                When an interview is scheduled for one of your applications, it will appear here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {interviews.map(
              (interview, index) => {
                const status =
                  interview.status ||
                  'SCHEDULED';

                const deleting =
                  deletingInterviewId ===
                  interview.id;

                return (
                  <FadeIn
                    key={interview.id}
                    delay={Math.min(
                      index * 0.05,
                      0.3
                    )}
                  >
                    <Card className="rounded-2xl border-border/60">
                      <CardContent className="p-5">
                        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-lg font-semibold">
                                {
                                  interview.jobTitle
                                }
                              </h3>

                              <Badge
                                variant={getStatusVariant(
                                  status
                                )}
                              >
                                {status}
                              </Badge>
                            </div>

                            <p className="mt-1 text-sm text-muted-foreground">
                              {
                                interview.company
                              }
                            </p>

                            <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1.5">
                                <Calendar className="h-4 w-4" />
                                {formatDateTime(
                                  interview.scheduledAt
                                )}
                              </span>

                              <span className="flex items-center gap-1.5">
                                <Clock className="h-4 w-4" />
                                {
                                  interview.interviewType
                                }
                              </span>

                              {interview.location && (
                                <span className="flex items-center gap-1.5">
                                  <MapPin className="h-4 w-4" />
                                  {
                                    interview.location
                                  }
                                </span>
                              )}
                            </div>

                            {interview.interviewerName && (
                              <p className="mt-3 text-sm">
                                <span className="font-medium">
                                  Interviewer:
                                </span>{' '}
                                {
                                  interview.interviewerName
                                }
                              </p>
                            )}

                            {interview.notes && (
                              <div className="mt-4 rounded-xl border border-border/60 bg-secondary/30 p-4">
                                <p className="text-xs font-medium text-muted-foreground">
                                  Notes
                                </p>

                                <p className="mt-1 text-sm">
                                  {
                                    interview.notes
                                  }
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="flex shrink-0 gap-2">
                            {interview.meetingLink && (
                              <Button
                                asChild
                                size="sm"
                              >
                                <a
                                  href={
                                    interview.meetingLink
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Join Interview
                                  <ExternalLink className="ml-2 h-4 w-4" />
                                </a>
                              </Button>
                            )}

                            <Button
                              type="button"
                              size="icon"
                              variant="destructive"
                              onClick={() => {
                                void handleDeleteInterview(
                                  interview.id
                                );
                              }}
                              disabled={
                                deleting
                              }
                              aria-label="Delete interview"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
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
      </div>

      {/* ================================================= */}
      {/* Interview Prep */}
      {/* ================================================= */}

      <div className="mt-10">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">
            Interview Prep
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Practice with curated interview questions.
          </p>
        </div>

        <div className="space-y-4">
          {(questions ?? []).map(
            (question, index) => {
              const isOpen =
                expanded ===
                question.id;

              const difficulty =
                difficultyConfig[
                  question.difficulty
                ];

              return (
                <FadeIn
                  key={question.id}
                  delay={Math.min(
                    index * 0.05,
                    0.3
                  )}
                >
                  <Card className="rounded-2xl border-border/60 transition-all hover:shadow-soft">
                    <CardContent className="p-5">
                      <button
                        type="button"
                        onClick={() =>
                          setExpanded(
                            isOpen
                              ? null
                              : question.id
                          )
                        }
                        className="flex w-full items-start justify-between gap-4 text-left"
                      >
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="secondary">
                              {
                                question.category
                              }
                            </Badge>

                            <Badge
                              variant={
                                difficulty.variant
                              }
                              className="capitalize"
                            >
                              {
                                question.difficulty
                              }
                            </Badge>
                          </div>

                          <p className="mt-2 font-medium">
                            {
                              question.question
                            }
                          </p>
                        </div>

                        <ChevronDown
                          className={cn(
                            'mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform',
                            isOpen &&
                              'rotate-180'
                          )}
                        />
                      </button>

                      {isOpen && (
                        <div className="mt-4 rounded-xl border border-border/60 bg-secondary/30 p-4">
                          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <HelpCircle className="h-4 w-4" />
                            Suggested Answer
                          </div>

                          <p className="mt-2 text-sm leading-relaxed">
                            {
                              question.suggestedAnswer
                            }
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </FadeIn>
              );
            }
          )}
        </div>
      </div>
    </>
  );
}