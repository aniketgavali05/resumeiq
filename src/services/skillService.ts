import api from '@/lib/api';

export interface SkillGapResponse {
  skill: string;
  currentLevel: number;
  requiredLevel: number;
  category: string;
}

interface SkillAnalysisResponse {
  skills: SkillGapResponse[];
}

const skillService = {
  async getMySkills(): Promise<SkillGapResponse[]> {
    const response =
      await api.get<SkillAnalysisResponse>('/skills');

    return response.data.skills ?? [];
  },
};

export default skillService;