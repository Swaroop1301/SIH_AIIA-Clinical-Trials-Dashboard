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

// ── Compliance & Governance Types (Meet's modules) ──

export type EthicsSubmissionStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Approved'
  | 'Conditional Approval'
  | 'Revision Required'
  | 'Rejected';

export type EthicsSubmissionType =
  | 'Initial Protocol'
  | 'Protocol Amendment'
  | 'Annual Continuing Review'
  | 'Safety Notification'
  | 'Study Completion';

export type EthicsReviewType = 'Full Board Review' | 'Expedited Review' | 'Exemption';

export type EthicsRiskLevel = 'Minimal Risk' | 'Low Risk' | 'High Risk / Interventional';

export interface EthicsSubmission {
  id: string;
  trialId: string;
  trialTitle: string;
  protocolNumber: string;
  committeeName: string;
  committeeCode: string;
  submissionType: EthicsSubmissionType;
  reviewType: EthicsReviewType;
  riskLevel: EthicsRiskLevel;
  piName: string;
  submissionDate: string;
  meetingDate?: string;
  status: EthicsSubmissionStatus;
  approvalLetterRef?: string;
  approvalDate?: string;
  validUntil?: string;
  committeeComments?: string;
  documentsAttached: string[];
}

export interface RegulatoryTracker {
  id: string;
  trialId: string;
  trialTitle: string;
  ctriNumber: string;
  ctriStatus: 'Registered' | 'Under Query' | 'Submitted' | 'Exempt';
  registrationDate: string;
  publicTitle: string;
  scientificTitle: string;
  cdscoPermissionNumber: string;
  cdscoFormCT06Date: string;
  cdscoFormCT23Status: 'Approved' | 'Not Applicable' | 'Pending';
  ndctRules2019Compliant: boolean;
  checklist: {
    sae24hReporting: boolean;
    cdscoRegisteredEC: boolean;
    compensationClause: boolean;
    ayushGCP: boolean;
    prospectiveRegistration: boolean;
  };
  lastInspectionDate?: string;
}

export type DocumentCategory =
  | 'Protocol'
  | 'Investigator Brochure'
  | 'Informed Consent Form (ICF)'
  | 'Ethics Approval'
  | 'Regulatory Clearance / CTRI'
  | 'Case Report Form (CRF)'
  | 'Lab Certification';

export interface DocumentVersion {
  version: string;
  uploadedBy: string;
  uploadedAt: string;
  changeSummary: string;
  fileSize: string;
  fileName: string;
  fileHash: string;
  status: 'Approved' | 'Superseded' | 'Under Review' | 'Draft';
}

export interface DocumentItem {
  id: string;
  title: string;
  category: DocumentCategory;
  trialId: string;
  trialTitle: string;
  siteId?: string;
  currentVersion: string;
  status: 'Approved' | 'Under Review' | 'Draft' | 'Archived';
  author: string;
  effectiveDate: string;
  versionHistory: DocumentVersion[];
}

export type AuditActionType =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'STATUS_CHANGE'
  | 'VERSION_BUMP'
  | 'ETHICS_SUBMISSION'
  | 'ETHICS_DECISION'
  | 'EXPORT_DATA'
  | 'VERIFY';

export type AuditModule =
  | 'Ethics'
  | 'Documents'
  | 'Trials'
  | 'Sites'
  | 'Participants'
  | 'Visits'
  | 'Adverse Events'
  | 'Interoperability';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: AuditActionType;
  module: AuditModule;
  targetId: string;
  targetName: string;
  details: string;
  hash: string;
  ipAddress: string;
}

// ── Mock Datasets ──

export const kpiData: KPIData[] = [
  { label: 'Active Projects', value: 4, trend: 12, trendDirection: 'up' },
  { label: 'Enrolled Participants', value: 248, trend: 8, trendDirection: 'up' },
  { label: 'Active Sites', value: 6, trend: 0, trendDirection: 'up' },
  { label: 'Pending IEC Reviews', value: 2, trend: 50, trendDirection: 'down' },
];

