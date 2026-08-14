import api from '@/lib/api';

export interface InterviewResponse {
  id: number;
  applicationId: number;

  jobId: number;
  jobTitle: string;
  company: string;

  interviewType: string;
  scheduledAt: string;

  interviewerName?: string | null;
  meetingLink?: string | null;
  location?: string | null;

  notes?: string | null;
  status: string;

  createdAt?: string | null;
  updatedAt?: string | null;
}

const interviewService = {
  async getMyInterviews(): Promise<InterviewResponse[]> {
    const response =
      await api.get<InterviewResponse[]>(
        '/interviews'
      );

    return response.data;
  },

  async getInterviewById(
    id: number
  ): Promise<InterviewResponse> {
    const response =
      await api.get<InterviewResponse>(
        `/interviews/${id}`
      );

    return response.data;
  },

  async createInterview(data: {
    applicationId: number;
    interviewType: string;
    scheduledAt: string;
    interviewerName?: string;
    meetingLink?: string;
    location?: string;
    notes?: string;
  }): Promise<InterviewResponse> {
    const params = new URLSearchParams();

    params.set(
      'applicationId',
      String(data.applicationId)
    );

    params.set(
      'interviewType',
      data.interviewType
    );

    params.set(
      'scheduledAt',
      data.scheduledAt
    );

    if (data.interviewerName) {
      params.set(
        'interviewerName',
        data.interviewerName
      );
    }

    if (data.meetingLink) {
      params.set(
        'meetingLink',
        data.meetingLink
      );
    }

    if (data.location) {
      params.set(
        'location',
        data.location
      );
    }

    if (data.notes) {
      params.set(
        'notes',
        data.notes
      );
    }

    const response =
      await api.post<InterviewResponse>(
        `/interviews?${params.toString()}`
      );

    return response.data;
  },

  async updateStatus(
    id: number,
    status: string
  ): Promise<InterviewResponse> {
    const response =
      await api.put<InterviewResponse>(
        `/interviews/${id}/status`,
        { status }
      );

    return response.data;
  },

  async deleteInterview(
    id: number
  ): Promise<void> {
    await api.delete(`/interviews/${id}`);
  },

  async getCount(): Promise<number> {
    const response =
      await api.get<{ count: number }>(
        '/interviews/count'
      );

    return response.data.count;
  },
};

export default interviewService;