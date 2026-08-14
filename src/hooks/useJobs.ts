'use client';

import { useCallback, useEffect, useState } from 'react';

import jobService, {
  type JobResponse,
} from '@/services/jobService';

export function useJobs() {
  const [jobs, setJobs] = useState<JobResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const result = await jobService.getJobs();

      setJobs(result);
    } catch (err) {
      console.error('Failed to load jobs:', err);

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load jobs.'
      );

      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchJobs();
  }, [fetchJobs]);

  const refresh = useCallback(async () => {
    await fetchJobs();
  }, [fetchJobs]);

  return {
    jobs,
    data: jobs,
    loading,
    error,
    refresh,
  };
}