export const trials: Trial[] = [
  {
    id: 'AIIA-CT-2024-001',
    title: 'Clinical Evaluation of Withania somnifera (Ashwagandha) in Mild-to-Moderate Generalized Anxiety and Stress Biomarkers',
    protocol: 'AIIA/CLIN/ASH/2024/01',
    phase: 'Phase II',
    status: 'Active',
    pi: 'Prof. (Dr.) Rajesh Kotecha',
    sponsor: 'All India Institute of Ayurveda (AIIA)',
    sites: 3,
    participants: 120,
    targetEnrollment: 150,
    startDate: '2024-01-15',
    endDate: '2025-06-30',
    description: 'Double-blind, randomized, placebo-controlled study evaluating standardized Ashwagandha root extract on salivary cortisol and HAM-A score.',
    therapeuticArea: 'Manasa Roga (Neuropsychiatry)',
  },
  {
    id: 'AIIA-CT-2024-002',
    title: 'Safety and Immunomodulatory Efficacy of Tinospora cordifolia (Guduchi Ghana Vati) in Post-Viral Fatigue Syndrome',
    protocol: 'AIIA/CLIN/GUD/2024/02',
    phase: 'Phase III',
    status: 'Active',
    pi: 'Dr. Anand Ramanathan',
    sponsor: 'Ministry of Ayush, Govt of India',
    sites: 4,
    participants: 96,
    targetEnrollment: 120,
    startDate: '2024-03-01',
    endDate: '2025-08-15',
    description: 'Multi-center clinical trial investigating CD4/CD8 cell count modulation and Fatigue Severity Scale reduction.',
    therapeuticArea: 'Rasayana & Immunology',
  },
  {
    id: 'AIIA-CT-2024-003',
    title: 'Standardized Triphala Churna in Metabolic Syndrome and Gut Microbiome Diversity: A Randomized Clinical Study',
    protocol: 'AIIA/CLIN/TRIPH/2024/03',
    phase: 'Phase II',
    status: 'Active',
    pi: 'Dr. Meenakshi Sharma',
    sponsor: 'AIIA Clinical Research Board',
    sites: 2,
    participants: 32,
    targetEnrollment: 80,
    startDate: '2024-04-10',
    endDate: '2025-10-31',
    description: 'Assessment of fasting blood glucose, lipid profile, and 16S rRNA gut metagenomics in MetSyn participants.',
    therapeuticArea: 'Metabolic Disorders (Prameha)',
  },
  {
    id: 'AIIA-CT-2024-004',
    title: 'Curcuma longa (Haridra Extract) in Knee Osteoarthritis (Sandhivata): Comparative Non-Inferiority Trial',
    protocol: 'AIIA/CLIN/HAR/2024/04',
    phase: 'Phase III',
    status: 'Planning',
    pi: 'Dr. Suresh Kumar Patwardhan',
    sponsor: 'AIIA & CCRAS',
    sites: 2,
    participants: 0,
    targetEnrollment: 200,
    startDate: '2024-09-01',
    endDate: '2026-03-31',
    description: 'WOMAC index and inflammatory cytokines (IL-6, TNF-alpha) comparison against standard NSAID comparator.',
    therapeuticArea: 'Musculoskeletal (Sandhigata Vata)',
  },
];

export const sites: Site[] = [
  {
    id: 'SITE-01',
    name: 'All India Institute of Ayurveda Main Hospital',
    location: 'Sarita Vihar',
    city: 'New Delhi',
    state: 'Delhi',
    pi: 'Dr. Rajesh Kotecha',
    activeTrials: 3,
    totalParticipants: 140,
    enrollmentRate: 92,
    complianceScore: 98,
    status: 'Active',
    phone: '+91 11 2994 8401',
    email: 'clinicaltrials@aiia.gov.in',
  },
  {
    id: 'SITE-02',
    name: 'AIIA Goa Satellite Clinical Research Center',
    location: 'Dhargal, Pernem',
    city: 'North Goa',
    state: 'Goa',
    pi: 'Dr. Anand Ramanathan',
    activeTrials: 2,
    totalParticipants: 68,
    enrollmentRate: 88,
    complianceScore: 95,
    status: 'Active',
    phone: '+91 832 291 0012',
    email: 'goa.trials@aiia.gov.in',
  },
  {
    id: 'SITE-03',
    name: 'National Institute of Ayurveda (NIA) Partner Site',
    location: 'Jorawar Singh Gate',
    city: 'Jaipur',
    state: 'Rajasthan',
    pi: 'Dr. Meenakshi Sharma',
    activeTrials: 1,
    totalParticipants: 40,
    enrollmentRate: 85,
    complianceScore: 96,
    status: 'Active',
    phone: '+91 141 263 5816',
    email: 'trials@nia.edu.in',
  },
];

