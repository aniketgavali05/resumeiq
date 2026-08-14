'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { RefreshCw } from 'lucide-react';

import ResumeService, {
  ResumeResponse,
} from '@/services/resumeService';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ResumeHistoryPage() {
  const [history, setHistory] = useState<ResumeResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await ResumeService.getResumes(
        0,
        50,
        '',
        'newest'
      );

      setHistory(response.resumes ?? []);
    } catch (error) {
      console.error(
        'Failed to load resume history:',
        error
      );

      setError(
        'Unable to load resume history. Please try again.'
      );

      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Resume History
        </h1>

        <Button
          variant="outline"
          onClick={loadHistory}
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
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-destructive">
              {error}
            </p>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <Card>
          <CardContent className="p-10 text-center">
            Loading resume history...
          </CardContent>
        </Card>
      ) : history.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center">
            <p className="text-lg font-medium">
              No resume history
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              Upload and analyze a resume to see it here.
            </p>

            <Button asChild className="mt-5">
              <Link href="/dashboard/resumes/upload">
                Upload Resume
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        history.map((resume) => (
          <Card key={resume.id}>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <h2 className="text-lg font-bold">
                  {resume.originalFileName}
                </h2>

                <p className="text-sm text-muted-foreground">
                  {resume.uploadedAt
                    ? new Date(
                        resume.uploadedAt
                      ).toLocaleString()
                    : 'Unknown date'}
                </p>
              </div>

              <div className="text-center">
                <p className="text-3xl font-bold">
                  {Math.round(resume.score ?? 0)}
                </p>

                <p className="text-sm">
                  ATS Score
                </p>
              </div>

              <Link
                href={`/dashboard/resumes/${resume.id}/analysis`}
              >
                <Button>
                  View
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}