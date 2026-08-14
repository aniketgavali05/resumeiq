import api from '@/lib/api';

export interface JobMatchResponse {
  jobId: number;
  jobTitle: string;
  company: string;
  location: string;

  matchScore: number;
  atsScore: number;

  matchedSkills: string[];
  missingSkills: string[];

  recommendation: string;
}

class JobMatchingService {
  async getMatches(): Promise<JobMatchResponse[]> {
    const response = await api.get<JobMatchResponse[]>(
      '/jobmatching/matches'
    );

    return response.data;
  }
}

const jobMatchingService =
  new JobMatchingService();

export default jobMatchingService;