export const enrollmentData = [
  { month: 'Jan', enrolled: 18, target: 20 },
  { month: 'Feb', enrolled: 35, target: 40 },
  { month: 'Mar', enrolled: 65, target: 70 },
  { month: 'Apr', enrolled: 110, target: 115 },
  { month: 'May', enrolled: 165, target: 170 },
  { month: 'Jun', enrolled: 215, target: 220 },
  { month: 'Jul', enrolled: 248, target: 260 },
];

export const sitePerformanceData = [
  { name: 'AIIA New Delhi', enrolled: 140, target: 150, compliance: 98 },
  { name: 'AIIA Goa Center', enrolled: 68, target: 80, compliance: 95 },
  { name: 'NIA Jaipur', enrolled: 40, target: 50, compliance: 96 },
];

export const phaseDistributionData = [
  { name: 'Phase I', value: 0, color: '#0d9488' },
  { name: 'Phase II', value: 2, color: '#1e3a8a' },
  { name: 'Phase III', value: 2, color: '#b91c1c' },
  { name: 'Phase IV', value: 0, color: '#d97706' },
];

export const recentActivity: ActivityItem[] = [
  {
    id: 'ACT-01',
    action: 'IEC Protocol Approval',
    detail: 'Institutional Ethics Committee approved Amendment 02 for Ashwagandha Study',
    timestamp: '2 hours ago',
    type: 'approval',
    user: 'Meet Patil (Compliance Officer)',
  },
  {
    id: 'ACT-02',
    action: 'Document Version Bump',
    detail: 'Informed Consent Form (ICF) bumped to v1.2 with updated patient rights clause',
    timestamp: '4 hours ago',
    type: 'document',
    user: 'Dr. Anand Ramanathan',
  },
  {
    id: 'ACT-03',
    action: 'CTRI Verification',
    detail: 'CTRI/2024/03/064218 verified compliant under NDCT Rules 2019',
    timestamp: '1 day ago',
    type: 'approval',
    user: 'Meet Patil (Compliance Officer)',
  },
  {
    id: 'ACT-04',
    action: 'Participant Enrolled',
    detail: 'Subject PRT-0042 enrolled in Guduchi Immune Trial at AIIA Goa',
    timestamp: '1 day ago',
    type: 'enrollment',
    user: 'Vedika Sakharkar',
  },
];

export const upcomingDeadlines: DeadlineItem[] = [
  {
    id: 'DL-01',
    title: 'IEC Annual Continuing Review Submission',
    dueDate: '2024-10-15',
    type: 'Ethics Compliance',
    urgency: 'high',
    trial: 'AIIA-CT-2024-001',
  },
  {
    id: 'DL-02',
    title: 'CDSCO Form CT-06 Quarterly Safety Progress',
    dueDate: '2024-11-01',
    type: 'Regulatory',
    urgency: 'medium',
    trial: 'AIIA-CT-2024-002',
  },
  {
    id: 'DL-03',
    title: 'CTRI 6-Month Enrollment Status Update',
    dueDate: '2024-11-20',
    type: 'Registry',
    urgency: 'low',
    trial: 'AIIA-CT-2024-003',
  },
];

