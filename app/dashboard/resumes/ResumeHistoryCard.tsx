'use client';

import Link from 'next/link';
import {
  CalendarDays,
  FileText,
  Eye,
  Trash2,
} from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export interface ResumeHistoryItem {
  id: number | string;
  fileName: string;
  analyzedAt: string;
  atsScore: number;
  scoreLevel?: string;

  skillScore?: number;
  keywordScore?: number;
  experienceScore?: number;
  educationScore?: number;
  projectScore?: number;
  certificationScore?: number;
  sectionScore?: number;
  formattingScore?: number;
}

interface ResumeHistoryCardProps {
  resume: ResumeHistoryItem;
  onDelete?: (id: number | string) => void;
}

export default function ResumeHistoryCard({
  resume,
  onDelete,
}: ResumeHistoryCardProps) {
  const score = Math.round(Number(resume.atsScore) || 0);

  return (
    <Card className="rounded-2xl border-border/60 transition-shadow hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FileText className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <h2
                className="truncate text-lg font-semibold"
                title={resume.fileName}
              >
                {resume.fileName || 'Untitled Resume'}
              </h2>

              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4" />
                <span>{resume.analyzedAt || 'Unknown date'}</span>
              </div>

              {resume.scoreLevel && (
                <p className="mt-2 text-xs font-medium text-muted-foreground">
                  Score level: {resume.scoreLevel}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="min-w-[90px] text-center">
              <p className="text-3xl font-bold">
                {score}
              </p>

              <p className="text-xs text-muted-foreground">
                ATS Score
              </p>
            </div>

            <div className="flex gap-2">
              <Button asChild>
                <Link
                  href={`/dashboard/resumes/${resume.id}/analysis`}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Link>
              </Button>

              {onDelete && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => onDelete(resume.id)}
                  aria-label={`Delete ${resume.fileName}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}