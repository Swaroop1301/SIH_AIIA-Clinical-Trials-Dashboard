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

// ── Clinical Workflow Types (Vedika's modules) ──

export type ParticipantStatus = 'Screening' | 'Enrolled' | 'Active' | 'Completed' | 'Withdrawn' | 'Discontinued';
export type Gender = 'Male' | 'Female' | 'Other';

export interface Participant {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  contact: string;
  email: string;
  trialId: string;
  trialName: string;
  siteId: string;
  siteName: string;
  enrollmentDate: string;
  status: ParticipantStatus;
  notes: string;
}

export type VisitStatus = 'Scheduled' | 'Completed' | 'Missed' | 'Cancelled';
export type VisitType = 'Screening' | 'Baseline' | 'Follow-up' | 'End of Study' | 'Unscheduled';

export interface Visit {
  id: string;
  participantId: string;
  participantName: string;
  trialId: string;
  trialName: string;
  siteId: string;
  siteName: string;
  visitType: VisitType;
  scheduledDate: string;
  completedDate: string;
  status: VisitStatus;
  investigator: string;
  vitals: string;
  notes: string;
}

export type AESeverity = 'Mild' | 'Moderate' | 'Severe' | 'Life-Threatening';
export type AEStatus = 'Open' | 'Under Review' | 'Resolved' | 'Closed';
export type AECausality = 'Unrelated' | 'Unlikely' | 'Possible' | 'Probable' | 'Definite';
export type AEOutcome = 'Recovering' | 'Recovered' | 'Not Recovered' | 'Fatal' | 'Unknown';

export interface AdverseEvent {
  id: string;
  participantId: string;
  participantName: string;
  trialId: string;
  trialName: string;
  eventDescription: string;
  onsetDate: string;
  resolvedDate: string;
  severity: AESeverity;
  causality: AECausality;
  outcome: AEOutcome;
  status: AEStatus;
  reporter: string;
  notes: string;
  reportedDate: string;
}

// ── Existing exports ──

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