// Initial Ethics Submissions
export const initialEthicsSubmissions: EthicsSubmission[] = [
  {
    id: 'ETH-2024-001',
    trialId: 'AIIA-CT-2024-001',
    trialTitle: 'Withania somnifera (Ashwagandha) in Anxiety & Stress Biomarkers',
    protocolNumber: 'AIIA/CLIN/ASH/2024/01',
    committeeName: 'AIIA Institutional Ethics Committee (IEC-Ayush)',
    committeeCode: 'EC/NEW/INST/2023/1482',
    submissionType: 'Initial Protocol',
    reviewType: 'Full Board Review',
    riskLevel: 'Low Risk',
    piName: 'Prof. (Dr.) Rajesh Kotecha',
    submissionDate: '2023-11-10',
    meetingDate: '2023-11-28',
    status: 'Approved',
    approvalLetterRef: 'AIIA/IEC/2023/APP/089',
    approvalDate: '2023-12-05',
    validUntil: '2024-12-04',
    committeeComments: 'Approved unanimously. Standard GCP monitoring and bi-annual safety reports required.',
    documentsAttached: ['Protocol_v1.0.pdf', 'ICF_Hindi_English_v1.0.pdf', 'IB_Ashwagandha_v1.0.pdf'],
  },
  {
    id: 'ETH-2024-002',
    trialId: 'AIIA-CT-2024-001',
    trialTitle: 'Withania somnifera (Ashwagandha) in Anxiety & Stress Biomarkers',
    protocolNumber: 'AIIA/CLIN/ASH/2024/01-A1',
    committeeName: 'AIIA Institutional Ethics Committee (IEC-Ayush)',
    committeeCode: 'EC/NEW/INST/2023/1482',
    submissionType: 'Protocol Amendment',
    reviewType: 'Expedited Review',
    riskLevel: 'Minimal Risk',
    piName: 'Prof. (Dr.) Rajesh Kotecha',
    submissionDate: '2024-04-12',
    meetingDate: '2024-04-20',
    status: 'Approved',
    approvalLetterRef: 'AIIA/IEC/2024/AMD/014',
    approvalDate: '2024-04-25',
    validUntil: '2024-12-04',
    committeeComments: 'Amendment to sample collection intervals approved. No increase in participant burden.',
    documentsAttached: ['Protocol_v1.1_Amended.pdf', 'Summary_of_Changes.pdf'],
  },
  {
    id: 'ETH-2024-003',
    trialId: 'AIIA-CT-2024-002',
    trialTitle: 'Tinospora cordifolia (Guduchi) in Post-Viral Fatigue Syndrome',
    protocolNumber: 'AIIA/CLIN/GUD/2024/02',
    committeeName: 'AIIA Institutional Ethics Committee (IEC-Ayush)',
    committeeCode: 'EC/NEW/INST/2023/1482',
    submissionType: 'Initial Protocol',
    reviewType: 'Full Board Review',
    riskLevel: 'Low Risk',
    piName: 'Dr. Anand Ramanathan',
    submissionDate: '2024-01-08',
    meetingDate: '2024-01-24',
    status: 'Approved',
    approvalLetterRef: 'AIIA/IEC/2024/APP/019',
    approvalDate: '2024-02-02',
    validUntil: '2025-02-01',
    committeeComments: 'Approved. Blood draw volumes for flow cytometry verified within ethical limits.',
    documentsAttached: ['Protocol_Guduchi_v1.0.pdf', 'ICF_v1.0.pdf'],
  },
  {
    id: 'ETH-2024-004',
    trialId: 'AIIA-CT-2024-003',
    trialTitle: 'Standardized Triphala Churna in Metabolic Syndrome & Gut Microbiome',
    protocolNumber: 'AIIA/CLIN/TRIPH/2024/03',
    committeeName: 'Joint Ethics Review Board (AIIA - NIA)',
    committeeCode: 'EC/NEW/INST/2023/1510',
    submissionType: 'Initial Protocol',
    reviewType: 'Full Board Review',
    riskLevel: 'Low Risk',
    piName: 'Dr. Meenakshi Sharma',
    submissionDate: '2024-02-18',
    meetingDate: '2024-03-05',
    status: 'Approved',
    approvalLetterRef: 'JERB/AIIA/2024/APP/031',
    approvalDate: '2024-03-12',
    validUntil: '2025-03-11',
    committeeComments: 'Stool metagenomics data anonymization protocol reviewed and cleared.',
    documentsAttached: ['Triphala_Protocol_v1.0.pdf', 'Subject_Information_Sheet.pdf'],
  },
  {
    id: 'ETH-2024-005',
    trialId: 'AIIA-CT-2024-004',
    trialTitle: 'Curcuma longa (Haridra Extract) in Knee Osteoarthritis',
    protocolNumber: 'AIIA/CLIN/HAR/2024/04',
    committeeName: 'AIIA Institutional Ethics Committee (IEC-Ayush)',
    committeeCode: 'EC/NEW/INST/2023/1482',
    submissionType: 'Initial Protocol',
    reviewType: 'Full Board Review',
    riskLevel: 'High Risk / Interventional',
    piName: 'Dr. Suresh Kumar Patwardhan',
    submissionDate: '2024-07-22',
    meetingDate: '2024-08-14',
    status: 'Under Review',
    committeeComments: 'Under initial review. Reviewing comparator analgesic rescue protocol.',
    documentsAttached: ['Haridra_Protocol_Draft.pdf', 'Investigator_Brochure_v0.9.pdf'],
  },
];

