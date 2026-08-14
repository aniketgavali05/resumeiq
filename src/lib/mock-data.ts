import type {
  Resume, Job, Application, SkillGap, RoadmapItem,
  CoverLetter, InterviewQuestion, Testimonial, PricingPlan,
  Notification, AnalyticsData,
} from '@/types';

export const mockResumes: Resume[] = [
  { id: '1', name: 'Software Engineer Resume', role: 'Senior Software Engineer', fileName: 'resume_v4.pdf', status: 'analyzed', atsScore: 92, skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'AWS'], isFavorite: true, uploadedAt: '2024-01-15' },
  { id: '2', name: 'Frontend Resume', role: 'Frontend Engineer', fileName: 'frontend_resume.pdf', status: 'analyzed', atsScore: 87, skills: ['React', 'Vue', 'CSS', 'Figma'], isFavorite: false, uploadedAt: '2024-01-10' },
  { id: '3', name: 'Full Stack Resume', role: 'Full Stack Developer', fileName: 'fullstack_v2.pdf', status: 'draft', atsScore: 0, skills: ['Python', 'Django', 'PostgreSQL'], isFavorite: false, uploadedAt: '2024-01-08' },
  { id: '4', name: 'DevOps Resume', role: 'DevOps Engineer', fileName: 'devops_resume.pdf', status: 'analyzed', atsScore: 78, skills: ['Docker', 'Kubernetes', 'Terraform', 'AWS'], isFavorite: false, uploadedAt: '2024-01-05' },
  { id: '5', name: 'Data Engineer Resume', role: 'Data Engineer', fileName: 'data_eng.pdf', status: 'processing', atsScore: 0, skills: ['Spark', 'Airflow', 'Python'], isFavorite: false, uploadedAt: '2024-01-20' },
  { id: '6', name: 'ML Engineer Resume', role: 'ML Engineer', fileName: 'ml_resume.pdf', status: 'analyzed', atsScore: 85, skills: ['PyTorch', 'TensorFlow', 'Python', 'MLOps'], isFavorite: true, uploadedAt: '2024-01-18' },
];

export const mockJobs: Job[] = [
  { id: '1', title: 'Senior Software Engineer', company: 'Stripe', location: 'Remote', salary: '$180k-$220k', matchScore: 95, postedAt: '2024-01-20', tags: ['React', 'TypeScript', 'Node.js'], description: 'Build the next generation of payment infrastructure.', url: '#' },
  { id: '2', title: 'Frontend Engineer', company: 'Vercel', location: 'San Francisco, CA', salary: '$160k-$200k', matchScore: 91, postedAt: '2024-01-19', tags: ['React', 'Next.js', 'Tailwind'], description: 'Shape the future of web development tools.', url: '#' },
  { id: '3', title: 'Full Stack Developer', company: 'Linear', location: 'Remote', salary: '$140k-$180k', matchScore: 88, postedAt: '2024-01-18', tags: ['React', 'Node.js', 'PostgreSQL'], description: 'Build the issue tracking tool developers love.', url: '#' },
  { id: '4', title: 'DevOps Engineer', company: 'Cloudflare', location: 'Remote', salary: '$150k-$190k', matchScore: 82, postedAt: '2024-01-17', tags: ['Kubernetes', 'Terraform', 'AWS'], description: 'Help build a faster, more secure internet.', url: '#' },
  { id: '5', title: 'Data Engineer', company: 'Snowflake', location: 'San Mateo, CA', salary: '$170k-$210k', matchScore: 79, postedAt: '2024-01-16', tags: ['Spark', 'Airflow', 'Python'], description: 'Power the data cloud for thousands of companies.', url: '#' },
  { id: '6', title: 'ML Engineer', company: 'OpenAI', location: 'San Francisco, CA', salary: '$200k-$280k', matchScore: 86, postedAt: '2024-01-15', tags: ['PyTorch', 'TensorFlow', 'MLOps'], description: 'Build safe and beneficial AGI.', url: '#' },
  { id: '7', title: 'Backend Engineer', company: 'Supabase', location: 'Remote', salary: '$130k-$170k', matchScore: 84, postedAt: '2024-01-14', tags: ['PostgreSQL', 'Go', 'TypeScript'], description: 'The open source Firebase alternative.', url: '#' },
  { id: '8', title: 'Product Engineer', company: 'Notion', location: 'San Francisco, CA', salary: '$160k-$200k', matchScore: 77, postedAt: '2024-01-13', tags: ['React', 'TypeScript', 'Rust'], description: 'Connect your notes, docs, and tasks in one place.', url: '#' },
];

