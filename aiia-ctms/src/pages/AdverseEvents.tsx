import { useState } from 'react';
import {
  Search,
  Plus,
  Filter,
  AlertTriangle,
  FileWarning,
  Activity,
  CheckCircle2,
  X,
} from 'lucide-react';
import { useClinical } from '@/data/clinicalStore';
import type { AESeverity, AEStatus, AECausality, AEOutcome } from '@/data/mockData';

const severityStyles: Record<string, { text: string; bg: string }> = {
  Mild: { text: 'text-amber-700', bg: 'bg-amber-50' },
  Moderate: { text: 'text-orange-700', bg: 'bg-orange-50' },
  Severe: { text: 'text-crimson-700', bg: 'bg-crimson-50' },
  'Life-Threatening': { text: 'text-red-800', bg: 'bg-red-100' },
};

const statusStyles: Record<string, { text: string; bg: string }> = {
  Open: { text: 'text-crimson-700', bg: 'bg-crimson-50' },
  'Under Review': { text: 'text-amber-700', bg: 'bg-amber-50' },
  Resolved: { text: 'text-emerald-700', bg: 'bg-emerald-50' },
  Closed: { text: 'text-gray-700', bg: 'bg-gray-100' },
};

const severityOptions: AESeverity[] = ['Mild', 'Moderate', 'Severe', 'Life-Threatening'];
const statusOptions: AEStatus[] = ['Open', 'Under Review', 'Resolved', 'Closed'];
const causalityOptions: AECausality[] = ['Unrelated', 'Unlikely', 'Possible', 'Probable', 'Definite'];
const outcomeOptions: AEOutcome[] = ['Recovering', 'Recovered', 'Not Recovered', 'Fatal', 'Unknown'];

