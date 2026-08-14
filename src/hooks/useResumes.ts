'use client';

import { useCallback, useEffect, useState } from 'react';
import resumeService, {
  type ResumePageResponse,
} from '@/services/resumeService';

type ResumeSort =
  | 'newest'
  | 'oldest'
  | 'scoreHigh'
  | 'scoreLow';

interface UseResumesParams {
  page: number;
  size: number;
  search: string;
  sort: ResumeSort;
}

const EMPTY_RESPONSE: ResumePageResponse = {
  resumes: [],
  currentPage: 0,
  totalPages: 0,
  totalElements: 0,
};

export function useResumes({
  page = 0,
  size = 10,
  search = '',
  sort = 'newest',
}: UseResumesParams) {
  const [data, setData] =
    useState<ResumePageResponse>(EMPTY_RESPONSE);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchResumes = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const result = await resumeService.getResumes(
        page,
        size,
        search,
        sort
      );

      setData(result);
    } catch (err) {
      console.error('Failed to load resumes:', err);

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load resumes.'
      );

      setData({
        ...EMPTY_RESPONSE,
        currentPage: page,
      });
    } finally {
      setLoading(false);
    }
  }, [page, size, search, sort]);

  useEffect(() => {
    void fetchResumes();
  }, [fetchResumes]);

  const refresh = useCallback(async () => {
    await fetchResumes();
  }, [fetchResumes]);

  const deleteResume = useCallback(
    async (id: number) => {
      try {
        setError('');

        await resumeService.deleteResume(id);

        // Refresh the list after successful deletion.
        await fetchResumes();
      } catch (err) {
        console.error('Failed to delete resume:', err);

        const message =
          err instanceof Error
            ? err.message
            : 'Failed to delete resume.';

        setError(message);

        throw err;
      }
    },
    [fetchResumes]
  );

  return {
    data,
    resumes: data.resumes,
    loading,
    error,
    refresh,
    deleteResume,
  };
}