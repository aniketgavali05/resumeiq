export interface RecentResume {
  id: number;
  fileName: string;
  score: number;
  uploadedAt: string;
}

export interface DashboardStats {
  applications: number;
  interviews: number;
  offers: number;
  savedJobs: number;

  resumeScore: number;
  matchPercentage: number;

  recentResumes: RecentResume[];
}