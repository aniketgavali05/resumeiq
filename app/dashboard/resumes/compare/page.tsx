'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, RefreshCw, Scale, Trash2 } from 'lucide-react';
import Link from 'next/link';

import resumeService, {
  ResumeResponse,
} from '@/services/resumeService';

import CompareCard from '@/components/resume/CompareCard';
import CompareTable from '@/components/resume/CompareTable';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ResumeComparePage() {
  const [resumes, setResumes] = useState<ResumeResponse[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const selectedResumes = useMemo(
    () =>
      selectedIds
        .map((id) => resumes.find((resume) => resume.id === id))
        .filter(
          (resume): resume is ResumeResponse =>
            resume !== undefined
        ),
    [selectedIds, resumes]
  );

  const loadResumes = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await resumeService.getResumes(
        0,
        50,
        '',
        'newest'
      );

      setResumes(response.resumes ?? []);
    } catch (err) {
      console.error('Failed to load resumes:', err);
      setError(
        'Unable to load your resumes. Please make sure you are logged in and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResumes();
  }, []);

  const toggleSelection = (id: number) => {
    setSelectedIds((current) => {
      if (current.includes(id)) {
        return current.filter((item) => item !== id);
      }

      return [...current, id];
    });
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  const selectAll = () => {
    setSelectedIds(resumes.map((resume) => resume.id));
  };

  const deleteResume = async (id: number) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this resume? This action cannot be undone.'
    );

    if (!confirmed) {
      return;
    }

    try {
      await resumeService.deleteResume(id);

      setResumes((current) =>
        current.filter((resume) => resume.id !== id)
      );

      setSelectedIds((current) =>
        current.filter((resumeId) => resumeId !== id)
      );
    } catch (err) {
      console.error('Failed to delete resume:', err);
      alert('Failed to delete the resume. Please try again.');
    }
  };

  return (
    <div className="space-y-8 p-6 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="mb-3">
            <Button variant="ghost" asChild className="-ml-3">
              <Link href="/dashboard/resumes">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Resumes
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Scale className="h-6 w-6" />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Resume Comparison
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                Compare your resumes side by side and identify
                the strongest version.
              </p>
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={loadResumes}
          disabled={loading}
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${
              loading ? 'animate-spin' : ''
            }`}
          />
          Refresh
        </Button>
      </div>

      {error && (
        <Card className="border-destructive/30">
          <CardContent className="p-6">
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Your Resumes</CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                Select two or more resumes to compare them.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={selectAll}
                disabled={resumes.length === 0}
              >
                Select All
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={clearSelection}
                disabled={selectedIds.length === 0}
              >
                Clear Selection
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-72 animate-pulse rounded-2xl border bg-muted/30"
                />
              ))}
            </div>
          ) : resumes.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-10 text-center">
              <Scale className="mx-auto h-10 w-10 text-muted-foreground" />

              <h2 className="mt-4 text-lg font-semibold">
                No resumes found
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Upload at least two resumes before comparing
                them.
              </p>

              <Button asChild className="mt-5">
                <Link href="/dashboard/resumes/upload">
                  Upload Resume
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {resumes.map((resume) => (
                <div key={resume.id} className="relative">
                  <CompareCard
                    resume={resume}
                    selected={selectedIds.includes(resume.id)}
                    onSelect={() =>
                      toggleSelection(resume.id)
                    }
                  />

                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute right-3 top-3 h-8 w-8"
                    aria-label={`Delete ${resume.originalFileName}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      void deleteResume(resume.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Comparison
            {selectedResumes.length > 0
              ? ` (${selectedResumes.length} selected)`
              : ''}
          </CardTitle>
        </CardHeader>

        <CardContent>
          {selectedResumes.length < 2 ? (
            <div className="rounded-2xl border border-dashed p-10 text-center">
              <Scale className="mx-auto h-10 w-10 text-muted-foreground" />

              <h2 className="mt-4 text-lg font-semibold">
                Select at least two resumes
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Choose the resumes you want to compare above.
              </p>
            </div>
          ) : (
            <CompareTable resumes={selectedResumes} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}