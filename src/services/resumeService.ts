
import api from '@/lib/api';

export interface ResumeResponse {
  id: number;

  originalFileName: string;
  storedFileName: string;
  fileType: string;
  fileSize: number;

  resumeScore: number;
  uploadedAt: string;

  score: number;

  skillScore: number;
  keywordScore: number;
  experienceScore: number;
  educationScore: number;
  projectScore: number;
  certificationScore: number;
  sectionScore: number;
  formattingScore: number;

  scoreLevel: string;

  matchedSkills: string[];
  missingSkills: string[];

  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export interface ResumePageResponse {
  resumes: ResumeResponse[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
}

export type ResumeSort =
  | 'newest'
  | 'oldest'
  | 'scoreHigh'
  | 'scoreLow';

class ResumeService {
  async uploadResume(
    file: File,
    jobDescription: string
  ): Promise<ResumeResponse> {
    const formData = new FormData();

    formData.append('file', file);
    formData.append('jobDescription', jobDescription);

    const response =
      await api.post<ResumeResponse>(
        '/resumes/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

    return response.data;
  }

  async getResumes(
    page = 0,
    size = 10,
    search = '',
    sort: ResumeSort = 'newest'
  ): Promise<ResumePageResponse> {
    const response =
      await api.get<ResumePageResponse>(
        '/resumes',
        {
          params: {
            page,
            size,
            search,
            sort,
          },
        }
      );

    return response.data;
  }

  async getResumeAnalysis(
    id: number
  ): Promise<ResumeResponse> {
    const response =
      await api.get<ResumeResponse>(
        `/resumes/${id}/analysis`
      );

    return response.data;
  }

  async deleteResume(
    id: number
  ): Promise<void> {
    await api.delete(
      `/resumes/${id}`
    );
  }
}

export default new ResumeService();

