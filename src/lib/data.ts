// ── Pioneer Platform — General Job Marketplace Data ──────────────────────────

export const JOB_CATEGORIES = [
  { id: 'Development',       icon: '💻', color: '#2D7DD2', desc: 'Web, mobile, backend, APIs' },
  { id: 'Design',            icon: '🎨', color: '#EC4899', desc: 'UI/UX, branding, graphics'  },
  { id: 'Writing',           icon: '✍️', color: '#C8B882', desc: 'Content, copywriting, docs'  },
  { id: 'Marketing',         icon: '📣', color: '#F59E0B', desc: 'SEO, social, campaigns'     },
  { id: 'Data & AI',         icon: '🤖', color: '#8B5CF6', desc: 'ML, analytics, scraping'    },
  { id: 'Video & Audio',     icon: '🎬', color: '#E84C4C', desc: 'Editing, animation, podcast' },
  { id: 'Translation',       icon: '🌐', color: '#4CAF50', desc: 'Localization, interpretation'},
  { id: 'Business',          icon: '📊', color: '#06B6D4', desc: 'Consulting, finance, ops'   },
  { id: 'Engineering',       icon: '⚙️', color: '#F97316', desc: 'Mechanical, civil, embedded'  },
  { id: 'Education',         icon: '📚', color: '#A855F7', desc: 'Tutoring, course creation'   },
  { id: 'Legal',             icon: '⚖️', color: '#64748B', desc: 'Contracts, compliance, IP'   },
  { id: 'Healthcare',        icon: '🏥', color: '#10B981', desc: 'Medical, telehealth, research'},
];

export const SKILL_LEVEL_LABELS: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  expert: 'Expert',
};

export const JOB_TYPE_LABELS: Record<string, string> = {
  full_time: 'Full-time',
  part_time: 'Part-time',
  contract: 'Contract',
  freelance: 'Freelance',
  project: 'Project',
};

export const PAYMENT_TYPE_LABELS: Record<string, string> = {
  fixed: 'Fixed Price',
  hourly: 'Hourly Rate',
  milestone: 'Milestones',
};

export const JOB_STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  open:        { label: 'Open',        color: '#4CAF50',  bg: 'rgba(76,175,80,.14)'   },
  assigned:    { label: 'Awaiting escrow', color: '#F59E0B', bg: 'rgba(245,158,11,.14)' },
  in_progress: { label: 'In Progress', color: '#8B5CF6',  bg: 'rgba(139,92,246,.14)'  },
  completed:   { label: 'Completed',   color: '#2D7DD2',  bg: 'rgba(45,125,210,.14)'  },
  cancelled:   { label: 'Cancelled',   color: '#E84C4C',  bg: 'rgba(232,76,76,.14)'   },
  paused:      { label: 'Paused',      color: '#F59E0B',  bg: 'rgba(245,158,11,.14)'  },
};

export const APP_STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending:     { label: 'Pending',     color: '#F59E0B',  bg: 'rgba(245,158,11,.14)'  },
  shortlisted: { label: 'Shortlisted', color: '#06B6D4',  bg: 'rgba(6,182,212,.14)'   },
  accepted:    { label: 'Accepted',    color: '#4CAF50',  bg: 'rgba(76,175,80,.14)'   },
  rejected:    { label: 'Rejected',    color: '#E84C4C',  bg: 'rgba(232,76,76,.14)'   },
  withdrawn:   { label: 'Withdrawn',   color: '#8899AA',  bg: 'rgba(136,153,170,.14)' },
};

export const PAYMENT_STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending:   { label: 'Pending',   color: '#8899AA', bg: 'rgba(136,153,170,.14)' },
  in_escrow: { label: 'In Escrow', color: '#F59E0B', bg: 'rgba(245,158,11,.14)'  },
  released:  { label: 'Released',  color: '#4CAF50', bg: 'rgba(76,175,80,.14)'   },
  refunded:  { label: 'Refunded',  color: '#06B6D4', bg: 'rgba(6,182,212,.14)'   },
  disputed:  { label: 'Disputed',  color: '#E84C4C', bg: 'rgba(232,76,76,.14)'   },
};

export const STATS = [
  { value: '12K+', label: 'Jobs Posted',       icon: '💼' },
  { value: '8.4K', label: 'Active Pioneers',   icon: '👥' },
  { value: '98%',  label: 'Satisfaction Rate', icon: '⭐' },
  { value: '$2M+', label: 'Paid Out',          icon: '💰' },
];

export const TESTIMONIALS = [
  {
    name: 'Aisha Okonkwo',
    role: 'Founder, FinPath Lagos',
    text: 'Found a brilliant React developer in 48 hours. The milestone-based escrow gave us complete confidence — no payment until each sprint was approved.',
    rating: 5,
    flag: '🇳🇬',
    category: 'Development',
  },
  {
    name: 'Chidi Eze',
    role: 'Senior Pioneer — Full Stack',
    text: 'I have completed 28 projects on this platform. The invite-only feature means clients who trust my work come back directly. Best freelance experience in Africa.',
    rating: 5,
    flag: '🇳🇬',
    category: 'Development',
  },
  {
    name: 'Dr. Amara Diallo',
    role: 'Research Lead, Health NGO',
    text: 'Posted a medical data analysis job and had 12 vetted data scientists apply within a day. The quality filter for verified Pioneers is exceptional.',
    rating: 5,
    flag: '🇸🇳',
    category: 'Data & AI',
  },
  {
    name: 'Zhang Wei',
    role: 'Operations Director, Sino-Africa Logistics',
    text: 'Used the platform to hire a business consultant and a UI designer simultaneously. Milestone payments kept both projects on track perfectly.',
    rating: 5,
    flag: '🇨🇳',
    category: 'Business',
  },
];

export const HOW_IT_WORKS = [
  { step: '01', title: 'Post Your Job',       desc: 'Describe the work, set your budget, choose payment type (fixed, hourly, or milestone), and go live in minutes.',         icon: '📋', color: 'var(--accent)'  },
  { step: '02', title: 'Review Pioneers',     desc: 'Pioneers apply with cover letters and rates. Shortlist, message, or invite specific verified Pioneers directly.',         icon: '🔍', color: 'var(--sand)'   },
  { step: '03', title: 'Work & Pay Securely', desc: 'Payment goes into escrow. Release funds milestone-by-milestone or on final delivery — full control, zero risk.',          icon: '🔒', color: 'var(--green)'  },
];

export const FEATURED_SKILLS = [
  'React', 'Node.js', 'Python', 'UI/UX Design', 'SEO', 'Copywriting',
  'Data Analysis', 'Machine Learning', 'Video Editing', 'Mobile Dev',
  'DevOps', 'Figma', 'WordPress', 'Shopify', 'AWS', 'TypeScript',
  'Blockchain', 'Cybersecurity', 'Legal Writing', 'Financial Modeling',
  'Translation', 'Consulting', 'Photography', 'Animation',
];
