import api from '@/lib/api';

/**
 * Job returned by the Spring Boot backend.
 *
 * Backend endpoint:
 * GET /api/jobs
 * GET /api/jobs/{id}
 */
export interface JobResponse {
  id: number;
  company: string;
  title: string;
  description: string | null;
  location: string;
  employmentType: string | null;
  experienceLevel: string | null;
  salaryRange: string | null;
  applyUrl: string | null;
  active: boolean;
}

/**
 * Payload used when creating a job.
 *
 * Backend endpoint:
 * POST /api/jobs
 */
export interface CreateJobRequest {
  company: string;
  title: string;
  description?: string;
  location: string;
  employmentType?: string;
  experienceLevel?: string;
  salaryRange?: string;
  applyUrl?: string;
}

/**
 * Payload used when updating a job.
 *
 * NOTE:
 * The current backend JobController does NOT expose
 * PUT /api/jobs/{id} yet.
 *
 * This type is included so the service can be extended
 * cleanly when that endpoint is added.
 */
export type UpdateJobRequest = CreateJobRequest;

/**
 * Job service
 *
 * Centralizes all communication between the frontend
 * and the Spring Boot Job API.
 */
class JobService {
  /**
   * Get all active jobs.
   *
   * Backend:
   * GET /api/jobs
   */
  async getJobs(): Promise<JobResponse[]> {
    const response = await api.get<JobResponse[]>('/jobs');

    return response.data;
  }

  /**
   * Get a single job by ID.
   *
   * Backend:
   * GET /api/jobs/{id}
   */
  async getJobById(id: number): Promise<JobResponse> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid job ID.');
    }

    const response = await api.get<JobResponse>(`/jobs/${id}`);

    return response.data;
  }

  /**
   * Create a new job.
   *
   * Backend:
   * POST /api/jobs
   */
  async createJob(
    request: CreateJobRequest
  ): Promise<JobResponse> {
    const response = await api.post<JobResponse>(
      '/jobs',
      request
    );

    return response.data;
  }

  /**
   * Delete/deactivate a job.
   *
   * Backend:
   * DELETE /api/jobs/{id}
   *
   * The backend performs a soft delete by setting
   * active = false.
   */
  async deleteJob(id: number): Promise<void> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid job ID.');
    }

    await api.delete(`/jobs/${id}`);
  }
}

const jobService = new JobService();

export default jobService;