export default function AdverseEvents() {
  const { adverseEvents, participants, addAdverseEvent, updateAdverseEvent } = useClinical();
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form state
  const [formParticipantId, setFormParticipantId] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formOnsetDate, setFormOnsetDate] = useState('');
  const [formSeverity, setFormSeverity] = useState<AESeverity>('Mild');
  const [formCausality, setFormCausality] = useState<AECausality>('Unlikely');
  const [formOutcome, setFormOutcome] = useState<AEOutcome>('Recovering');
  const [formReporter, setFormReporter] = useState('');
  const [formNotes, setFormNotes] = useState('');

  // Update Status Modal
  const [editingAeId, setEditingAeId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<AEStatus>('Under Review');
  const [editNotes, setEditNotes] = useState('');

  const filtered = adverseEvents.filter((ae) => {
    const matchesSearch =
      ae.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ae.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ae.eventDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === 'All' || ae.severity === severityFilter;
    const matchesStatus = statusFilter === 'All' || ae.status === statusFilter;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const counts = {
    total: adverseEvents.length,
    open: adverseEvents.filter(ae => ae.status === 'Open').length,
    severe: adverseEvents.filter(ae => ae.severity === 'Severe' || ae.severity === 'Life-Threatening').length,
    resolved: adverseEvents.filter(ae => ae.status === 'Resolved' || ae.status === 'Closed').length,
  };

  const resetForm = () => {
    setFormParticipantId(''); setFormDescription(''); setFormOnsetDate('');
    setFormSeverity('Mild'); setFormCausality('Unlikely'); setFormOutcome('Recovering');
    setFormReporter(''); setFormNotes('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const participant = participants.find(p => p.id === formParticipantId);
    if (!formParticipantId.trim() || !formDescription.trim() || !formOnsetDate) return;
    addAdverseEvent({
      participantId: formParticipantId.trim(),
      participantName: participant?.name || formParticipantId.trim(),
      trialId: participant?.trialId || '',
      trialName: participant?.trialName || '',
      eventDescription: formDescription.trim(),
      onsetDate: formOnsetDate,
      resolvedDate: '',
      severity: formSeverity,
      causality: formCausality,
      outcome: formOutcome,
      status: 'Open',
      reporter: formReporter.trim(),
      notes: formNotes.trim(),
      reportedDate: new Date().toISOString().split('T')[0],
    });
    resetForm();
    setShowAddForm(false);
  };

  const handleUpdateStatus = () => {
    if (!editingAeId) return;
    updateAdverseEvent(editingAeId, {
      status: editStatus,
      notes: editNotes,
      resolvedDate: (editStatus === 'Resolved' || editStatus === 'Closed') ? new Date().toISOString().split('T')[0] : '',
    });
    setEditingAeId(null);
    setEditNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Adverse Events</h1>
          <p className="text-sm text-gray-500 mt-1">
            Report and track adverse events and pharmacovigilance
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-crimson-600 text-white text-sm font-medium rounded-lg hover:bg-crimson-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Report AE
        </button>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Events', value: counts.total, color: '#1b2f5b', icon: FileWarning },
          { label: 'Open', value: counts.open, color: '#dc2626', icon: AlertTriangle },
          { label: 'Severe / Life-Threatening', value: counts.severe, color: '#991b1b', icon: Activity },
          { label: 'Resolved', value: counts.resolved, color: '#059669', icon: CheckCircle2 },
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
            placeholder="Search by participant, event ID, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500"
          >
            <option value="All">All Severities</option>
            {severityOptions.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
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

      {/* AE List */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((ae) => {
            const sevStyle = severityStyles[ae.severity] || severityStyles.Mild;
            const statStyle = statusStyles[ae.status] || statusStyles.Open;
            return (
              <div
                key={ae.id}
                className="bg-white rounded-xl p-5 transition-all duration-200 hover:shadow-md"
                style={{ boxShadow: 'var(--shadow-card)', borderLeft: `3px solid ${ae.severity === 'Severe' || ae.severity === 'Life-Threatening' ? '#991b1b' : 'transparent'}` }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-gray-400">{ae.id}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${sevStyle.bg} ${sevStyle.text}`}>
                        {ae.severity}
                      </span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statStyle.bg} ${statStyle.text}`}>
                        {ae.status}
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 mt-1">
                      {ae.eventDescription}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Participant: {ae.participantName} &middot; Trial: {ae.trialName || '—'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      Onset: {new Date(ae.onsetDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    <button
                      onClick={() => {
                        setEditingAeId(ae.id);
                        setEditStatus(ae.status);
                        setEditNotes(ae.notes);
                      }}
                      className="mt-1 text-xs font-medium text-navy-900 hover:underline"
                    >
                      Update Status
                    </button>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-gray-500 border-t border-gray-50 pt-3">
                  <span><strong className="font-medium text-gray-700">Causality:</strong> {ae.causality}</span>
                  <span className="text-gray-300">|</span>
                  <span><strong className="font-medium text-gray-700">Outcome:</strong> {ae.outcome}</span>
                  <span className="text-gray-300">|</span>
                  <span><strong className="font-medium text-gray-700">Reported By:</strong> {ae.reporter || 'System'}</span>
                </div>
                {ae.notes && (
                  <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                    {ae.notes}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-16 flex flex-col items-center justify-center text-center" style={{ boxShadow: 'var(--shadow-card)' }}>
          <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-gray-300" strokeWidth={1.5} />
          </div>
          <h2 className="text-lg font-semibold text-gray-700 mb-1">
            {searchQuery || severityFilter !== 'All' || statusFilter !== 'All' ? 'No adverse events match your filters' : 'No Adverse Events'}
          </h2>
          <p className="text-sm text-gray-400 max-w-md">
            {searchQuery || severityFilter !== 'All' || statusFilter !== 'All'
              ? 'Try adjusting your search or filter criteria.'
              : 'Click "Report AE" to log a new adverse event.'}
          </p>
        </div>
      )}

      {/* Report AE Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl w-full max-w-xl mx-4 max-h-[90vh] overflow-y-auto" style={{ boxShadow: '0 25px 50px rgba(0,0,0,.15)' }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-crimson-50/50 rounded-t-xl">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-crimson-600" />
                Report Adverse Event
              </h2>
              <button onClick={() => { setShowAddForm(false); resetForm(); }} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Description *</label>
                  <input type="text" required value={formDescription} onChange={(e) => setFormDescription(e.target.value)} className="w-full h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-crimson-500/20 focus:border-crimson-500" placeholder="Brief description of the event" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Participant *</label>
                  {participants.length > 0 ? (
                    <select required value={formParticipantId} onChange={(e) => setFormParticipantId(e.target.value)} className="w-full h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-crimson-500/20 focus:border-crimson-500">
                      <option value="">Select participant</option>
                      {participants.map(p => <option key={p.id} value={p.id}>{p.name} ({p.id})</option>)}
                    </select>
                  ) : (
                    <input type="text" required value={formParticipantId} onChange={(e) => setFormParticipantId(e.target.value)} className="w-full h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-crimson-500/20 focus:border-crimson-500" placeholder="Enter participant ID" />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Onset Date *</label>
                  <input type="date" required value={formOnsetDate} onChange={(e) => setFormOnsetDate(e.target.value)} className="w-full h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-crimson-500/20 focus:border-crimson-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Severity *</label>
                  <select required value={formSeverity} onChange={(e) => setFormSeverity(e.target.value as AESeverity)} className="w-full h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-crimson-500/20 focus:border-crimson-500">
                    {severityOptions.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Causality *</label>
                  <select required value={formCausality} onChange={(e) => setFormCausality(e.target.value as AECausality)} className="w-full h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-crimson-500/20 focus:border-crimson-500">
                    {causalityOptions.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Outcome *</label>
                  <select required value={formOutcome} onChange={(e) => setFormOutcome(e.target.value as AEOutcome)} className="w-full h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-crimson-500/20 focus:border-crimson-500">
                    {outcomeOptions.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reporter</label>
                  <input type="text" value={formReporter} onChange={(e) => setFormReporter(e.target.value)} className="w-full h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-crimson-500/20 focus:border-crimson-500" placeholder="Name of reporting physician/coordinator" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Notes</label>
                  <textarea value={formNotes} onChange={(e) => setFormNotes(e.target.value)} rows={3} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-crimson-500/20 focus:border-crimson-500 resize-none" placeholder="Provide full details of the event..." />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowAddForm(false); resetForm(); }} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-crimson-600 rounded-lg hover:bg-crimson-700 transition-colors">
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update AE Status Modal */}
      {editingAeId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl w-full max-w-sm mx-4" style={{ boxShadow: '0 25px 50px rgba(0,0,0,.15)' }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Update AE Status</h2>
              <button onClick={() => setEditingAeId(null)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select value={editStatus} onChange={(e) => setEditStatus(e.target.value as AEStatus)} className="w-full h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500">
                  {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea value={editNotes} onChange={(e) => setEditNotes(e.target.value)} rows={3} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500 resize-none" placeholder="Append any review or resolution notes..." />
              </div>
              <div className="flex items-center justify-end gap-3">
                <button onClick={() => setEditingAeId(null)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
                <button onClick={handleUpdateStatus} className="px-4 py-2 text-sm font-medium text-white bg-navy-900 rounded-lg hover:bg-navy-800 transition-colors">
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
