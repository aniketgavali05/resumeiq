import api from '@/lib/api';

export interface SavedJobResponse {
  id: number;
  jobId: number;

  title: string;
  company: string;
  location: string;

  description?: string | null;
  employmentType?: string | null;
  experienceLevel?: string | null;
  salaryRange?: string | null;
  applyUrl?: string | null;
  active?: boolean;

  createdAt?: string | null;
}

export interface SavedJobStatusResponse {
  saved: boolean;
}

const savedJobService = {

  async saveJob(
    jobId: number
  ): Promise<SavedJobResponse> {

    const response =
      await api.post<SavedJobResponse>(
        `/saved-jobs/${jobId}`
      );

    return response.data;
  },

  async unsaveJob(
    jobId: number
  ): Promise<void> {

    await api.delete(
      `/saved-jobs/${jobId}`
    );
  },

  async isJobSaved(
    jobId: number
  ): Promise<boolean> {

    const response =
      await api.get<SavedJobStatusResponse>(
        `/saved-jobs/${jobId}/status`
      );

    return response.data.saved;
  },

  async getMySavedJobs():
    Promise<SavedJobResponse[]> {

    const response =
      await api.get<SavedJobResponse[]>(
        '/saved-jobs'
      );

    return response.data;
  },

  async getCount(): Promise<number> {

    const response =
      await api.get<{ count: number }>(
        '/saved-jobs/count'
      );

    return response.data.count;
  },
};

export default savedJobService;