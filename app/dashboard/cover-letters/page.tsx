'use client';

import { useEffect, useState } from 'react';

import {
  Mail,
  Plus,
  Calendar,
  X,
  Sparkles,
} from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header';
import { FadeIn } from '@/components/motion';
import { EmptyState } from '@/components/empty-state';
import { CardSkeleton } from '@/components/ui/skeleton';

import {
  useApplications,
  useCoverLetters,
} from '@/hooks';

import coverLetterService, {
  type CoverLetterResponse,
} from '@/services/coverLetterService';

export default function CoverLettersPage() {
  const {
    data: letters,
    loading: lettersLoading,
  } = useCoverLetters();

  const {
    data: applications,
    loading: applicationsLoading,
  } = useApplications();

  const [localLetters, setLocalLetters] =
    useState<CoverLetterResponse[]>([]);

  const [showGenerator, setShowGenerator] =
    useState(false);

  const [selectedApplicationId, setSelectedApplicationId] =
    useState('');

  const [tone, setTone] =
    useState('Professional');

  const [generating, setGenerating] =
    useState(false);

  const [error, setError] =
    useState('');

  const [success, setSuccess] =
    useState('');

  useEffect(() => {
    setLocalLetters(
      (letters ?? []).map((letter) => ({
        id: Number(letter.id),
        applicationId:
          Number(
            (
              letter as unknown as {
                applicationId: number;
              }
            ).applicationId
          ),
        jobTitle: letter.jobTitle,
        company: letter.company,
        tone: letter.tone,
        content: letter.content,
        createdAt: letter.createdAt,
      }))
    );
  }, [letters]);

  const resetGenerator = () => {
    setShowGenerator(false);
    setSelectedApplicationId('');
    setTone('Professional');
    setGenerating(false);
    setError('');
    setSuccess('');
  };

  const handleGenerate = async () => {
    const applicationId =
      Number(selectedApplicationId);

    if (!applicationId) {
      setError(
        'Please select an application.'
      );
      return;
    }

    try {
      setGenerating(true);
      setError('');
      setSuccess('');

      const created =
        await coverLetterService.createCoverLetter(
          {
            applicationId,
            tone,
          }
        );

      setLocalLetters((current) => {
        const withoutExisting =
          current.filter(
            (letter) =>
              letter.applicationId !==
              created.applicationId
          );

        return [
          created,
          ...withoutExisting,
        ];
      });

      setSuccess(
        'Cover letter generated successfully.'
      );

      setSelectedApplicationId('');

      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      console.error(
        'Failed to generate cover letter:',
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to generate cover letter.'
      );
    } finally {
      setGenerating(false);
    }
  };

  const loading =
    lettersLoading ||
    applicationsLoading;

  if (loading) {
    return (
      <>
        <PageHeader
          title="Cover Letters"
          description="Tailored cover letters for your applications."
        />

        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map(
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

  return (
    <>
      <PageHeader
        title="Cover Letters"
        description="Tailored cover letters for your applications."
        action={
          <Button
            onClick={() => {
              setShowGenerator(true);
              setError('');
              setSuccess('');
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Generate
          </Button>
        }
      />

      {success && (
        <Card className="mt-6 rounded-2xl border-green-500/30">
          <CardContent className="p-4">
            <p className="text-sm text-green-600">
              {success}
            </p>
          </CardContent>
        </Card>
      )}

      {showGenerator && (
        <FadeIn className="mt-6">
          <Card className="rounded-2xl border-border/60">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Sparkles className="h-5 w-5" />
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold">
                        Generate Cover Letter
                      </h2>

                      <p className="text-sm text-muted-foreground">
                        Choose one of your applications and a writing tone.
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={
                    resetGenerator
                  }
                  disabled={generating}
                  aria-label="Close generator"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {error && (
                <div className="mt-5 rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                  <p className="text-sm text-destructive">
                    {error}
                  </p>
                </div>
              )}

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Application
                  </label>

                  <select
                    value={
                      selectedApplicationId
                    }
                    onChange={(event) => {
                      setSelectedApplicationId(
                        event.target.value
                      );
                      setError('');
                    }}
                    disabled={generating}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">
                      Select an application
                    </option>

                    {(applications ?? []).map(
                      (application) => (
                        <option
                          key={
                            application.id
                          }
                          value={
                            application.id
                          }
                        >
                          {application.jobTitle} —{' '}
                          {application.company}
                        </option>
                      )
                    )}
                  </select>

                  {applications.length ===
                    0 && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Apply to a job before generating a cover letter.
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Tone
                  </label>

                  <select
                    value={tone}
                    onChange={(event) => {
                      setTone(
                        event.target.value
                      );
                    }}
                    disabled={generating}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="Professional">
                      Professional
                    </option>

                    <option value="Enthusiastic">
                      Enthusiastic
                    </option>

                    <option value="Confident">
                      Confident
                    </option>

                    <option value="Friendly">
                      Friendly
                    </option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={
                    resetGenerator
                  }
                  disabled={generating}
                >
                  Cancel
                </Button>

                <Button
                  type="button"
                  onClick={() => {
                    void handleGenerate();
                  }}
                  disabled={
                    generating ||
                    !selectedApplicationId
                  }
                >
                  <Sparkles className="mr-2 h-4 w-4" />

                  {generating
                    ? 'Generating...'
                    : 'Generate Cover Letter'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      )}

      {localLetters.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={Mail}
            title="No cover letters yet"
            description={
              applications.length === 0
                ? 'Apply to a job first, then generate a tailored cover letter.'
                : 'Generate a tailored cover letter for one of your applications.'
            }
          />
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {localLetters.map(
            (letter, index) => (
              <FadeIn
                key={letter.id}
                delay={Math.min(
                  index * 0.05,
                  0.3
                )}
              >
                <Card className="h-full rounded-2xl border-border/60 transition-all hover:shadow-soft">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Mail className="h-5 w-5" />
                      </div>

                      <Badge variant="secondary">
                        {letter.tone}
                      </Badge>
                    </div>

                    <h3 className="mt-4 font-display text-base font-semibold">
                      {letter.jobTitle}
                    </h3>

                    <p className="text-sm text-muted-foreground">
                      {letter.company}
                    </p>

                    <p className="mt-3 whitespace-pre-line line-clamp-8 text-sm leading-relaxed text-muted-foreground">
                      {letter.content}
                    </p>

                    <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />

                      {new Date(
                        letter.createdAt
                      ).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            )
          )}
        </div>
      )}
    </>
  );
}