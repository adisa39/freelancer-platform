// ── Linker Marketplace Types ──────────────────────────────────────────────────

export type UserRole = 'freelancer' | 'client' | 'admin';
export type SkillLevel = 'beginner' | 'intermediate' | 'expert';
export type JobType = 'full_time' | 'part_time' | 'contract' | 'freelance' | 'project';
export type JobStatus = 'open' | 'in_progress' | 'completed' | 'cancelled' | 'paused';
export type PaymentType = 'fixed' | 'hourly' | 'milestone';
export type PaymentStatus = 'pending' | 'in_escrow' | 'released' | 'refunded' | 'disputed';
export type ApplicationStatus = 'pending' | 'shortlisted' | 'accepted' | 'rejected' | 'withdrawn';
export type MilestoneStatus = 'pending' | 'in_progress' | 'submitted' | 'approved' | 'revision_requested';

export interface User {
  _id: string;
  name: string;
  email?: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  skills: string[];
  skillLevel?: SkillLevel;
  portfolio?: string;
  hourlyRate?: number;
  location?: string;
  isVerified: boolean;
  isActive: boolean;
  rating: number;
  totalReviews: number;
  completedJobs: number;
  createdAt: string;
}

export interface Milestone {
  _id?: string;
  title: string;
  description: string;
  amount: number;
  dueDate?: string;
  status: MilestoneStatus;
}

export interface Job {
  _id: string;
  title: string;
  description: string;
  postedBy: User | string;
  assignedTo?: User | string;
  category: string;
  tags: string[];
  requiredSkills: string[];
  requiredSkillLevel?: SkillLevel;
  jobType: JobType;
  status: JobStatus;
  paymentType: PaymentType;
  budget: { min: number; max: number; currency: string };
  paymentConditions: string;
  milestones: Milestone[];
  deadline?: string;
  applicationsCount: number;
  isInviteOnly: boolean;
  invitedLinkers: string[];
  createdAt: string;
}

export interface Application {
  _id: string;
  job: Job | string;
  applicant: User | string;
  coverLetter: string;
  proposedRate: number;
  estimatedDuration: string;
  status: ApplicationStatus;
  appliedAt: string;
}

export interface Payment {
  _id: string;
  job: Job | string;
  payer: User | string;
  payee: User | string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  reference: string;
  notes?: string;
  releasedAt?: string;
  createdAt: string;
}

export interface Review {
  _id: string;
  job: Job | string;
  reviewer: User | string;
  reviewee: User | string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface DashboardStats {
  postedJobs: { total: number; active: number; completed: number };
  workHistory: { applied: number; completed: number };
  reputation: { rating: number; reviews: number };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown[];
  pagination?: { page: number; limit: number; total: number; pages: number };
}
