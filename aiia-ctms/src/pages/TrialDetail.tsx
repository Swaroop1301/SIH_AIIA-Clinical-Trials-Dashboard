import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Users,
  Building2,
  AlertTriangle,
  Target,
  FileText,
  Activity,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { trials, sites as allSites } from '@/data/mockData';

const statusStyles: Record<string, { text: string; bg: string }> = {
  Active: { text: 'text-emerald-700', bg: 'bg-emerald-50' },
  Completed: { text: 'text-navy-700', bg: 'bg-navy-50' },
  Suspended: { text: 'text-amber-700', bg: 'bg-amber-50' },
  Planning: { text: 'text-teal-700', bg: 'bg-teal-50' },
  Terminated: { text: 'text-crimson-700', bg: 'bg-crimson-50' },
};

const tabs = ['Overview', 'Sites', 'Participants', 'Timeline', 'Documents'];

// Mock enrollment timeline for individual trial
const trialEnrollmentData = [
  { week: 'W1', enrolled: 12 },
  { week: 'W2', enrolled: 28 },
  { week: 'W3', enrolled: 45 },
  { week: 'W4', enrolled: 67 },
  { week: 'W5', enrolled: 89 },
  { week: 'W6', enrolled: 112 },
  { week: 'W7', enrolled: 140 },
  { week: 'W8', enrolled: 165 },
  { week: 'W9', enrolled: 198 },
  { week: 'W10', enrolled: 225 },
  { week: 'W11', enrolled: 260 },
  { week: 'W12', enrolled: 290 },
];

export default function TrialDetail() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('Overview');

  const trial = trials.find((t) => t.id === id);

  if (!trial) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-gray-500 text-lg">Trial not found</p>
        <Link to="/app/trials" className="text-navy-900 text-sm mt-2 hover:underline">
          Back to Trials
        </Link>
      </div>
    );
  }

  const status = statusStyles[trial.status] || statusStyles.Active;
  const progress = Math.round((trial.participants / trial.targetEnrollment) * 100);
  const trialSites = allSites.slice(0, trial.sites);

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        to="/app/trials"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-navy-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Trials
      </Link>

      {/* Trial Header */}
      <div className="bg-white rounded-xl p-6" style={{ boxShadow: 'var(--shadow-card)' }}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono text-gray-400">{trial.id}</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${status.bg} ${status.text}`}>
                {trial.status}
              </span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-navy-50 text-navy-700">
                {trial.phase}
              </span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">{trial.title}</h1>
            <p className="text-sm text-gray-500 mt-1">
              Protocol: {trial.protocol} &middot; PI: {trial.pi} &middot; Sponsor: {trial.sponsor}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-9 h-9 rounded-lg bg-navy-50 flex items-center justify-center">
              <Target className="w-4 h-4 text-navy-900" strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">
                {trial.participants}/{trial.targetEnrollment}
              </p>
              <p className="text-xs text-gray-500">Enrolled</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-emerald-600" strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{trial.sites}</p>
              <p className="text-xs text-gray-500">Active Sites</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-9 h-9 rounded-lg bg-crimson-50 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-crimson-600" strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">3</p>
              <p className="text-xs text-gray-500">Adverse Events</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center">
              <Activity className="w-4 h-4 text-teal-600" strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{progress}%</p>
              <p className="text-xs text-gray-500">Completion</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl" style={{ boxShadow: 'var(--shadow-card)' }}>
        <div className="border-b border-gray-100 px-6">
          <nav className="flex gap-0">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'text-navy-900 border-navy-900'
                    : 'text-gray-400 border-transparent hover:text-gray-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'Overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{trial.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Trial Details</h3>
                  <dl className="space-y-2">
                    <div className="flex">
                      <dt className="text-sm text-gray-400 w-36">Therapeutic Area</dt>
                      <dd className="text-sm text-gray-700">{trial.therapeuticArea}</dd>
                    </div>
                    <div className="flex">
                      <dt className="text-sm text-gray-400 w-36">Start Date</dt>
                      <dd className="text-sm text-gray-700">
                        {new Date(trial.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </dd>
                    </div>
                    <div className="flex">
                      <dt className="text-sm text-gray-400 w-36">End Date</dt>
                      <dd className="text-sm text-gray-700">
                        {new Date(trial.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Enrollment Progress</h3>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trialEnrollmentData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="trialGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0f3460" stopOpacity={0.15} />
                            <stop offset="95%" stopColor="#0f3460" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px' }}
                        />
                        <Area type="monotone" dataKey="enrolled" stroke="#0f3460" strokeWidth={2} fill="url(#trialGrad)" dot={{ r: 2.5, fill: '#0f3460' }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Sites' && (
            <div className="space-y-3">
              {trialSites.map((site) => (
                <Link
                  key={site.id}
                  to={`/app/sites/${site.id}`}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-navy-50 flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-navy-900" strokeWidth={1.8} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{site.name}</p>
                      <p className="text-xs text-gray-500">{site.city}, {site.state} &middot; PI: {site.pi}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{site.totalParticipants} participants</span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                      {site.complianceScore}% compliance
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {activeTab === 'Participants' && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-400">Participant management is handled by Vedika's module.</p>
              <p className="text-xs text-gray-400 mt-1">This section will display enrolled participants for this trial.</p>
            </div>
          )}

          {activeTab === 'Timeline' && (
            <div className="space-y-4">
              {[
                { date: trial.startDate, event: 'Trial Initiated', status: 'completed' },
                { date: '2026-02-01', event: 'First Patient Enrolled', status: 'completed' },
                { date: '2026-05-15', event: 'Interim Analysis', status: 'completed' },
                { date: '2026-09-01', event: 'Mid-Trial Review', status: 'active' },
                { date: trial.endDate, event: 'Trial Completion', status: 'pending' },
              ].map((milestone, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`w-3 h-3 rounded-full mt-1 shrink-0 ${
                    milestone.status === 'completed' ? 'bg-emerald-500' :
                    milestone.status === 'active' ? 'bg-navy-900' : 'bg-gray-300'
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{milestone.event}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(milestone.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Documents' && (
            <div className="space-y-2">
              {[
                { name: 'Protocol v2.3', type: 'Protocol', date: '2026-08-15' },
                { name: 'IEC Approval Letter', type: 'Ethics', date: '2026-01-10' },
                { name: 'Informed Consent Form', type: 'ICF', date: '2026-01-12' },
                { name: 'Investigator Brochure', type: 'Reference', date: '2025-12-01' },
              ].map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-gray-400" strokeWidth={1.8} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                      <p className="text-xs text-gray-400">{doc.type}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(doc.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