export const mockApplications: Application[] = [
  { id: '1', position: 'Senior Software Engineer', company: 'Stripe', status: 'interview', matchScore: 95, appliedAt: '2024-01-20', nextStep: 'Technical interview', nextStepDate: '2024-01-28' },
  { id: '2', position: 'Frontend Engineer', company: 'Vercel', status: 'applied', matchScore: 91, appliedAt: '2024-01-19', nextStep: 'Awaiting response', nextStepDate: '' },
  { id: '3', position: 'Full Stack Developer', company: 'Linear', status: 'interview', matchScore: 88, appliedAt: '2024-01-18', nextStep: 'Culture fit call', nextStepDate: '2024-01-30' },
  { id: '4', position: 'DevOps Engineer', company: 'Cloudflare', status: 'offer', matchScore: 82, appliedAt: '2024-01-17', nextStep: 'Offer expires in 5 days', nextStepDate: '2024-02-01' },
  { id: '5', position: 'Data Engineer', company: 'Snowflake', status: 'rejected', matchScore: 79, appliedAt: '2024-01-16', nextStep: '', nextStepDate: '' },
  { id: '6', position: 'ML Engineer', company: 'OpenAI', status: 'applied', matchScore: 86, appliedAt: '2024-01-15', nextStep: 'Awaiting response', nextStepDate: '' },
  { id: '7', position: 'Backend Engineer', company: 'Supabase', status: 'interview', matchScore: 84, appliedAt: '2024-01-14', nextStep: 'Take-home project', nextStepDate: '2024-02-03' },
  { id: '8', position: 'Product Engineer', company: 'Notion', status: 'withdrawn', matchScore: 77, appliedAt: '2024-01-13', nextStep: '', nextStepDate: '' },
];

export const mockSkillGaps: SkillGap[] = [
  { skill: 'TypeScript', currentLevel: 70, requiredLevel: 90, category: 'Languages' },
  { skill: 'Kubernetes', currentLevel: 40, requiredLevel: 80, category: 'DevOps' },
  { skill: 'System Design', currentLevel: 60, requiredLevel: 85, category: 'Architecture' },
  { skill: 'GraphQL', currentLevel: 50, requiredLevel: 75, category: 'APIs' },
  { skill: 'AWS', currentLevel: 55, requiredLevel: 80, category: 'Cloud' },
  { skill: 'Python', currentLevel: 75, requiredLevel: 70, category: 'Languages' },
  { skill: 'React', currentLevel: 85, requiredLevel: 85, category: 'Frontend' },
  { skill: 'PostgreSQL', currentLevel: 65, requiredLevel: 75, category: 'Databases' },
];

export const mockRoadmap: RoadmapItem[] = [
  { id: '1', title: 'Master TypeScript Advanced Types', description: 'Learn conditional types, mapped types, and generics.', status: 'completed', week: 1, category: 'Languages' },
  { id: '2', title: 'Kubernetes Fundamentals', description: 'Complete the K8s certification course.', status: 'in-progress', week: 2, category: 'DevOps' },
  { id: '3', title: 'System Design Interview Prep', description: 'Study distributed systems and scalability patterns.', status: 'in-progress', week: 3, category: 'Architecture' },
  { id: '4', title: 'GraphQL API Design', description: 'Build a production GraphQL API from scratch.', status: 'pending', week: 4, category: 'APIs' },
  { id: '5', title: 'AWS Solutions Architect', description: 'Get AWS SAA certified.', status: 'pending', week: 5, category: 'Cloud' },
  { id: '6', title: 'Open Source Contributions', description: 'Contribute to 3 major open source projects.', status: 'pending', week: 6, category: 'Experience' },
];

export const mockCoverLetters: CoverLetter[] = [
  { id: '1', jobTitle: 'Senior Software Engineer', company: 'Stripe', tone: 'Professional', content: 'I am excited to apply for the Senior Software Engineer position at Stripe...', createdAt: '2024-01-20' },
  { id: '2', jobTitle: 'Frontend Engineer', company: 'Vercel', tone: 'Enthusiastic', content: 'I have been following Vercel since the early days of Next.js...', createdAt: '2024-01-19' },
  { id: '3', jobTitle: 'Full Stack Developer', company: 'Linear', tone: 'Concise', content: 'Linear has redefined what a productivity tool should feel like...', createdAt: '2024-01-18' },
];

