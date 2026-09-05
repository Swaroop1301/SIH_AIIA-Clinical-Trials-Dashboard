import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  FlaskConical,
  Users,
  TrendingUp,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { sites, trials } from '@/data/mockData';

const tabs = ['Overview', 'Trials', 'Staff', 'Performance'];

const monthlyEnrollment = [
  { month: 'Apr', value: 18 },
  { month: 'May', value: 32 },
  { month: 'Jun', value: 25 },
  { month: 'Jul', value: 41 },
  { month: 'Aug', value: 38 },
  { month: 'Sep', value: 45 },
];

export default function SiteDetail() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('Overview');

  const site = sites.find((s) => s.id === id);

  if (!site) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-gray-500 text-lg">Site not found</p>
        <Link to="/app/sites" className="text-navy-900 text-sm mt-2 hover:underline">
          Back to Sites
        </Link>
      </div>
    );
  }

  const siteTrials = trials.filter((t) => t.status === 'Active').slice(0, site.activeTrials);

  return (
    <div className="space-y-6">
      <Link
        to="/app/sites"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-navy-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Sites
      </Link>

      {/* Site Header */}
      <div className="bg-white rounded-xl p-6" style={{ boxShadow: 'var(--shadow-card)' }}>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-navy-50 flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6 text-navy-900" strokeWidth={1.8} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold text-gray-900">{site.name}</h1>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                {site.status}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {site.location}, {site.city}, {site.state}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" />
                {site.phone}
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                {site.email}
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-9 h-9 rounded-lg bg-navy-50 flex items-center justify-center">
              <FlaskConical className="w-4 h-4 text-navy-900" strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{site.activeTrials}</p>
              <p className="text-xs text-gray-500">Active Trials</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center">
              <Users className="w-4 h-4 text-teal-600" strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{site.totalParticipants}</p>
              <p className="text-xs text-gray-500">Participants</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-emerald-600" strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{site.enrollmentRate}%</p>
              <p className="text-xs text-gray-500">Enrollment Rate</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-amber-600" strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{site.complianceScore}%</p>
              <p className="text-xs text-gray-500">Compliance</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Contact Information</h3>
                <dl className="space-y-2">
                  <div className="flex">
                    <dt className="text-sm text-gray-400 w-40">Principal Investigator</dt>
                    <dd className="text-sm text-gray-700">{site.pi}</dd>
                  </div>
                  <div className="flex">
                    <dt className="text-sm text-gray-400 w-40">Address</dt>
                    <dd className="text-sm text-gray-700">{site.location}, {site.city}, {site.state}</dd>
                  </div>
                  <div className="flex">
                    <dt className="text-sm text-gray-400 w-40">Phone</dt>
                    <dd className="text-sm text-gray-700">{site.phone}</dd>
                  </div>
                  <div className="flex">
                    <dt className="text-sm text-gray-400 w-40">Email</dt>
                    <dd className="text-sm text-gray-700">{site.email}</dd>
                  </div>
                  <div className="flex">
                    <dt className="text-sm text-gray-400 w-40">Site ID</dt>
                    <dd className="text-sm font-mono text-gray-700">{site.id}</dd>
                  </div>
                </dl>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Monthly Enrollment</h3>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyEnrollment} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px' }} />
                      <Bar dataKey="value" name="Enrolled" fill="#0f3460" radius={[4, 4, 0, 0]} barSize={24} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Trials' && (
            <div className="space-y-3">
              {siteTrials.map((trial) => (
                <Link
                  key={trial.id}
                  to={`/app/trials/${trial.id}`}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{trial.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {trial.id} &middot; {trial.phase} &middot; {trial.participants} participants
                    </p>
                  </div>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                    {trial.status}
                  </span>
                </Link>
              ))}
            </div>
          )}

          {activeTab === 'Staff' && (
            <div className="space-y-3">
              {[
                { name: site.pi, role: 'Principal Investigator', department: 'Clinical Research' },
                { name: 'Dr. Amit Verma', role: 'Sub-Investigator', department: 'Kayachikitsa' },
                { name: 'Sneha Patil', role: 'Clinical Research Coordinator', department: 'CTMS Operations' },
                { name: 'Rahul Joshi', role: 'Data Entry Operator', department: 'Data Management' },
              ].map((person, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-navy-100 flex items-center justify-center text-sm font-semibold text-navy-900">
                      {person.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{person.name}</p>
                      <p className="text-xs text-gray-500">{person.role}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">{person.department}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Performance' && (
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900">Key Metrics</h3>
                {[
                  { label: 'Screen Failure Rate', value: '12%', status: 'good' },
                  { label: 'Protocol Deviations', value: '2', status: 'good' },
                  { label: 'Query Resolution Time', value: '3.2 days', status: 'warning' },
                  { label: 'Data Entry Lag', value: '1.5 days', status: 'good' },
                  { label: 'Monitoring Visit Compliance', value: '100%', status: 'good' },
                ].map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">{metric.label}</span>
                    <span className={`text-sm font-semibold ${metric.status === 'good' ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {metric.value}
                    </span>
                  </div>
                ))}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Enrollment Trend</h3>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyEnrollment} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px' }} />
                      <Bar dataKey="value" name="Enrolled" fill="#14b8a6" radius={[4, 4, 0, 0]} barSize={24} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
