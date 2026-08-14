'use client';

import Link from 'next/link';

import {
  Briefcase,
  FileCheck,
  FileText,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';

import {
  Card,
  CardContent,
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header';

import {
  FadeIn,
  AnimatedNumber,
} from '@/components/motion';

import { useDashboardStats } from '@/hooks';

import {
  StatCardSkeleton,
} from '@/components/ui/skeleton';

export default function DashboardPage() {
  const {
    data: stats,
    loading,
  } = useDashboardStats();

  if (loading || !stats) {
    return (
      <>
        <PageHeader
          title="Dashboard"
          description="Your job search at a glance."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map(
            (_, index) => (
              <StatCardSkeleton
                key={index}
              />
            )
          )}
        </div>
      </>
    );
  }

  const statCards = [
    {
      icon: Briefcase,
      label: 'Applications',
      value: stats.applications,
      color: 'text-chart-1',
    },
    {
      icon: FileCheck,
      label: 'Interviews',
      value: stats.interviews,
      color: 'text-chart-2',
    },
    {
      icon: FileText,
      label: 'Offers',
      value: stats.offers,
      color: 'text-chart-3',
    },
    {
      icon: TrendingUp,
      label: 'Match Score',
      value: stats.matchPercentage,
      suffix: '%',
      color: 'text-chart-4',
    },
    {
      icon: FileText,
      label: 'Resume Score',
      value: stats.resumeScore,
      suffix: '%',
      color: 'text-chart-5',
    },
    {
      icon: Briefcase,
      label: 'Saved Jobs',
      value: stats.savedJobs,
      color: 'text-primary',
    },
  ];

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Your job search at a glance."
        action={
          <Button asChild>
            <Link href="/dashboard/jobs">
              Browse Jobs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {statCards.map(
          (card, index) => (
            <FadeIn
              key={card.label}
              delay={Math.min(
                index * 0.05,
                0.3
              )}
            >
              <Card className="rounded-2xl border-border/60 transition-all hover:shadow-soft">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 ${card.color}`}
                    >
                      <card.icon className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="mt-4">
                    <AnimatedNumber
                      value={card.value}
                      suffix={card.suffix}
                      className="font-display text-2xl font-bold"
                    />

                    <p className="mt-1 text-sm text-muted-foreground">
                      {card.label}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          )
        )}
      </div>

      <div className="mt-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="mb-5 text-xl font-semibold">
              Recent Resume Uploads
            </h2>

            {stats.recentResumes.length === 0 ? (
              <p className="text-muted-foreground">
                No resumes uploaded yet.
              </p>
            ) : (
              <div className="space-y-4">
                {stats.recentResumes.map(
                  (resume) => (
                    <div
                      key={resume.id}
                      className="flex items-center justify-between rounded-xl border p-4"
                    >
                      <div>
                        <p className="font-medium">
                          {resume.fileName}
                        </p>

                        <p className="text-sm text-muted-foreground">
                          Uploaded:{' '}
                          {new Date(
                            resume.uploadedAt
                          ).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">
                          {resume.score}%
                        </p>

                        <p className="text-xs text-muted-foreground">
                          ATS Score
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}