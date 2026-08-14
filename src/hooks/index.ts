'use client';

import { useEffect, useState } from 'react';
import skillService from '@/services/skillService';
import roadmapService from '@/services/roadmapService';
import coverLetterService from '@/services/coverLetterService';
import notificationService from '@/services/notificationService';
import type {
  Testimonial,
  PricingPlan,
  Application,
  SkillGap,
  RoadmapItem,
  CoverLetter,
  InterviewQuestion,
  Notification,
  AnalyticsData,
} from '@/types';

import applicationService, {
  ApplicationResponse,
} from '@/services/applicationService';

// =====================================================
// Real API hooks
// =====================================================

export { useResumes } from './useResumes';
export { useDashboardStats } from './useDashboardStats';
export { useJobs } from './useJobs';
export { useApplications } from './useApplications';

// =====================================================
// Testimonials & Pricing
// =====================================================

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Sarah Chen',
    role: 'Software Engineer',
    company: 'Stripe',
    avatar: 'https://i.pravatar.cc/80?img=1',
    content:
      'ResumeIQ helped me identify exactly what was missing from my resume. Landed 3 interviews in the first week after updating it.',
  },
  {
    name: 'Marcus Johnson',
    role: 'Product Manager',
    company: 'Notion',
    avatar: 'https://i.pravatar.cc/80?img=12',
    content:
      'The ATS scoring feature is a game changer. I finally understood why my applications were getting filtered out.',
  },
  {
    name: 'Priya Patel',
    role: 'Data Analyst',
    company: 'Spotify',
    avatar: 'https://i.pravatar.cc/80?img=5',
    content:
      'Clean, fast, and actually useful suggestions. Not just generic tips — specific to my resume and target role.',
  },
];

const PRICING_PLANS: PricingPlan[] = [
  {
    name: 'Free',
    description: 'For getting started with resume analysis.',
    price: 0,
    period: 'month',
    features: [
      '3 resume analyses per month',
      'Basic ATS scoring',
      'Keyword matching',
      'Community support',
    ],
    highlight: false,
    cta: 'Get started free',
  },
  {
    name: 'Pro',
    description: 'For active job seekers who want an edge.',
    price: 12,
    period: 'month',
    features: [
      'Unlimited resume analyses',
      'Advanced ATS scoring',
      'AI-powered suggestions',
      'Cover letter generator',
      'Priority support',
    ],
    highlight: true,
    cta: 'Start free trial',
  },
  {
    name: 'Team',
    description: 'For career coaches and small teams.',
    price: 39,
    period: 'month',
    features: [
      'Everything in Pro',
      'Up to 5 team members',
      'Shared resume templates',
      'Analytics dashboard',
      'Dedicated support',
    ],
    highlight: false,
    cta: 'Contact sales',
  },
];

export function useTestimonials() {
  const [data] = useState<Testimonial[]>(TESTIMONIALS);
  const [loading] = useState(false);

  return {
    data,
    loading,
  };
}

export function usePricing() {
  const [data] = useState<PricingPlan[]>(PRICING_PLANS);
  const [loading] = useState(false);

  return {
    data,
    loading,
  };
}

// =====================================================
// Applications - Legacy/demo data
// =====================================================

const APPLICATIONS: Application[] = [
  {
    id: '1',
    position: 'Senior Frontend Engineer',
    company: 'Vercel',
    status: 'interview',
    matchScore: 92,
    appliedAt: '2026-07-20',
    nextStep: 'Technical interview',
    nextStepDate: '2026-08-15',
  },
  {
    id: '2',
    position: 'Full Stack Developer',
    company: 'Linear',
    status: 'applied',
    matchScore: 85,
    appliedAt: '2026-07-25',
    nextStep: 'Awaiting response',
    nextStepDate: '',
  },
  {
    id: '3',
    position: 'Backend Engineer',
    company: 'Supabase',
    status: 'offer',
    matchScore: 78,
    appliedAt: '2026-07-10',
    nextStep: 'Review offer',
    nextStepDate: '2026-08-10',
  },
  {
    id: '4',
    position: 'Product Designer',
    company: 'Figma',
    status: 'rejected',
    matchScore: 65,
    appliedAt: '2026-07-05',
    nextStep: '',
    nextStepDate: '',
  },
];

// =====================================================
// Skill Gaps
// =====================================================