// Initial Regulatory Trackers
export const initialRegulatoryTrackers: RegulatoryTracker[] = [
  {
    id: 'REG-01',
    trialId: 'AIIA-CT-2024-001',
    trialTitle: 'Withania somnifera (Ashwagandha) in Anxiety & Stress Biomarkers',
    ctriNumber: 'CTRI/2024/03/064218',
    ctriStatus: 'Registered',
    registrationDate: '2024-03-14',
    publicTitle: 'Clinical trial of Ashwagandha in mild to moderate anxiety disorder',
    scientificTitle: 'A randomized, double-blind, placebo-controlled study to evaluate Withania somnifera extract on salivary cortisol and HAM-A in Generalized Anxiety Disorder',
    cdscoPermissionNumber: 'CT-06-AYUSH/2024/042',
    cdscoFormCT06Date: '2024-01-20',
    cdscoFormCT23Status: 'Not Applicable',
    ndctRules2019Compliant: true,
    checklist: {
      sae24hReporting: true,
      cdscoRegisteredEC: true,
      compensationClause: true,
      ayushGCP: true,
      prospectiveRegistration: true,
    },
    lastInspectionDate: '2024-06-18',
  },
  {
    id: 'REG-02',
    trialId: 'AIIA-CT-2024-002',
    trialTitle: 'Tinospora cordifolia (Guduchi) in Post-Viral Fatigue Syndrome',
    ctriNumber: 'CTRI/2024/04/065890',
    ctriStatus: 'Registered',
    registrationDate: '2024-04-02',
    publicTitle: 'Evaluation of Guduchi Ghana Vati in post-viral fatigue syndrome recovery',
    scientificTitle: 'Multi-center randomized clinical investigation on immunomodulatory effects of Tinospora cordifolia in post-viral fatigue',
    cdscoPermissionNumber: 'CT-06-AYUSH/2024/058',
    cdscoFormCT06Date: '2024-02-15',
    cdscoFormCT23Status: 'Not Applicable',
    ndctRules2019Compliant: true,
    checklist: {
      sae24hReporting: true,
      cdscoRegisteredEC: true,
      compensationClause: true,
      ayushGCP: true,
      prospectiveRegistration: true,
    },
    lastInspectionDate: '2024-07-02',
  },
  {
    id: 'REG-03',
    trialId: 'AIIA-CT-2024-003',
    trialTitle: 'Standardized Triphala Churna in Metabolic Syndrome & Gut Microbiome',
    ctriNumber: 'CTRI/2024/05/067112',
    ctriStatus: 'Registered',
    registrationDate: '2024-05-18',
    publicTitle: 'Clinical trial on Triphala Churna efficacy in metabolic syndrome and gut flora',
    scientificTitle: 'Exploratory clinical study on gut microbiome modulation and glycemic control by Triphala in human subjects with Metabolic Syndrome',
    cdscoPermissionNumber: 'CT-06-AYUSH/2024/071',
    cdscoFormCT06Date: '2024-03-29',
    cdscoFormCT23Status: 'Not Applicable',
    ndctRules2019Compliant: true,
    checklist: {
      sae24hReporting: true,
      cdscoRegisteredEC: true,
      compensationClause: true,
      ayushGCP: true,
      prospectiveRegistration: true,
    },
  },
  {
    id: 'REG-04',
    trialId: 'AIIA-CT-2024-004',
    trialTitle: 'Curcuma longa (Haridra Extract) in Knee Osteoarthritis',
    ctriNumber: 'CTRI/APP/2024/08219',
    ctriStatus: 'Submitted',
    registrationDate: '2024-08-01',
    publicTitle: 'Curcumin extract compared with standard treatment for osteoarthritis',
    scientificTitle: 'Phase III non-inferiority clinical study of Curcuma longa standardized extract in Knee Osteoarthritis (Sandhigata Vata)',
    cdscoPermissionNumber: 'Pending CDSCO Form CT-06',
    cdscoFormCT06Date: '',
    cdscoFormCT23Status: 'Not Applicable',
    ndctRules2019Compliant: false,
    checklist: {
      sae24hReporting: true,
      cdscoRegisteredEC: true,
      compensationClause: true,
      ayushGCP: true,
      prospectiveRegistration: false,
    },
  },
];

