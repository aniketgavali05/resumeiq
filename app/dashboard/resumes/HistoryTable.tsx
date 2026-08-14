'use client';

import Link from 'next/link';
import { Eye, FileText, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';

import type { ResumeHistoryItem } from './ResumeHistoryCard';

interface HistoryTableProps {
  history: ResumeHistoryItem[];
  onDelete?: (id: number | string) => void;
}

export default function HistoryTable({
  history,
  onDelete,
}: HistoryTableProps) {
  if (history.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed p-10 text-center">
        <FileText className="mx-auto h-10 w-10 text-muted-foreground" />

        <h2 className="mt-4 text-lg font-semibold">
          No resume history
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Upload and analyze a resume to see it here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border/60">
      <table className="w-full min-w-[720px] border-collapse">
        <thead>
          <tr className="border-b bg-muted/40">
            <th className="px-4 py-4 text-left text-sm font-semibold">
              Resume
            </th>

            <th className="px-4 py-4 text-left text-sm font-semibold">
              Analyzed
            </th>

            <th className="px-4 py-4 text-center text-sm font-semibold">
              ATS Score
            </th>

            <th className="px-4 py-4 text-left text-sm font-semibold">
              Level
            </th>

            <th className="px-4 py-4 text-right text-sm font-semibold">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {history.map((resume) => {
            const score = Math.round(
              Number(resume.atsScore) || 0
            );

            return (
              <tr
                key={`${resume.id}-${resume.analyzedAt}`}
                className="border-b last:border-0 hover:bg-muted/20"
              >
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <FileText className="h-4 w-4" />
                    </div>

                    <span
                      className="max-w-[260px] truncate text-sm font-medium"
                      title={resume.fileName}
                    >
                      {resume.fileName || 'Untitled Resume'}
                    </span>
                  </div>
                </td>

                <td className="px-4 py-4 text-sm text-muted-foreground">
                  {resume.analyzedAt || '—'}
                </td>

                <td className="px-4 py-4 text-center">
                  <span className="font-semibold">
                    {score}
                  </span>
                </td>

                <td className="px-4 py-4 text-sm">
                  {resume.scoreLevel || '—'}
                </td>

                <td className="px-4 py-4">
                  <div className="flex justify-end gap-2">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                    >
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
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}