const SKILL_GAPS: SkillGap[] = [
  {
    skill: 'React',
    currentLevel: 85,
    requiredLevel: 80,
    category: 'Frontend',
  },
  {
    skill: 'TypeScript',
    currentLevel: 75,
    requiredLevel: 85,
    category: 'Frontend',
  },
  {
    skill: 'Node.js',
    currentLevel: 60,
    requiredLevel: 75,
    category: 'Backend',
  },
  {
    skill: 'System Design',
    currentLevel: 50,
    requiredLevel: 70,
    category: 'Architecture',
  },
  {
    skill: 'SQL',
    currentLevel: 70,
    requiredLevel: 65,
    category: 'Backend',
  },
];

export function useSkillGaps() {
  const [data, setData] = useState<SkillGap[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadSkills = async () => {
      try {
        setLoading(true);

        const skills =
          await skillService.getMySkills();

        if (!mounted) {
          return;
        }

        setData(skills);
      } catch (error) {
        console.error(
          'Failed to load skill gaps:',
          error
        );

        if (!mounted) {
          return;
        }

        setData([]);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void loadSkills();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    data,
    loading,
  };
}
// =====================================================
// Roadmap
// =====================================================

const ROADMAP: RoadmapItem[] = [
  {
    id: '1',
    title: 'Master TypeScript generics',
    description:
      'Deepen your understanding of advanced type patterns.',
    status: 'completed',
    week: 1,
    category: 'Frontend',
  },
  {
    id: '2',
    title: 'Build a system design portfolio',
    description:
      'Document 2-3 system designs to discuss in interviews.',
    status: 'in-progress',
    week: 2,
    category: 'Architecture',
  },
  {
    id: '3',
    title: 'Practice behavioral interviews',
    description:
      'Prepare STAR-format answers for common questions.',
    status: 'pending',
    week: 3,
    category: 'Interview Prep',
  },
];

export function useRoadmap() {
  const [data, setData] =
    useState<RoadmapItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let mounted = true;

    const loadRoadmap = async () => {
      try {
        setLoading(true);

        const roadmap =
          await roadmapService.getMyRoadmap();

        if (!mounted) {
          return;
        }

        setData(
          roadmap.map((item) => ({
            id: item.id,
            week: item.week,
            title: item.title,
            description: item.description,
            category: item.category,
            status: item.status,
          }))
        );
      } catch (error) {
        console.error(
          'Failed to load roadmap:',
          error
        );

        if (!mounted) {
          return;
        }

        setData([]);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void loadRoadmap();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    data,
    loading,
  };
}

// =====================================================
// Cover Letters
// =====================================================

const COVER_LETTERS: CoverLetter[] = [
  {
    id: '1',
    jobTitle: 'Senior Frontend Engineer',
    company: 'Vercel',
    tone: 'Professional',
    content:
      'I am excited to apply for the Senior Frontend Engineer role at Vercel. With five years of experience building performant React applications...',
    createdAt: '2026-07-20',
  },
  {
    id: '2',
    jobTitle: 'Full Stack Developer',
    company: 'Linear',
    tone: 'Enthusiastic',
    content:
      "Linear's commitment to speed and craft is exactly the kind of engineering culture I want to be part of...",
    createdAt: '2026-07-25',
  },
];

export function useCoverLetters() {
  const [data, setData] =
    useState<CoverLetter[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let mounted = true;

    const loadCoverLetters =
      async () => {
        try {
          setLoading(true);

          const letters =
            await coverLetterService
              .getMyCoverLetters();

          if (!mounted) {
            return;
          }

          setData(
            letters.map((letter) => ({
              id: String(letter.id),
              jobTitle: letter.jobTitle,
              company: letter.company,
              tone: letter.tone,
              content: letter.content,
              createdAt: new Date(
                letter.createdAt
              ).toLocaleDateString(),
            }))
          );
        } catch (error) {
          console.error(
            'Failed to load cover letters:',
            error
          );

          if (!mounted) {
            return;
          }

          setData([]);
        } finally {
          if (mounted) {
            setLoading(false);
          }
        }
      };

    void loadCoverLetters();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    data,
    loading,
  };
}
// =====================================================
// Interview Questions
// =====================================================

const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: '1',
    question: 'Tell me about yourself.',
    category: 'Behavioral',
    difficulty: 'easy',
    suggestedAnswer:
      'Structure your answer around present, past, and future — what you do now, relevant past experience, and why this role excites you.',
  },
  {
    id: '2',
    question:
      'Explain the difference between var, let, and const.',
    category: 'Technical',
    difficulty: 'easy',
    suggestedAnswer:
      'var is function-scoped and hoisted; let and const are block-scoped. const cannot be reassigned after declaration.',
  },
  {
    id: '3',
    question: 'How would you design a rate limiter?',
    category: 'System Design',
    difficulty: 'hard',
    suggestedAnswer:
      'Discuss token bucket vs sliding window algorithms, storage (Redis), and distributed considerations.',
  },
  {
    id: '4',
    question:
      'Describe a time you disagreed with a teammate.',
    category: 'Behavioral',
    difficulty: 'medium',
    suggestedAnswer:
      'Use the STAR method: Situation, Task, Action, Result. Focus on how you resolved it constructively.',
  },
];

export function useInterviewQuestions() {
  const [data] = useState<InterviewQuestion[]>(
    INTERVIEW_QUESTIONS
  );
  const [loading] = useState(false);

  return {
    data,
    loading,
  };
}

// =====================================================
// Notifications
// =====================================================

const NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Resume analysis complete',
    description:
      'Your resume "Vikrant Resume (1).pdf" scored 78/100.',
    type: 'success',
    read: false,
    createdAt: '2 hours ago',
  },
  {
    id: '2',
    title: 'New job match found',
    description:
      'Senior Frontend Engineer at Vercel matches your profile 92%.',
    type: 'info',
    read: false,
    createdAt: '1 day ago',
  },
  {
    id: '3',
    title: 'Application deadline approaching',
    description:
      'Your application to Linear is due in 2 days.',
    type: 'warning',
    read: true,
    createdAt: '2 days ago',
  },
];

