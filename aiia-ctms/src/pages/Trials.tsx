import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Filter, ChevronRight } from 'lucide-react';
import { trials } from '@/data/mockData';

const statusStyles: Record<string, { text: string; bg: string }> = {
  Active: { text: 'text-emerald-700', bg: 'bg-emerald-50' },
  Completed: { text: 'text-navy-700', bg: 'bg-navy-50' },
  Suspended: { text: 'text-amber-700', bg: 'bg-amber-50' },
  Planning: { text: 'text-teal-700', bg: 'bg-teal-50' },
  Terminated: { text: 'text-crimson-700', bg: 'bg-crimson-50' },
};

const phaseStyles: Record<string, { text: string; bg: string }> = {
  'Phase I': { text: 'text-teal-700', bg: 'bg-teal-50' },
  'Phase II': { text: 'text-navy-700', bg: 'bg-navy-50' },
  'Phase III': { text: 'text-crimson-700', bg: 'bg-crimson-50' },
  'Phase IV': { text: 'text-amber-700', bg: 'bg-amber-50' },
};

export default function Trials() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [phaseFilter, setPhaseFilter] = useState<string>('All');

  const filteredTrials = trials.filter((trial) => {
    const matchesSearch =
      trial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trial.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trial.pi.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || trial.status === statusFilter;
    const matchesPhase = phaseFilter === 'All' || trial.phase === phaseFilter;
    return matchesSearch && matchesStatus && matchesPhase;
  });

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trial Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and monitor all clinical trials
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-navy-900 text-white text-sm font-medium rounded-lg hover:bg-navy-800 transition-colors">
          <Plus className="w-4 h-4" />
          New Trial
        </button>
      </div>

      {/* Filters */}
      <div
        className="bg-white rounded-xl p-4 flex flex-wrap items-center gap-3"
        style={{ boxShadow: 'var(--shadow-card)' }}
      >
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by trial name, ID, or PI..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="Planning">Planning</option>
            <option value="Suspended">Suspended</option>
          </select>
          <select
            value={phaseFilter}
            onChange={(e) => setPhaseFilter(e.target.value)}
            className="h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500"
          >
            <option value="All">All Phases</option>
            <option value="Phase I">Phase I</option>
            <option value="Phase II">Phase II</option>
            <option value="Phase III">Phase III</option>
            <option value="Phase IV">Phase IV</option>
          </select>
        </div>
      </div>

      {/* Trial Cards */}
      <div className="space-y-3">
        {filteredTrials.map((trial) => {
          const status = statusStyles[trial.status] || statusStyles.Active;
          const phase = phaseStyles[trial.phase] || phaseStyles['Phase II'];
          const progress = Math.round((trial.participants / trial.targetEnrollment) * 100);

          return (
            <Link
              key={trial.id}
              to={`/app/trials/${trial.id}`}
              className="block bg-white rounded-xl p-5 transition-all duration-200 hover:shadow-md group"
              style={{ boxShadow: 'var(--shadow-card)' }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-gray-400">{trial.id}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${status.bg} ${status.text}`}>
                      {trial.status}
                    </span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${phase.bg} ${phase.text}`}>
                      {trial.phase}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 group-hover:text-navy-900 transition-colors">
                    {trial.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    PI: {trial.pi} &middot; {trial.sponsor}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-navy-900 transition-colors shrink-0 mt-1" />
              </div>

              <div className="mt-4 flex items-center gap-6">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{trial.sites} sites</span>
                  <span className="text-gray-300">|</span>
                  <span>{trial.participants.toLocaleString()} / {trial.targetEnrollment.toLocaleString()} enrolled</span>
                  <span className="text-gray-300">|</span>
                  <span>{trial.therapeuticArea}</span>
                </div>
                <div className="flex-1" />
                <div className="flex items-center gap-2 w-36">
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-navy-900 rounded-full transition-all"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-500 w-8 text-right">
                    {progress}%
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {filteredTrials.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center" style={{ boxShadow: 'var(--shadow-card)' }}>
          <p className="text-gray-400 text-sm">No trials match your search criteria</p>
        </div>
      )}
    </div>
  );
}
