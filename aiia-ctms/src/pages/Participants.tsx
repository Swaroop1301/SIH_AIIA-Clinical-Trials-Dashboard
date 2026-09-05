import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Plus,
  Filter,
  ChevronRight,
  Users,
  UserPlus,
  Activity,
  X,
} from 'lucide-react';
import { useClinical } from '@/data/clinicalStore';
import type { ParticipantStatus, Gender } from '@/data/mockData';

const statusStyles: Record<string, { text: string; bg: string }> = {
  Screening: { text: 'text-amber-700', bg: 'bg-amber-50' },
  Enrolled: { text: 'text-teal-700', bg: 'bg-teal-50' },
  Active: { text: 'text-emerald-700', bg: 'bg-emerald-50' },
  Completed: { text: 'text-navy-700', bg: 'bg-navy-50' },
  Withdrawn: { text: 'text-crimson-700', bg: 'bg-crimson-50' },
  Discontinued: { text: 'text-gray-700', bg: 'bg-gray-100' },
};

const genderOptions: Gender[] = ['Male', 'Female', 'Other'];
const statusOptions: ParticipantStatus[] = ['Screening', 'Enrolled', 'Active', 'Completed', 'Withdrawn', 'Discontinued'];

export default function Participants() {
  const { participants, addParticipant } = useClinical();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form state
  const [formName, setFormName] = useState('');
  const [formAge, setFormAge] = useState('');
  const [formGender, setFormGender] = useState<Gender>('Male');
  const [formContact, setFormContact] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formTrialId, setFormTrialId] = useState('');
  const [formTrialName, setFormTrialName] = useState('');
  const [formSiteId, setFormSiteId] = useState('');
  const [formSiteName, setFormSiteName] = useState('');
  const [formStatus, setFormStatus] = useState<ParticipantStatus>('Screening');
  const [formNotes, setFormNotes] = useState('');

  const filtered = participants.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.trialName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const counts = {
    total: participants.length,
    active: participants.filter(p => p.status === 'Active').length,
    enrolled: participants.filter(p => p.status === 'Enrolled').length,
    screening: participants.filter(p => p.status === 'Screening').length,
  };

  const resetForm = () => {
    setFormName(''); setFormAge(''); setFormGender('Male');
    setFormContact(''); setFormEmail('');
    setFormTrialId(''); setFormTrialName('');
    setFormSiteId(''); setFormSiteName('');
    setFormStatus('Screening'); setFormNotes('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;
    addParticipant({
      name: formName.trim(),
      age: parseInt(formAge) || 0,
      gender: formGender,
      contact: formContact.trim(),
      email: formEmail.trim(),
      trialId: formTrialId.trim(),
      trialName: formTrialName.trim(),
      siteId: formSiteId.trim(),
      siteName: formSiteName.trim(),
      enrollmentDate: new Date().toISOString().split('T')[0],
      status: formStatus,
      notes: formNotes.trim(),
    });
    resetForm();
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Participant Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage enrolled participants, profiles, and timelines
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-navy-900 text-white text-sm font-medium rounded-lg hover:bg-navy-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Participant
        </button>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Participants', value: counts.total, icon: Users, color: '#1b2f5b' },
          { label: 'Active', value: counts.active, icon: Activity, color: '#059669' },
          { label: 'Enrolled', value: counts.enrolled, icon: UserPlus, color: '#0d9488' },
          { label: 'Screening', value: counts.screening, icon: Search, color: '#d97706' },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white rounded-xl p-4 flex items-center gap-3"
            style={{ boxShadow: 'var(--shadow-card)', borderLeft: `3px solid ${kpi.color}` }}
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${kpi.color}10` }}>
              <kpi.icon className="w-5 h-5" style={{ color: kpi.color }} strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{kpi.value}</p>
              <p className="text-xs text-gray-500">{kpi.label}</p>
            </div>
          </div>
        ))}
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
            placeholder="Search by name, ID, or trial..."
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
            {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Participant List */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((p) => {
            const style = statusStyles[p.status] || statusStyles.Active;
            return (
              <Link
                key={p.id}
                to={`/app/participants/${p.id}`}
                className="block bg-white rounded-xl p-5 transition-all duration-200 hover:shadow-md group"
                style={{ boxShadow: 'var(--shadow-card)' }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-gray-400">{p.id}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}>
                        {p.status}
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 group-hover:text-navy-900 transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {p.age} yrs, {p.gender} &middot; {p.trialName || 'No trial assigned'}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-navy-900 transition-colors shrink-0 mt-1" />
                </div>
                <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                  <span>{p.siteName || 'No site'}</span>
                  <span className="text-gray-300">|</span>
                  <span>Enrolled: {new Date(p.enrollmentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  {p.contact && (
                    <>
                      <span className="text-gray-300">|</span>
                      <span>{p.contact}</span>
                    </>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-16 flex flex-col items-center justify-center text-center" style={{ boxShadow: 'var(--shadow-card)' }}>
          <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-gray-300" strokeWidth={1.5} />
          </div>
          <h2 className="text-lg font-semibold text-gray-700 mb-1">
            {searchQuery || statusFilter !== 'All' ? 'No participants match your filters' : 'No Participants Yet'}
          </h2>
          <p className="text-sm text-gray-400 max-w-md">
            {searchQuery || statusFilter !== 'All'
              ? 'Try adjusting your search or filter criteria.'
              : 'Click "Add Participant" to register the first participant in the system.'}
          </p>
        </div>
      )}

      {/* Add Participant Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" style={{ boxShadow: '0 25px 50px rgba(0,0,0,.15)' }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Add New Participant</h2>
              <button onClick={() => { setShowAddForm(false); resetForm(); }} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input type="text" required value={formName} onChange={(e) => setFormName(e.target.value)} className="w-full h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500" placeholder="Enter participant name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
                  <input type="number" required min={1} max={120} value={formAge} onChange={(e) => setFormAge(e.target.value)} className="w-full h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500" placeholder="Age" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                  <select required value={formGender} onChange={(e) => setFormGender(e.target.value as Gender)} className="w-full h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500">
                    {genderOptions.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input type="tel" value={formContact} onChange={(e) => setFormContact(e.target.value)} className="w-full h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500" placeholder="+91..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} className="w-full h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500" placeholder="email@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trial ID</label>
                  <input type="text" value={formTrialId} onChange={(e) => setFormTrialId(e.target.value)} className="w-full h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500" placeholder="e.g. TRL-001" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trial Name</label>
                  <input type="text" value={formTrialName} onChange={(e) => setFormTrialName(e.target.value)} className="w-full h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500" placeholder="Trial name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Site ID</label>
                  <input type="text" value={formSiteId} onChange={(e) => setFormSiteId(e.target.value)} className="w-full h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500" placeholder="e.g. SITE-001" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
                  <input type="text" value={formSiteName} onChange={(e) => setFormSiteName(e.target.value)} className="w-full h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500" placeholder="Site name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={formStatus} onChange={(e) => setFormStatus(e.target.value as ParticipantStatus)} className="w-full h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500">
                    {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea value={formNotes} onChange={(e) => setFormNotes(e.target.value)} rows={2} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500 resize-none" placeholder="Additional notes..." />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowAddForm(false); resetForm(); }} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-navy-900 rounded-lg hover:bg-navy-800 transition-colors">
                  Add Participant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