export function useNotifications() {
  const [data, setData] =
    useState<Notification[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let mounted = true;

    const loadNotifications =
      async () => {
        try {
          setLoading(true);

          const notifications =
            await notificationService
              .getMyNotifications();

          if (!mounted) {
            return;
          }

          setData(
            notifications.map(
              (notification) => ({
                id: String(
                  notification.id
                ),
                title:
                  notification.title,
                description:
                  notification.description,
                type:
                  notification.type,
                read:
                  notification.read,
                createdAt:
                  new Date(
                    notification.createdAt
                  ).toLocaleString(),
              })
            )
          );
        } catch (error) {
          console.error(
            'Failed to load notifications:',
            error
          );

          if (!mounted) {
            return;
          }

          setData([]);
        } finally {
          if (mounted) {
            setLoading(false);
          }
        }
      };

    void loadNotifications();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    data,
    loading,
  };
}

// =====================================================
// Analytics
// =====================================================

function getWeekBucket(date: Date): number {
  const now = new Date();

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const startOfDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  const diffMs =
    startOfToday.getTime() -
    startOfDate.getTime();

  const diffDays = Math.floor(
    diffMs / (1000 * 60 * 60 * 24)
  );

  if (diffDays < 0) {
    return 0;
  }

  if (diffDays < 7) {
    return 3;
  }

  if (diffDays < 14) {
    return 2;
  }

  if (diffDays < 21) {
    return 1;
  }

  return 0;
}

