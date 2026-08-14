export interface ATSResponse {

  // Overall Score
  score: number;

  // Score Breakdown
  skillScore: number;
  keywordScore: number;
  experienceScore: number;
  educationScore: number;
  projectScore: number;
  certificationScore: number;
  sectionScore: number;
  formattingScore: number;

  // Rating
  scoreLevel: string;

  // Skills
  matchedSkills: string[];
  missingSkills: string[];

  // Analysis
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}