'use client';

import { useCallback, useEffect, useState } from 'react';

import applicationService, {
  type ApplicationResponse,
} from '@/services/applicationService';

export function useApplications() {
  const [applications, setApplications] = useState<
    ApplicationResponse[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const result =
        await applicationService.getMyApplications();

      setApplications(result);
    } catch (err) {
      console.error(
        'Failed to load applications:',
        err,
      );

      setApplications([]);

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load applications.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchApplications();
  }, [fetchApplications]);

  const refresh = useCallback(async () => {
    await fetchApplications();
  }, [fetchApplications]);

  return {
    applications,
    data: applications,
    loading,
    error,
    refresh,
  };
}