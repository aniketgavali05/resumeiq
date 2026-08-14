'use client';

import { Check, Minus } from 'lucide-react';
import type { ResumeResponse } from '@/services/resumeService';

interface CompareTableProps {
  resumes: ResumeResponse[];
}

interface ComparisonRow {
  label: string;
  getValue: (resume: ResumeResponse) => string | number;
}

const rows: ComparisonRow[] = [
  {
    label: 'Overall Score',
    getValue: (resume) =>
      Math.round(resume.score ?? resume.resumeScore ?? 0),
  },
  {
    label: 'Skill Score',
    getValue: (resume) => Math.round(resume.skillScore ?? 0),
  },
  {
    label: 'Keyword Score',
    getValue: (resume) => Math.round(resume.keywordScore ?? 0),
  },
  {
    label: 'Experience Score',
    getValue: (resume) =>
      Math.round(resume.experienceScore ?? 0),
  },
  {
    label: 'Education Score',
    getValue: (resume) =>
      Math.round(resume.educationScore ?? 0),
  },
  {
    label: 'Project Score',
    getValue: (resume) =>
      Math.round(resume.projectScore ?? 0),
  },
  {
    label: 'Certification Score',
    getValue: (resume) =>
      Math.round(resume.certificationScore ?? 0),
  },
  {
    label: 'Section Score',
    getValue: (resume) =>
      Math.round(resume.sectionScore ?? 0),
  },
  {
    label: 'Formatting Score',
    getValue: (resume) =>
      Math.round(resume.formattingScore ?? 0),
  },
  {
    label: 'Matched Skills',
    getValue: (resume) =>
      resume.matchedSkills?.length ?? 0,
  },
  {
    label: 'Missing Skills',
    getValue: (resume) =>
      resume.missingSkills?.length ?? 0,
  },
  {
    label: 'Strengths',
    getValue: (resume) =>
      resume.strengths?.length ?? 0,
  },
  {
    label: 'Weaknesses',
    getValue: (resume) =>
      resume.weaknesses?.length ?? 0,
  },
  {
    label: 'Suggestions',
    getValue: (resume) =>
      resume.suggestions?.length ?? 0,
  },
];

export default function CompareTable({
  resumes,
}: CompareTableProps) {
  if (resumes.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
        Select at least two resumes to compare them.
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-border/60">
      <table className="w-full min-w-[700px] border-collapse">
        <thead>
          <tr className="border-b bg-muted/40">
            <th className="sticky left-0 z-10 bg-muted/40 px-4 py-4 text-left text-sm font-semibold">
              Metric
            </th>

            {resumes.map((resume) => (
              <th
                key={resume.id}
                className="px-4 py-4 text-center text-sm font-semibold"
              >
                <div
                  className="mx-auto max-w-[180px] truncate"
                  title={resume.originalFileName}
                >
                  {resume.originalFileName}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr
              key={row.label}
              className="border-b last:border-0 hover:bg-muted/20"
            >
              <td className="sticky left-0 bg-background px-4 py-3 text-sm font-medium">
                {row.label}
              </td>

              {resumes.map((resume) => {
                const value = row.getValue(resume);

                const isScore =
                  row.label.toLowerCase().includes('score');

                return (
                  <td
                    key={`${resume.id}-${row.label}`}
                    className="px-4 py-3 text-center text-sm"
                  >
                    {isScore ? (
                      <span className="font-semibold">
                        {value}%
                      </span>
                    ) : typeof value === 'number' &&
                      value > 0 ? (
                      <span className="inline-flex items-center justify-center gap-1">
                        <Check className="h-4 w-4 text-green-500" />
                        {value}
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center gap-1 text-muted-foreground">
                        <Minus className="h-4 w-4" />
                        {value}
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}