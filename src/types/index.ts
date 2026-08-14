export interface Resume {
  id: string;
  name: string;
  role: string;
  fileName: string;
  status: 'analyzed' | 'draft' | 'processing';
  atsScore: number;
  skills: string[];
  isFavorite: boolean;
  uploadedAt: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  matchScore: number;
  postedAt: string;
  tags: string[];
  description: string;
  url: string;
}

export interface Application {
  id: string;
  position: string;
  company: string;
  status: 'applied' | 'interview' | 'offer' | 'rejected' | 'withdrawn';
  matchScore: number;
  appliedAt: string;
  nextStep: string;
  nextStepDate: string;
}

export interface SkillGap {
  skill: string;
  currentLevel: number;
  requiredLevel: number;
  category: string;
}

export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending';
  week: number;
  category: string;
}

export interface CoverLetter {
  id: string;
  jobTitle: string;
  company: string;
  tone: string;
  content: string;
  createdAt: string;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  suggestedAnswer: string;
}

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
}

export interface PricingPlan {
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  highlight: boolean;
  cta: string;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export interface AnalyticsData {
  applicationsOverTime: { date: string; count: number }[];
  statusBreakdown: { status: string; count: number; fill: string }[];
  responseRate: number;
  avgResponseTime: number;
  topCompanies: { company: string; applications: number }[];
}