// Initial Versioned Documents (Strict versioning: v1.0 -> v1.1 -> v1.2, never overwritten)
export const initialDocuments: DocumentItem[] = [
  {
    id: 'DOC-101',
    title: 'Clinical Study Protocol — Ashwagandha Anxiety Trial',
    category: 'Protocol',
    trialId: 'AIIA-CT-2024-001',
    trialTitle: 'Withania somnifera (Ashwagandha) in Anxiety & Stress Biomarkers',
    currentVersion: 'v1.1',
    status: 'Approved',
    author: 'Prof. (Dr.) Rajesh Kotecha',
    effectiveDate: '2024-04-25',
    versionHistory: [
      {
        version: 'v1.1',
        uploadedBy: 'Meet Patil (Compliance Officer)',
        uploadedAt: '2024-04-25 11:30',
        changeSummary: 'Amendment 01: Refined blood draw schedule from bi-weekly to monthly per IEC recommendation.',
        fileSize: '2.8 MB',
        fileName: 'Protocol_AIIA_ASH_v1.1.pdf',
        fileHash: '7f9a2b8e3d4c1a5b6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d',
        status: 'Approved',
      },
      {
        version: 'v1.0',
        uploadedBy: 'Prof. (Dr.) Rajesh Kotecha',
        uploadedAt: '2023-11-10 14:15',
        changeSummary: 'Initial baseline protocol version approved by AIIA IEC.',
        fileSize: '2.6 MB',
        fileName: 'Protocol_AIIA_ASH_v1.0.pdf',
        fileHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        status: 'Superseded',
      },
    ],
  },
  {
    id: 'DOC-102',
    title: 'Informed Consent Form & Subject Information Sheet (ICF/SIS)',
    category: 'Informed Consent Form (ICF)',
    trialId: 'AIIA-CT-2024-001',
    trialTitle: 'Withania somnifera (Ashwagandha) in Anxiety & Stress Biomarkers',
    currentVersion: 'v1.2',
    status: 'Approved',
    author: 'Vedika Sakharkar',
    effectiveDate: '2024-05-02',
    versionHistory: [
      {
        version: 'v1.2',
        uploadedBy: 'Meet Patil (Compliance Officer)',
        uploadedAt: '2024-05-02 09:40',
        changeSummary: 'Updated compensation contact details and vernacular Hindi translation verified by linguist.',
        fileSize: '1.4 MB',
        fileName: 'ICF_SIS_AIIA_ASH_v1.2.pdf',
        fileHash: '3a1c5d7e9f0b2a4c6e8d0f1a3b5c7e9f2a4b6c8d0e1f3a5b7c9d1e3f5a7b9c1d',
        status: 'Approved',
      },
      {
        version: 'v1.1',
        uploadedBy: 'Vedika Sakharkar',
        uploadedAt: '2024-02-14 16:20',
        changeSummary: 'Incorporated 24h SAE reporting helpline number.',
        fileSize: '1.3 MB',
        fileName: 'ICF_SIS_AIIA_ASH_v1.1.pdf',
        fileHash: '2f4b6a8c0d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b3c5d7e9f0a2b4c6e8d0f1a',
        status: 'Superseded',
      },
      {
        version: 'v1.0',
        uploadedBy: 'Vedika Sakharkar',
        uploadedAt: '2023-11-10 15:00',
        changeSummary: 'Initial bilingual consent template submitted to IEC.',
        fileSize: '1.2 MB',
        fileName: 'ICF_SIS_AIIA_ASH_v1.0.pdf',
        fileHash: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
        status: 'Superseded',
      },
    ],
  },
  {
    id: 'DOC-103',
    title: 'Investigator Brochure (IB) — Standardized Withania somnifera Extract',
    category: 'Investigator Brochure',
    trialId: 'AIIA-CT-2024-001',
    trialTitle: 'Withania somnifera (Ashwagandha) in Anxiety & Stress Biomarkers',
    currentVersion: 'v2.0',
    status: 'Approved',
    author: 'AIIA Department of Dravyaguna',
    effectiveDate: '2024-01-10',
    versionHistory: [
      {
        version: 'v2.0',
        uploadedBy: 'Meet Patil (Compliance Officer)',
        uploadedAt: '2024-01-10 10:15',
        changeSummary: 'Major Update: Added 6-month GLP-compliant repeat-dose subacute toxicity and withanolide profiling.',
        fileSize: '5.2 MB',
        fileName: 'IB_Ashwagandha_Standardized_v2.0.pdf',
        fileHash: '5e7f9a1b3c5d7e9f0a2b4c6e8d0f1a3b5c7e9f2a4b6c8d0e1f3a5b7c9d1e3f5a',
        status: 'Approved',
      },
      {
        version: 'v1.0',
        uploadedBy: 'Dr. Rajesh Kotecha',
        uploadedAt: '2023-08-20 11:00',
        changeSummary: 'Initial Investigator Brochure compile.',
        fileSize: '4.1 MB',
        fileName: 'IB_Ashwagandha_v1.0.pdf',
        fileHash: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
        status: 'Superseded',
      },
    ],
  },
  {
    id: 'DOC-104',
    title: 'CDSCO Form CT-06 Clinical Trial Permission Certificate',
    category: 'Regulatory Clearance / CTRI',
    trialId: 'AIIA-CT-2024-001',
    trialTitle: 'Withania somnifera (Ashwagandha) in Anxiety & Stress Biomarkers',
    currentVersion: 'v1.0',
    status: 'Approved',
    author: 'Central Drugs Standard Control Organisation (CDSCO)',
    effectiveDate: '2024-01-20',
    versionHistory: [
      {
        version: 'v1.0',
        uploadedBy: 'Meet Patil (Compliance Officer)',
        uploadedAt: '2024-01-22 17:30',
        changeSummary: 'Official stamped grant of Form CT-06 permission from DCGI / CDSCO.',
        fileSize: '850 KB',
        fileName: 'CDSCO_Form_CT06_Ashwagandha_v1.0.pdf',
        fileHash: 'b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3',
        status: 'Approved',
      },
    ],
  },
  {
    id: 'DOC-105',
    title: 'Institutional Ethics Committee Approval Letter',
    category: 'Ethics Approval',
    trialId: 'AIIA-CT-2024-002',
    trialTitle: 'Tinospora cordifolia (Guduchi) in Post-Viral Fatigue Syndrome',
    currentVersion: 'v1.0',
    status: 'Approved',
    author: 'AIIA IEC Secretariat',
    effectiveDate: '2024-02-02',
    versionHistory: [
      {
        version: 'v1.0',
        uploadedBy: 'Meet Patil (Compliance Officer)',
        uploadedAt: '2024-02-03 12:00',
        changeSummary: 'Signed and stamped clearance from Institutional Ethics Committee under NDCT Rules 2019.',
        fileSize: '620 KB',
        fileName: 'IEC_Approval_Letter_Guduchi_v1.0.pdf',
        fileHash: 'c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4',
        status: 'Approved',
      },
    ],
  },
  {
    id: 'DOC-106',
    title: 'Case Report Form (eCRF Module Specification)',
    category: 'Case Report Form (CRF)',
    trialId: 'AIIA-CT-2024-001',
    trialTitle: 'Withania somnifera (Ashwagandha) in Anxiety & Stress Biomarkers',
    currentVersion: 'v1.1',
    status: 'Approved',
    author: 'Vedika Sakharkar',
    effectiveDate: '2024-03-01',
    versionHistory: [
      {
        version: 'v1.1',
        uploadedBy: 'Vedika Sakharkar',
        uploadedAt: '2024-03-01 14:00',
        changeSummary: 'Added salivary cortisol collection time window and storage temp validation checks.',
        fileSize: '1.8 MB',
        fileName: 'eCRF_Specifications_Ashwagandha_v1.1.pdf',
        fileHash: 'd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5',
        status: 'Approved',
      },
      {
        version: 'v1.0',
        uploadedBy: 'Vedika Sakharkar',
        uploadedAt: '2023-12-15 11:30',
        changeSummary: 'Initial CRF template.',
        fileSize: '1.6 MB',
        fileName: 'eCRF_Specifications_Ashwagandha_v1.0.pdf',
        fileHash: 'e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6',
        status: 'Superseded',
      },
    ],
  },
];

