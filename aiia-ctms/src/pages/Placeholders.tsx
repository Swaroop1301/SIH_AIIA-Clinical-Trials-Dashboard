import type { LucideIcon } from 'lucide-react';
import {
  Users,
  Calendar,
  AlertTriangle,
  ShieldCheck,
  FileText,
  ClipboardList,
  BarChart3,
  Construction,
} from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: LucideIcon;
  owner: string;
}

function PlaceholderPage({ title, description, icon: Icon, owner }: PlaceholderPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
      <div
        className="bg-white rounded-xl p-16 flex flex-col items-center justify-center text-center"
        style={{ boxShadow: 'var(--shadow-card)' }}
      >
        <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-gray-300" strokeWidth={1.5} />
        </div>
        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-4">
          <Construction className="w-5 h-5 text-amber-500" strokeWidth={1.8} />
        </div>
        <h2 className="text-lg font-semibold text-gray-700 mb-1">Module Under Development</h2>
        <p className="text-sm text-gray-400 max-w-md">
          This module is being developed by <span className="font-medium text-gray-500">{owner}</span>.
          It will be integrated into the CTMS dashboard once ready.
        </p>
      </div>
    </div>
  );
}

export function Participants() {
  return (
    <PlaceholderPage
      title="Participant Management"
      description="Manage enrolled participants, profiles, and timelines"
      icon={Users}
      owner="Vedika Sakharkar (Clinical Workflow Frontend Developer)"
    />
  );
}

export function Visits() {
  return (
    <PlaceholderPage
      title="Visit Management"
      description="Calendar, list, and per-participant visit views"
      icon={Calendar}
      owner="Vedika Sakharkar (Clinical Workflow Frontend Developer)"
    />
  );
}

export function AdverseEvents() {
  return (
    <PlaceholderPage
      title="Adverse Events"
      description="Report and track adverse events and pharmacovigilance"
      icon={AlertTriangle}
      owner="Aryan (API + Frontend Integration Lead) & Vedika"
    />
  );
}

export function Ethics() {
  return (
    <PlaceholderPage
      title="Ethics & Compliance"
      description="Ethics submissions, regulatory tracking, and CTRI compliance"
      icon={ShieldCheck}
      owner="Meet (Compliance & Governance Backend Developer)"
    />
  );
}

export function Documents() {
  return (
    <PlaceholderPage
      title="Document Management"
      description="Versioned document storage with strict audit trail"
      icon={FileText}
      owner="Meet (Compliance & Governance Backend Developer)"
    />
  );
}

export function AuditTrail() {
  return (
    <PlaceholderPage
      title="Audit Trail"
      description="Immutable audit log of all system actions"
      icon={ClipboardList}
      owner="Meet (Compliance & Governance Backend Developer)"
    />
  );
}

export function Reports() {
  return (
    <PlaceholderPage
      title="Reports & Analytics"
      description="Generate and export clinical trial reports"
      icon={BarChart3}
      owner="Team (Cross-functional)"
    />
  );
}
