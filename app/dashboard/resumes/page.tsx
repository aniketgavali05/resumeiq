'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/constants/AuthContext';
import {
  ArrowDownAZ,
  ArrowUpAZ,
  ArrowRight,
  FileText,
  MoreVertical,
  RefreshCw,
  Search,
  Trash2,
} from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header';
import { FadeIn } from '@/components/motion';
import { EmptyState } from '@/components/empty-state';
import { CardSkeleton } from '@/components/ui/skeleton';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

import { useResumes } from '@/hooks';
import resumeService from '@/services/resumeService';

type ResumeSort =
  | 'newest'
  | 'oldest'
  | 'scoreHigh'
  | 'scoreLow';

export default function ResumesPage() {
  const [search, setSearch] = useState('');
const [debouncedSearch, setDebouncedSearch] = useState('');
const [sort, setSort] = useState<ResumeSort>('newest');
const [page, setPage] = useState(0);
const [deletingId, setDeletingId] = useState<number | null>(null);
const { user } = useAuth();

useEffect(() => {
  const timer = window.setTimeout(() => {
    setDebouncedSearch(search);
  }, 400);

  return () => {
    window.clearTimeout(timer);
  };
}, [search]);

useEffect(() => {
  setPage(0);
}, [debouncedSearch, sort]);


  const {
  resumes,
  loading,
  error,
  refresh,
  data,
} = useResumes({
  page,
  size: 9,
  search: debouncedSearch,
  sort,
});

  /*
   * Reset pagination when search or sorting changes.
   */
  useEffect(() => {
    setPage(0);
  }, [search, sort]);

  /*
   * Delete a resume and refresh the current list.
   */
  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this resume?'
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      await resumeService.deleteResume(id);

      await refresh();
    } catch (err) {
      console.error('Failed to delete resume:', err);

      window.alert(
        err instanceof Error
          ? err.message
          : 'Failed to delete the resume. Please try again.'
      );
    } finally {
      setDeletingId(null);
    }
  };

  /*
   * Loading state.
   */
  if (loading) {
    return (
      <>
        <PageHeader
          title="Resumes"
          description="Manage and analyze your resumes."
          action={
            <Link href="/dashboard/resumes/upload">
              <Button>
                Upload Resume
              </Button>
            </Link>
          }
        />

        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
  value={search}
  onChange={(event) => {
    setSearch(event.target.value);
  }}
  placeholder="Search resumes..."
  className="pl-9"
/>
          </div>

          <Button
            variant="outline"
            disabled
          >
            Sorting...
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      </>
    );
  }

  /*
   * Error state.
   */
  if (error) {
    return (
      <>
        <PageHeader
          title="Resumes"
          description="Manage and analyze your resumes."
          action={
            <Link href="/dashboard/resumes/upload">
              <Button>
                Upload Resume
              </Button>
            </Link>
          }
        />

        <Card className="rounded-2xl">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <FileText className="h-6 w-6 text-destructive" />
            </div>

            <h3 className="mt-4 text-lg font-semibold">
              Unable to load resumes
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
        title="Resumes"
        description="Manage and analyze your resumes."
        action={
          <Link href="/dashboard/resumes/upload">
            <Button>
              Upload Resume
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        }
      />

      {/* Search + Sorting */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
            }}
            placeholder="Search resumes..."
            className="pl-9"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="outline">
              {sort === 'newest' && (
                <>
                  <ArrowDownAZ className="mr-2 h-4 w-4" />
                  Newest
                </>
              )}

              {sort === 'oldest' && (
                <>
                  <ArrowUpAZ className="mr-2 h-4 w-4" />
                  Oldest
                </>
              )}

              {sort === 'scoreHigh' && 'Highest Score'}

              {sort === 'scoreLow' && 'Lowest Score'}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => setSort('newest')}
            >
              Newest
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => setSort('oldest')}
            >
              Oldest
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => setSort('scoreHigh')}
            >
              Highest Score
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => setSort('scoreLow')}
            >
              Lowest Score
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Empty State */}
      {resumes.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={
            search
              ? 'No resumes found'
              : 'No resumes uploaded yet'
          }
          description={
            search
              ? 'Try a different search term.'
              : 'Upload your first resume to start ATS analysis.'
          }
        />
      ) : (
        <>
          {/* Resume Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {resumes.map((resume, index) => {
              const score =
                resume.score ??
                resume.resumeScore ??
                0;

              const scoreLabel =
                score >= 80
                  ? 'Excellent'
                  : score >= 60
                    ? 'Good'
                    : 'Needs Improvement';

              const scoreVariant =
                score >= 80
                  ? 'success'
                  : score >= 60
                    ? 'secondary'
                    : 'warning';

              return (
                <FadeIn
                  key={resume.id}
                  delay={Math.min(index * 0.05, 0.3)}
                >
                  <Card className="h-full rounded-2xl border-border/60 transition-all hover:shadow-soft">
                    <CardContent className="p-5">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <FileText className="h-5 w-5" />
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={
                                deletingId === resume.id
                              }
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => {
                                void handleDelete(resume.id);
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />

                              {deletingId === resume.id
                                ? 'Deleting...'
                                : 'Delete'}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Resume name */}
                      <h3 className="mt-4 font-display text-base font-semibold">
                        {resume.originalFileName}
                      </h3>

                      <p className="mt-1 truncate text-sm text-muted-foreground">
                        {resume.fileType || 'Resume file'}
                      </p>

                      {/* Score */}
                      <div className="mt-3 flex items-center gap-2">
                        <Badge
                          variant={
                            scoreVariant as
                              | 'success'
                              | 'secondary'
                              | 'warning'
                          }
                        >
                          {scoreLabel}
                        </Badge>

                        <span className="text-sm font-medium">
                          ATS: {score}/100
                        </span>
                      </div>

                      {/* Skills */}
                      {resume.matchedSkills?.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {resume.matchedSkills
                            .slice(0, 3)
                            .map((skill) => (
                              <Badge
                                key={skill}
                                variant="outline"
                              >
                                {skill}
                              </Badge>
                            ))}

                          {resume.matchedSkills.length > 3 && (
                            <Badge variant="outline">
                              +
                              {resume.matchedSkills.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Analysis button */}
                      {score > 0 && (
                        <Link
                          href={`/dashboard/resumes/${resume.id}/analysis`}
                          className="mt-4 block"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
                            View Analysis
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      )}

                      {/* Upload date */}
                      <p className="mt-3 text-xs text-muted-foreground">
                        Uploaded{' '}
                        {resume.uploadedAt
                          ? new Date(
                              resume.uploadedAt
                            ).toLocaleDateString()
                          : 'Unknown'}
                      </p>
                    </CardContent>
                  </Card>
                </FadeIn>
              );
            })}
          </div>

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row">
              <p className="text-sm text-muted-foreground">
                Showing page{' '}
                {data.currentPage + 1} of{' '}
                {data.totalPages} (
                {data.totalElements}{' '}
                {data.totalElements === 1
                  ? 'resume'
                  : 'resumes'}
                )
              </p>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  disabled={page === 0}
                  onClick={() => {
                    setPage((current) =>
                      Math.max(0, current - 1)
                    );
                  }}
                >
                  Previous
                </Button>

                <Button
                  variant="outline"
                  disabled={
                    page >= data.totalPages - 1
                  }
                  onClick={() => {
                    setPage((current) =>
                      Math.min(
                        data.totalPages - 1,
                        current + 1
                      )
                    );
                  }}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}