export const mockInterviewQuestions: InterviewQuestion[] = [
  { id: '1', question: 'Tell me about a time you handled a difficult technical challenge.', category: 'Behavioral', difficulty: 'medium', suggestedAnswer: 'Use the STAR method: describe the Situation, Task, Action, and Result.' },
  { id: '2', question: 'Design a URL shortener like bit.ly.', category: 'System Design', difficulty: 'hard', suggestedAnswer: 'Consider scaling, caching, and database sharding strategies.' },
  { id: '3', question: 'What is the difference between let, const, and var in JavaScript?', category: 'Technical', difficulty: 'easy', suggestedAnswer: 'var is function-scoped, let and const are block-scoped, const cannot be reassigned.' },
  { id: '4', question: 'How would you optimize a slow database query?', category: 'Technical', difficulty: 'medium', suggestedAnswer: 'Check indexes, analyze query plans, consider denormalization.' },
  { id: '5', question: 'Describe your experience with microservices.', category: 'Behavioral', difficulty: 'medium', suggestedAnswer: 'Discuss trade-offs, service boundaries, and communication patterns.' },
  { id: '6', question: 'Implement a rate limiter.', category: 'Coding', difficulty: 'hard', suggestedAnswer: 'Use a sliding window or token bucket algorithm with Redis.' },
];

export const mockTestimonials: Testimonial[] = [
  { name: 'Sarah Chen', role: 'Senior Engineer', company: 'Google', content: 'ResumeIQ helped me land 3 offers in 2 weeks. The ATS scoring was a game changer.', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150' },
  { name: 'Marcus Johnson', role: 'Product Manager', company: 'Figma', content: 'The job matching is scary good. It found roles I did not know existed.', avatar: 'https://images.pexels.com/photos/220457/pexels-photo-220457.jpeg?auto=compress&cs=tinysrgb&w=150' },
  { name: 'Priya Patel', role: 'Data Scientist', company: 'Netflix', content: 'From resume to offer in 18 days. The roadmap feature kept me on track.', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150' },
];

export const mockPricingPlans: PricingPlan[] = [
  { name: 'Free', price: 0, period: 'forever', description: 'Perfect for getting started', features: ['1 resume analysis', '5 job matches/week', 'Basic ATS scoring', 'Community support'], highlight: false, cta: 'Get started' },
  { name: 'Pro', price: 19, period: 'month', description: 'For serious job seekers', features: ['Unlimited resume analyses', 'Unlimited job matches', 'Advanced ATS scoring', 'Cover letter generator', 'Interview prep', 'Priority support'], highlight: true, cta: 'Start free trial' },
  { name: 'Teams', price: 49, period: 'month', description: 'For bootcamps and cohorts', features: ['Everything in Pro', 'Up to 10 seats', 'Team analytics', 'Shared roadmaps', 'Custom branding', 'Dedicated manager'], highlight: false, cta: 'Contact sales' },
];

export const mockNotifications: Notification[] = [
  { id: '1', title: 'New job match', description: 'A 95% match for Senior Software Engineer at Stripe was found.', type: 'success', read: false, createdAt: '2024-01-20' },
  { id: '2', title: 'Interview scheduled', description: 'Your technical interview with Linear is on Jan 30.', type: 'info', read: false, createdAt: '2024-01-19' },
  { id: '3', title: 'Resume analysis complete', description: 'Your Software Engineer Resume scored 92/100 on ATS.', type: 'success', read: true, createdAt: '2024-01-18' },
  { id: '4', title: 'Offer expiring soon', description: 'Your Cloudflare offer expires in 5 days.', type: 'warning', read: false, createdAt: '2024-01-17' },
  { id: '5', title: 'Application rejected', description: 'Snowflake has moved forward with other candidates.', type: 'error', read: true, createdAt: '2024-01-16' },
];

export const mockAnalyticsData: AnalyticsData = {
  applicationsOverTime: [
    { date: 'Week 1', count: 2 },
    { date: 'Week 2', count: 5 },
    { date: 'Week 3', count: 3 },
    { date: 'Week 4', count: 8 },
    { date: 'Week 5', count: 6 },
    { date: 'Week 6', count: 10 },
  ],
  statusBreakdown: [
    { status: 'Applied', count: 3, fill: 'hsl(var(--chart-1))' },
    { status: 'Interview', count: 3, fill: 'hsl(var(--chart-3))' },
    { status: 'Offer', count: 1, fill: 'hsl(var(--chart-2))' },
    { status: 'Rejected', count: 1, fill: 'hsl(var(--destructive))' },
  ],
  responseRate: 62,
  avgResponseTime: 4.5,
  topCompanies: [
    { company: 'Stripe', applications: 2 },
    { company: 'Vercel', applications: 1 },
    { company: 'Linear', applications: 1 },
    { company: 'Cloudflare', applications: 1 },
    { company: 'OpenAI', applications: 1 },
  ],
};
