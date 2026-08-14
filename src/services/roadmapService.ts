import api from '@/lib/api';

export interface RoadmapResponse {
  id: string;
  week: number;
  title: string;
  description: string;
  category: string;
  status: 'completed' | 'in-progress' | 'pending';
}

interface RoadmapApiResponse {
  roadmap: RoadmapResponse[];
}

const roadmapService = {
  async getMyRoadmap(): Promise<RoadmapResponse[]> {
    const response =
      await api.get<RoadmapApiResponse>(
        '/roadmap'
      );

    return response.data.roadmap ?? [];
  },
};

export default roadmapService;