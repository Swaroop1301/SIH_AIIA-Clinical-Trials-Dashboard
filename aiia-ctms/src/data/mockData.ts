export interface Trial {
  id: string;
  title: string;
  protocol: string;
  phase: string;
  status: 'Active' | 'Completed' | 'Suspended' | 'Planning' | 'Terminated';
  pi: string;
  sponsor: string;
  sites: number;
  participants: number;
  targetEnrollment: number;
  startDate: string;
  endDate: string;
  description: string;
  therapeuticArea: string;
}

export interface Site {
  id: string;
  name: string;
  location: string;
  city: string;
  state: string;
  pi: string;
  activeTrials: number;
  totalParticipants: number;
  enrollmentRate: number;
  complianceScore: number;
  status: 'Active' | 'Inactive' | 'Pending';
  phone: string;
  email: string;
}

export interface KPIData {
  label: string;
  value: number;
  trend: number;
  trendDirection: 'up' | 'down';
}

export interface ActivityItem {
  id: string;
  action: string;
  detail: string;
  timestamp: string;
  type: 'enrollment' | 'approval' | 'adverse' | 'document' | 'visit';
  user: string;
}

export interface DeadlineItem {
  id: string;
  title: string;
  dueDate: string;
  type: string;
  urgency: 'high' | 'medium' | 'low';
  trial: string;
}

export const kpiData: KPIData[] = [
  { label: 'Active Projects', value: 0, trend: 0, trendDirection: 'up' },
  { label: 'Participants', value: 0, trend: 0, trendDirection: 'up' },
  { label: 'Active Sites', value: 0, trend: 0, trendDirection: 'up' },
  { label: 'Pending Reviews', value: 0, trend: 0, trendDirection: 'down' },
];

export const trials: Trial[] = [];
export const sites: Site[] = [];
export const enrollmentData: Array<{month: string, enrolled: number, target: number}> = [];
export const sitePerformanceData: Array<{name: string, enrolled: number, target: number, compliance: number}> = [];
export const phaseDistributionData: Array<{name: string, value: number, color: string}> = [];
export const recentActivity: ActivityItem[] = [];
export const upcomingDeadlines: DeadlineItem[] = [];
