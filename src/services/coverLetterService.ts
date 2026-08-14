import api from '@/lib/api';

export interface CoverLetterResponse {
  id: number;
  applicationId: number;
  jobTitle: string;
  company: string;
  tone: string;
  content: string;
  createdAt: string;
}

export interface CreateCoverLetterRequest {
  applicationId: number;
  tone?: string;
}

const coverLetterService = {
  async getMyCoverLetters(): Promise<CoverLetterResponse[]> {
    const response =
      await api.get<CoverLetterResponse[]>(
        '/cover-letters'
      );

    return response.data;
  },

  async createCoverLetter(
    data: CreateCoverLetterRequest
  ): Promise<CoverLetterResponse> {
    const response =
      await api.post<CoverLetterResponse>(
        '/cover-letters',
        data
      );

    return response.data;
  },

  async getCoverLetterById(
    id: number
  ): Promise<CoverLetterResponse> {
    const response =
      await api.get<CoverLetterResponse>(
        `/cover-letters/${id}`
      );

    return response.data;
  },

  async deleteCoverLetter(
    id: number
  ): Promise<void> {
    await api.delete(
      `/cover-letters/${id}`
    );
  },
};

export default coverLetterService;