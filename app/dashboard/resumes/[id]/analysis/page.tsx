
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import ATSGauge from '@/components/ats/ATSGauge';
import ScoreCard from '@/components/ats/ScoreCard';
import ProgressBar from '@/components/ats/ProgressBar';
import SkillBadge from '@/components/ats/SkillBadge';
import ATSBarChart from '@/components/ats/ATSBarChart';
import ATSRadarChart from '@/components/ats/ATSRadarChart';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { generateATSReport } from '@/utils/pdfGenerator';

import resumeService, {
  type ResumeResponse,
} from '@/services/resumeService';

export default function ResumeAnalysisPage() {
  const params = useParams();
  const router = useRouter();

  const [resume, setResume] =
    useState<ResumeResponse | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  useEffect(() => {
    const rawId = params?.id;

    const id =
      typeof rawId === 'string'
        ? Number(rawId)
        : Array.isArray(rawId)
          ? Number(rawId[0])
          : NaN;

    if (!Number.isFinite(id) || id <= 0) {
      setError('Invalid resume ID.');
      setLoading(false);
      return;
    }

    let mounted = true;

    const loadAnalysis = async () => {
      try {
        setLoading(true);
        setError('');

        const result =
          await resumeService.getResumeAnalysis(id);

        if (!mounted) {
          return;
        }

        setResume(result);
      } catch (err) {
        console.error(
          'Failed to load resume analysis:',
          err
        );

        if (!mounted) {
          return;
        }

        setResume(null);

        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load resume analysis.'
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void loadAnalysis();

    return () => {
      mounted = false;
    };
  }, [params]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <p className="text-sm text-muted-foreground">
          Loading resume analysis...
        </p>
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="mx-auto max-w-xl px-6 py-20 text-center">
        <h1 className="text-2xl font-bold">
          Unable to load resume analysis
        </h1>

        <p className="mt-3 text-sm text-muted-foreground">
          {error ||
            'Resume analysis could not be found.'}
        </p>

        <Button
          className="mt-6"
          onClick={() => {
            router.push('/dashboard/resumes');
          }}
        >
          Back to Resumes
        </Button>
      </div>
    );
  }

  const chartData = [
    { name: 'Skill', score: resume.skillScore },
    { name: 'Keyword', score: resume.keywordScore },
    { name: 'Experience', score: resume.experienceScore },
    { name: 'Education', score: resume.educationScore },
    { name: 'Projects', score: resume.projectScore },
    { name: 'Certification', score: resume.certificationScore },
    { name: 'Sections', score: resume.sectionScore },
    { name: 'Formatting', score: resume.formattingScore },
  ];

  const radarData = [
    { subject: 'Skill', score: resume.skillScore },
    { subject: 'Keyword', score: resume.keywordScore },
    { subject: 'Experience', score: resume.experienceScore },
    { subject: 'Education', score: resume.educationScore },
    { subject: 'Projects', score: resume.projectScore },
    { subject: 'Certification', score: resume.certificationScore },
    { subject: 'Sections', score: resume.sectionScore },
    { subject: 'Formatting', score: resume.formattingScore },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            ATS Resume Analysis
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            {resume.originalFileName}
          </p>
        </div>

        <Button
          onClick={() => {
            void generateATSReport(resume);
          }}
        >
          Download Report
        </Button>
      </div>

      <Card>
        <CardContent className="flex justify-center py-10">
          <ATSGauge
            score={resume.score}
            level={resume.scoreLevel}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold">
            Resume Summary
          </h2>

          <p className="mt-4 text-muted-foreground">
            {resume.scoreLevel} ATS Resume with an
            overall score of{' '}
            <span className="font-bold">
              {resume.score}
            </span>
            . Improve the missing skills and
            optimize keywords to increase your score.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <ScoreCard
          title="Skill Score"
          score={resume.skillScore}
        />

        <ScoreCard
          title="Keyword Score"
          score={resume.keywordScore}
        />

        <ScoreCard
          title="Experience"
          score={resume.experienceScore}
        />

        <ScoreCard
          title="Education"
          score={resume.educationScore}
        />

        <ScoreCard
          title="Projects"
          score={resume.projectScore}
        />

        <ScoreCard
          title="Certification"
          score={resume.certificationScore}
        />

        <ScoreCard
          title="Sections"
          score={resume.sectionScore}
        />

        <ScoreCard
          title="Formatting"
          score={resume.formattingScore}
        />

        <ScoreCard
          title="Potential Score"
          score={Math.min(
            resume.score + 10,
            100
          )}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <h2 className="mb-4 text-xl font-bold">
              ATS Score Breakdown
            </h2>

            <ATSBarChart data={chartData} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="mb-4 text-xl font-bold">
              Resume Radar
            </h2>

            <ATSRadarChart data={radarData} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="space-y-5 p-6">
          <ProgressBar
            title="Skills"
            value={resume.skillScore}
          />

          <ProgressBar
            title="Keywords"
            value={resume.keywordScore}
          />

          <ProgressBar
            title="Experience"
            value={resume.experienceScore}
          />

          <ProgressBar
            title="Education"
            value={resume.educationScore}
          />

          <ProgressBar
            title="Projects"
            value={resume.projectScore}
          />

          <ProgressBar
            title="Certification"
            value={resume.certificationScore}
          />

          <ProgressBar
            title="Sections"
            value={resume.sectionScore}
          />

          <ProgressBar
            title="Formatting"
            value={resume.formattingScore}
          />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <h2 className="mb-4 text-xl font-bold">
              💪 Resume Strengths
            </h2>

            <ul className="space-y-2">
              {(resume.strengths ?? []).map(
                (item, index) => (
                  <li key={index}>
                    ✅ {item}
                  </li>
                )
              )}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="mb-4 text-xl font-bold">
              ⚠ Resume Weaknesses
            </h2>

            <ul className="space-y-2">
              {(resume.weaknesses ?? []).map(
                (item, index) => (
                  <li key={index}>
                    ❌ {item}
                  </li>
                )
              )}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <h2 className="mb-4 text-xl font-bold">
              Matched Skills
            </h2>

            <div className="flex flex-wrap gap-2">
              {(resume.matchedSkills ?? []).map(
                (skill) => (
                  <SkillBadge
                    key={skill}
                    label={skill}
                    matched={true}
                  />
                )
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="mb-4 text-xl font-bold">
              Missing Skills
            </h2>

            <div className="flex flex-wrap gap-2">
              {(resume.missingSkills ?? []).map(
                (skill) => (
                  <SkillBadge
                    key={skill}
                    label={skill}
                    matched={false}
                  />
                )
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="mb-4 text-xl font-bold">
            AI Suggestions
          </h2>

          <ul className="space-y-2">
            {(resume.suggestions ?? []).map(
              (item, index) => (
                <li key={index}>
                  💡 {item}
                </li>
              )
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