// Initial Immutable Audit Logs (Read-only, 21 CFR Part 11 compliant)
export const initialAuditLogs: AuditLogEntry[] = [
  {
    id: 'AUD-2024-0098',
    timestamp: '2024-09-05 21:40:12',
    actor: 'Meet Patil',
    role: 'Compliance & Governance Lead',
    action: 'EXPORT_DATA',
    module: 'Interoperability',
    targetId: 'AIIA-CT-2024-001',
    targetName: 'Ashwagandha Trial',
    details: 'Generated and exported CDISC ODM XML package (DM, AE, VS, EX domains) for regulatory archival.',
    hash: 'a1b2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef1234567890',
    ipAddress: '192.168.1.104',
  },
  {
    id: 'AUD-2024-0097',
    timestamp: '2024-09-05 18:22:45',
    actor: 'Meet Patil',
    role: 'Compliance & Governance Lead',
    action: 'VERSION_BUMP',
    module: 'Documents',
    targetId: 'DOC-102',
    targetName: 'Informed Consent Form & SIS',
    details: 'Version bumped from v1.1 to v1.2. Changed compensation contact and verified Hindi translation. Marked v1.1 as Superseded.',
    hash: 'f0e1d2c3b4a5968778695a4b3c2d1e0ff0e1d2c3b4a5968778695a4b3c2d1e0f',
    ipAddress: '192.168.1.104',
  },
  {
    id: 'AUD-2024-0096',
    timestamp: '2024-09-04 15:10:04',
    actor: 'Dr. Anand Ramanathan',
    role: 'Principal Investigator',
    action: 'ETHICS_DECISION',
    module: 'Ethics',
    targetId: 'ETH-2024-002',
    targetName: 'AIIA/CLIN/ASH/2024/01-A1',
    details: 'Recorded Institutional Ethics Committee approval for Protocol Amendment 01. Validated code EC/NEW/INST/2023/1482.',
    hash: '9876543210fedcba0123456789abcdef9876543210fedcba0123456789abcdef',
    ipAddress: '192.168.1.112',
  },
  {
    id: 'AUD-2024-0095',
    timestamp: '2024-09-03 11:45:30',
    actor: 'Vedika Sakharkar',
    role: 'Clinical Workflow Developer',
    action: 'CREATE',
    module: 'Adverse Events',
    targetId: 'AE-0004',
    targetName: 'Mild Nausea & Drowsiness',
    details: 'Logged adverse event for Subject PRT-0012. Causality assessed as Unlikely.',
    hash: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    ipAddress: '192.168.1.108',
  },
  {
    id: 'AUD-2024-0094',
    timestamp: '2024-09-02 09:30:18',
    actor: 'Meet Patil',
    role: 'Compliance & Governance Lead',
    action: 'VERIFY',
    module: 'Ethics',
    targetId: 'REG-01',
    targetName: 'CTRI/2024/03/064218',
    details: 'Verified prospective registration on CTRI portal before first patient enrollment per NDCT Rules 2019 Schedule I.',
    hash: 'abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    ipAddress: '192.168.1.104',
  },
  {
    id: 'AUD-2024-0093',
    timestamp: '2024-08-28 14:05:51',
    actor: 'Hrishikesh',
    role: 'Database & Security Admin',
    action: 'UPDATE',
    module: 'Sites',
    targetId: 'SITE-02',
    targetName: 'AIIA Goa Clinical Research Center',
    details: 'Updated site audit compliance score to 95% following internal GCP inspection.',
    hash: '5566778899aabbccddeeff00112233445566778899aabbccddeeff0011223344',
    ipAddress: '192.168.1.102',
  },
  {
    id: 'AUD-2024-0092',
    timestamp: '2024-08-20 16:50:22',
    actor: 'Meet Patil',
    role: 'Compliance & Governance Lead',
    action: 'EXPORT_DATA',
    module: 'Interoperability',
    targetId: 'AIIA-CT-2024-001',
    targetName: 'Ashwagandha Trial',
    details: 'Generated FHIR R4 Bundle with ResearchStudy, Patient, and Observation resources.',
    hash: 'aabbccddeeff00112233445566778899aabbccddeeff00112233445566778899',
    ipAddress: '192.168.1.104',
  },
];