function buildAnalyticsData(
  applications: ApplicationResponse[]
): AnalyticsData {
  const safeApplications = Array.isArray(
    applications
  )
    ? applications
    : [];

  // ===================================================
  // Applications over time
  // ===================================================

  const weeklyCounts = [0, 0, 0, 0];

  safeApplications.forEach((application) => {
    if (!application.appliedAt) {
      return;
    }

    const date = new Date(application.appliedAt);

    if (Number.isNaN(date.getTime())) {
      return;
    }

    const bucket = getWeekBucket(date);

    weeklyCounts[bucket] += 1;
  });

  const applicationsOverTime = [
    {
      date: '3 Weeks Ago',
      count: weeklyCounts[0],
    },
    {
      date: '2 Weeks Ago',
      count: weeklyCounts[1],
    },
    {
      date: 'Last Week',
      count: weeklyCounts[2],
    },
    {
      date: 'This Week',
      count: weeklyCounts[3],
    },
  ];

  // ===================================================
  // Status distribution
  // ===================================================

  const statusCounts: Record<string, number> = {};

  safeApplications.forEach((application) => {
    const normalizedStatus =
      String(application.status || 'APPLIED')
        .trim()
        .toUpperCase();

    statusCounts[normalizedStatus] =
      (statusCounts[normalizedStatus] || 0) + 1;
  });

  const statusLabelMap: Record<string, string> = {
    APPLIED: 'Applied',
    INTERVIEW: 'Interview',
    OFFER: 'Offer',
    REJECTED: 'Rejected',
    WITHDRAWN: 'Withdrawn',
  };

  const statusColorMap: Record<string, string> = {
    APPLIED: 'hsl(var(--chart-1))',
    INTERVIEW: 'hsl(var(--chart-3))',
    OFFER: 'hsl(var(--chart-2))',
    REJECTED: 'hsl(var(--chart-4))',
    WITHDRAWN: 'hsl(var(--destructive))',
  };

  const statusOrder = [
    'APPLIED',
    'INTERVIEW',
    'OFFER',
    'REJECTED',
    'WITHDRAWN',
  ];

  const statusBreakdown = statusOrder
    .filter((status) => statusCounts[status] > 0)
    .map((status) => ({
      status: statusLabelMap[status],
      count: statusCounts[status],
      fill:
        statusColorMap[status] ||
        'hsl(var(--chart-1))',
    }));

  // Include any unexpected backend statuses too.
  Object.entries(statusCounts)
    .filter(
      ([status]) =>
        !statusOrder.includes(status)
    )
    .forEach(([status, count]) => {
      statusBreakdown.push({
        status:
          status.charAt(0) +
          status.slice(1).toLowerCase(),
        count,
        fill: 'hsl(var(--chart-1))',
      });
    });

  // ===================================================
  // Response rate
  // ===================================================

  const respondedApplications =
    safeApplications.filter((application) => {
      const status =
        String(application.status || '')
          .trim()
          .toUpperCase();

      return (
        status === 'INTERVIEW' ||
        status === 'OFFER' ||
        status === 'REJECTED'
      );
    }).length;

  const responseRate =
    safeApplications.length === 0
      ? 0
      : Math.round(
          (respondedApplications /
            safeApplications.length) *
            100
        );

  // ===================================================
  // Average response time
  // ===================================================

  const responseTimes: number[] = [];

  safeApplications.forEach((application) => {
    const status =
      String(application.status || '')
        .trim()
        .toUpperCase();

    const responded =
      status === 'INTERVIEW' ||
      status === 'OFFER' ||
      status === 'REJECTED';

    if (
      !responded ||
      !application.appliedAt ||
      !application.updatedAt
    ) {
      return;
    }

    const appliedDate = new Date(
      application.appliedAt
    );

    const responseDate = new Date(
      application.updatedAt
    );

    if (
      Number.isNaN(appliedDate.getTime()) ||
      Number.isNaN(responseDate.getTime())
    ) {
      return;
    }

    const differenceMs =
      responseDate.getTime() -
      appliedDate.getTime();

    const differenceDays =
      differenceMs /
      (1000 * 60 * 60 * 24);

    if (
      differenceDays >= 0 &&
      differenceDays <= 365
    ) {
      responseTimes.push(differenceDays);
    }
  });

  const avgResponseTime =
    responseTimes.length === 0
      ? 0
      : Number(
          (
            responseTimes.reduce(
              (sum, value) => sum + value,
              0
            ) / responseTimes.length
          ).toFixed(1)
        );

  // ===================================================
  // Top companies
  // ===================================================

  const companyCounts: Record<string, number> = {};

  safeApplications.forEach((application) => {
    const company =
      application.company?.trim() ||
      'Unknown Company';

    companyCounts[company] =
      (companyCounts[company] || 0) + 1;
  });

  const topCompanies = Object.entries(
    companyCounts
  )
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([company, applications]) => ({
      company,
      applications,
    }));

  return {
    applicationsOverTime,
    statusBreakdown,
    responseRate,
    avgResponseTime,
    topCompanies,
  };
}

export function useAnalytics() {
  const [data, setData] =
    useState<AnalyticsData | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let mounted = true;

    const loadAnalytics = async () => {
      try {
        setLoading(true);

        const applications =
          await applicationService.getMyApplications();

        if (!mounted) {
          return;
        }

        setData(
          buildAnalyticsData(applications)
        );
      } catch (error) {
        console.error(
          'Failed to load analytics:',
          error
        );

        if (!mounted) {
          return;
        }

        setData(
          buildAnalyticsData([])
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadAnalytics();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    data,
    loading,
  };
}