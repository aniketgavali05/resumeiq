'use client';

import {
  Award,
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  GraduationCap,
  Target,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ResumeResponse } from '@/services/resumeService';

interface CompareCardProps {
  resume: ResumeResponse;
  selected?: boolean;
  onSelect?: () => void;
}

export default function CompareCard({
  resume,
  selected = false,
  onSelect,
}: CompareCardProps) {
  const score =
    typeof resume.score === 'number'
      ? resume.score
      : resume.resumeScore ?? 0;

  return (
    <Card
      className={`h-full cursor-pointer rounded-2xl border-border/60 transition-all ${
        selected
          ? 'border-primary ring-2 ring-primary/20'
          : 'hover:border-primary/40 hover:shadow-md'
      }`}
      onClick={onSelect}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <CardTitle className="truncate text-lg">
              {resume.originalFileName}
            </CardTitle>

            <p className="mt-1 text-xs text-muted-foreground">
              {resume.fileType} •{' '}
              {formatFileSize(resume.fileSize)}
            </p>
          </div>

          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-4 border-primary/20">
            <span className="text-lg font-bold text-primary">
              {Math.round(score)}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          <Metric
            icon={<Target className="h-4 w-4" />}
            label="Skills"
            value={resume.skillScore}
          />

          <Metric
            icon={<FileText className="h-4 w-4" />}
            label="Keywords"
            value={resume.keywordScore}
          />

          <Metric
            icon={<BriefcaseBusiness className="h-4 w-4" />}
            label="Experience"
            value={resume.experienceScore}
          />

          <Metric
            icon={<GraduationCap className="h-4 w-4" />}
            label="Education"
            value={resume.educationScore}
          />

          <Metric
            icon={<Award className="h-4 w-4" />}
            label="Projects"
            value={resume.projectScore}
          />

          <Metric
            icon={<CheckCircle2 className="h-4 w-4" />}
            label="Formatting"
            value={resume.formattingScore}
          />
        </div>

        {selected && (
          <div className="mt-4 rounded-lg bg-primary/5 px-3 py-2 text-center text-sm font-medium text-primary">
            Selected for comparison
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | undefined;
}) {
  const safeValue =
    typeof value === 'number' ? Math.round(value) : 0;

  return (
    <div className="rounded-xl border border-border/50 p-3">
      <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>

      <p className="text-lg font-semibold">
        {safeValue}%
      </p>
    </div>
  );
}

function formatFileSize(bytes: number) {
  if (!bytes || bytes < 1024) {
    return `${bytes || 0} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}