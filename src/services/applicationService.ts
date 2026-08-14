import api from '@/lib/api';

export interface CreateApplicationRequest {
  jobId: number;
  notes?: string;
}

export interface ApplicationResponse {
  id: number;
  jobId: number;
  jobTitle: string;
  company: string;
  location: string;
  employmentType?: string | null;
  experienceLevel?: string | null;
  salaryRange?: string | null;
  applyUrl?: string | null;
  status: string;
  notes?: string | null;
  appliedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

const applicationService = {
  async createApplication(
    data: CreateApplicationRequest,
  ): Promise<ApplicationResponse> {
    const response = await api.post<ApplicationResponse>(
      '/applications',
      data,
    );

    return response.data;
  },

  async getMyApplications(): Promise<ApplicationResponse[]> {
    const response = await api.get<ApplicationResponse[]>(
      '/applications',
    );

    return response.data;
  },

  async getApplicationById(
    id: number,
  ): Promise<ApplicationResponse> {
    const response = await api.get<ApplicationResponse>(
      `/applications/${id}`,
    );

    return response.data;
  },

  async updateStatus(
    id: number,
    status: string,
  ): Promise<ApplicationResponse> {
    const response = await api.put<ApplicationResponse>(
      `/applications/${id}/status`,
      { status },
    );

    return response.data;
  },

  async deleteApplication(id: number): Promise<void> {
    await api.delete(`/applications/${id}`);
  },
};

export default applicationService;