import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Filter, ChevronRight, X } from 'lucide-react';
import { api } from '@/services/api';

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
  const [trials, setTrials] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [phaseFilter, setPhaseFilter] = useState<string>('All');
  const [showModal, setShowModal] = useState(false);
  const [newTrialName, setNewTrialName] = useState('');
  const [newTrialStatus, setNewTrialStatus] = useState('Planning');

  const fetchTrials = async () => {
    try {
      const res = await api.get('/trials');
      setTrials(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchTrials();
  }, []);

  const handleCreateTrial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/trials/', { name: newTrialName, status: newTrialStatus });
      setShowModal(false);
      setNewTrialName('');
      setNewTrialStatus('Planning');
      fetchTrials();
    } catch (e) {
      console.error(e);
    }
  };

  const filteredTrials = trials.filter((trial) => {
    const matchesSearch =
      trial.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trial.id?.toString().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || trial.status === statusFilter;
    return matchesSearch && matchesStatus;
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
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-navy-900 text-white text-sm font-medium rounded-lg hover:bg-navy-800 transition-colors"
        >
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
            placeholder="Search by trial name or ID..."
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
        </div>
      </div>

      {/* Trial Cards */}
      <div className="space-y-3">
        {filteredTrials.map((trial) => {
          const status = statusStyles[trial.status || 'Active'] || statusStyles.Active;
          const phase = phaseStyles['Phase II']; // Fallback
          const progress = 0; // Fallback

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
                    <span className="text-xs font-mono text-gray-400">CT-{String(trial.id).padStart(4, '0')}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${status.bg} ${status.text}`}>
                      {trial.status}
                    </span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${phase.bg} ${phase.text}`}>
                      Phase II
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 group-hover:text-navy-900 transition-colors">
                    {trial.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    PI: Unassigned &middot; AIIA Sponsor
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-navy-900 transition-colors shrink-0 mt-1" />
              </div>

              <div className="mt-4 flex items-center gap-6">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>0 sites</span>
                  <span className="text-gray-300">|</span>
                  <span>0 / 100 enrolled</span>
                  <span className="text-gray-300">|</span>
                  <span>General</span>
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
          <p className="text-gray-400 text-sm">{trials.length === 0 ? "No trials found. Click 'New Trial' to create one." : "No trials match your search criteria"}</p>
        </div>
      )}

      {/* Create Trial Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">Create New Trial</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateTrial} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trial Name</label>
                <input
                  type="text"
                  required
                  value={newTrialName}
                  onChange={(e) => setNewTrialName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-navy-900 focus:border-navy-900 sm:text-sm"
                  placeholder="e.g. Ashwagandha Efficacy Study"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Initial Status</label>
                <select
                  value={newTrialStatus}
                  onChange={(e) => setNewTrialStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-navy-900 focus:border-navy-900 sm:text-sm"
                >
                  <option value="Planning">Planning</option>
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-navy-900 rounded-lg hover:bg-navy-800"
                >
                  Create Trial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
