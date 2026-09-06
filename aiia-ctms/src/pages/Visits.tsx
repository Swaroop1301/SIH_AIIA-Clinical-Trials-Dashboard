import { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Filter,
  Calendar as CalendarIcon,
  List,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { useClinical } from '@/data/clinicalStore';
import type { VisitStatus, VisitType } from '@/data/mockData';

const visitStatusStyles: Record<string, { text: string; bg: string; icon: typeof CheckCircle2 }> = {
  Scheduled: { text: 'text-blue-700', bg: 'bg-blue-50', icon: Clock },
  Completed: { text: 'text-emerald-700', bg: 'bg-emerald-50', icon: CheckCircle2 },
  Missed: { text: 'text-crimson-700', bg: 'bg-crimson-50', icon: AlertCircle },
  Cancelled: { text: 'text-gray-600', bg: 'bg-gray-100', icon: XCircle },
};

const visitTypeOptions: VisitType[] = ['Screening', 'Baseline', 'Follow-up', 'End of Study', 'Unscheduled'];
const visitStatusOptions: VisitStatus[] = ['Scheduled', 'Completed', 'Missed', 'Cancelled'];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function Visits() {
  const { visits, participants, addVisit, updateVisit } = useClinical();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [showAddForm, setShowAddForm] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());

  // Form state
  const [formParticipantId, setFormParticipantId] = useState('');
  const [formVisitType, setFormVisitType] = useState<VisitType>('Follow-up');
  const [formScheduledDate, setFormScheduledDate] = useState('');
  const [formSiteId, setFormSiteId] = useState('');
  const [formSiteName, setFormSiteName] = useState('');
  const [formInvestigator, setFormInvestigator] = useState('');
  const [formNotes, setFormNotes] = useState('');

  // Inline edit state for marking a visit
  const [editingVisitId, setEditingVisitId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<VisitStatus>('Completed');
  const [editVitals, setEditVitals] = useState('');
  const [editNotes, setEditNotes] = useState('');

  const filtered = visits.filter((v) => {
    const matchesSearch =
      v.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.trialName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.investigator.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const counts = {
    total: visits.length,
    scheduled: visits.filter(v => v.status === 'Scheduled').length,
    completed: visits.filter(v => v.status === 'Completed').length,
    missed: visits.filter(v => v.status === 'Missed').length,
  };

  // Calendar helpers
  const calYear = calendarDate.getFullYear();
  const calMonth = calendarDate.getMonth();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(calYear, calMonth, 1).getDay();

  const calendarDays = useMemo(() => {
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDayOfWeek; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  }, [firstDayOfWeek, daysInMonth]);

  const getVisitsForDay = (day: number) => {
    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return visits.filter(v => v.scheduledDate === dateStr);
  };

  const prevMonth = () => setCalendarDate(new Date(calYear, calMonth - 1, 1));
  const nextMonth = () => setCalendarDate(new Date(calYear, calMonth + 1, 1));

  const resetForm = () => {
    setFormParticipantId(''); setFormVisitType('Follow-up');
    setFormScheduledDate(''); setFormSiteId(''); setFormSiteName('');
    setFormInvestigator(''); setFormNotes('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const participant = participants.find(p => p.id === formParticipantId);
    if (!formParticipantId.trim() || !formScheduledDate) return;
    addVisit({
      participantId: formParticipantId.trim(),
      participantName: participant?.name || formParticipantId.trim(),
      trialId: participant?.trialId || '',
      trialName: participant?.trialName || '',
      siteId: formSiteId.trim() || participant?.siteId || '',
      siteName: formSiteName.trim() || participant?.siteName || '',
      visitType: formVisitType,
      scheduledDate: formScheduledDate,
      completedDate: '',
      status: 'Scheduled',
      investigator: formInvestigator.trim(),
      vitals: '',
      notes: formNotes.trim(),
    });
    resetForm();
    setShowAddForm(false);
  };

  const handleVisitUpdate = () => {
    if (!editingVisitId) return;
    updateVisit(editingVisitId, {
      status: editStatus,
      vitals: editVitals,
      notes: editNotes,
      completedDate: editStatus === 'Completed' ? new Date().toISOString().split('T')[0] : '',
    });
    setEditingVisitId(null);
    setEditVitals('');
    setEditNotes('');
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Visit Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Schedule, track, and manage participant visits
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list' ? 'bg-white text-navy-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <List className="w-4 h-4" />
              List
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'calendar' ? 'bg-white text-navy-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
              Calendar
            </button>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-navy-900 text-white text-sm font-medium rounded-lg hover:bg-navy-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Schedule Visit
          </button>
        </div>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Visits', value: counts.total, color: '#1b2f5b' },
          { label: 'Scheduled', value: counts.scheduled, color: '#2563eb' },
          { label: 'Completed', value: counts.completed, color: '#059669' },
          { label: 'Missed', value: counts.missed, color: '#dc2626' },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white rounded-xl p-4 flex items-center gap-3"
            style={{ boxShadow: 'var(--shadow-card)', borderLeft: `3px solid ${kpi.color}` }}
          >
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
            placeholder="Search by participant, visit ID, or investigator..."
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
            {visitStatusOptions.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'list' ? (
        // LIST VIEW
        filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered
              .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
              .map((visit) => {
              const vstStyle = visitStatusStyles[visit.status] || visitStatusStyles.Scheduled;
              const StatusIcon = vstStyle.icon;
              const isPast = visit.scheduledDate < today && visit.status === 'Scheduled';
              return (
                <div
                  key={visit.id}
                  className="bg-white rounded-xl p-5 transition-all duration-200 hover:shadow-md"
                  style={{ boxShadow: 'var(--shadow-card)' }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${vstStyle.bg}`}>
                        <StatusIcon className={`w-5 h-5 ${vstStyle.text}`} strokeWidth={1.8} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-mono text-gray-400">{visit.id}</span>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${vstStyle.bg} ${vstStyle.text}`}>
                            {visit.status}
                          </span>
                          {isPast && (
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-crimson-50 text-crimson-700">
                              Overdue
                            </span>
                          )}
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-navy-50 text-navy-700">
                            {visit.visitType}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">{visit.participantName}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {visit.trialName && `${visit.trialName} · `}
                          {visit.siteName && `${visit.siteName} · `}
                          {visit.investigator && `Dr. ${visit.investigator}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(visit.scheduledDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                      {visit.status === 'Scheduled' && (
                        <button
                          onClick={() => {
                            setEditingVisitId(visit.id);
                            setEditStatus('Completed');
                            setEditVitals(visit.vitals);
                            setEditNotes(visit.notes);
                          }}
                          className="mt-1 text-xs font-medium text-navy-900 hover:underline"
                        >
                          Update Status
                        </button>
                      )}
                    </div>
                  </div>
                  {(visit.vitals || visit.notes) && (
                    <div className="mt-3 pl-13 text-sm text-gray-500 border-t border-gray-50 pt-2">
                      {visit.vitals && <p><span className="font-medium text-gray-600">Vitals:</span> {visit.vitals}</p>}
                      {visit.notes && <p><span className="font-medium text-gray-600">Notes:</span> {visit.notes}</p>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-16 flex flex-col items-center justify-center text-center" style={{ boxShadow: 'var(--shadow-card)' }}>
            <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
              <CalendarIcon className="w-8 h-8 text-gray-300" strokeWidth={1.5} />
            </div>
            <h2 className="text-lg font-semibold text-gray-700 mb-1">
              {searchQuery || statusFilter !== 'All' ? 'No visits match your filters' : 'No Visits Scheduled'}
            </h2>
            <p className="text-sm text-gray-400 max-w-md">
              {searchQuery || statusFilter !== 'All'
                ? 'Try adjusting your search or filter criteria.'
                : 'Click "Schedule Visit" to create the first visit entry.'}
            </p>
          </div>
        )
      ) : (
        // CALENDAR VIEW
        <div className="bg-white rounded-xl" style={{ boxShadow: 'var(--shadow-card)' }}>
          {/* Calendar header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
              <ChevronLeft className="w-4 h-4 text-gray-500" />
            </button>
            <h3 className="text-base font-semibold text-gray-900">
              {MONTHS[calMonth]} {calYear}
            </h3>
            <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-gray-100">
            {DAYS.map(d => (
              <div key={d} className="py-2 text-center text-xs font-semibold text-gray-400 uppercase">{d}</div>
            ))}
          </div>
          {/* Calendar grid */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="min-h-[100px] border-b border-r border-gray-50" />;
              }
              const dayVisits = getVisitsForDay(day);
              const todayDate = new Date();
              const isToday = day === todayDate.getDate() && calMonth === todayDate.getMonth() && calYear === todayDate.getFullYear();
              return (
                <div key={day} className={`min-h-[100px] p-2 border-b border-r border-gray-50 ${isToday ? 'bg-navy-50/30' : ''}`}>
                  <span className={`text-xs font-medium ${isToday ? 'text-navy-900 font-bold' : 'text-gray-500'}`}>
                    {day}
                  </span>
                  <div className="mt-1 space-y-1">
                    {dayVisits.slice(0, 3).map(v => {
                      const vstStyle = visitStatusStyles[v.status] || visitStatusStyles.Scheduled;
                      return (
                        <div key={v.id} className={`text-[10px] px-1.5 py-0.5 rounded ${vstStyle.bg} ${vstStyle.text} font-medium truncate`}>
                          {v.participantName}
                        </div>
                      );
                    })}
                    {dayVisits.length > 3 && (
                      <span className="text-[10px] text-gray-400 font-medium">+{dayVisits.length - 3} more</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Schedule Visit Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" style={{ boxShadow: '0 25px 50px rgba(0,0,0,.15)' }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Schedule New Visit</h2>
              <button onClick={() => { setShowAddForm(false); resetForm(); }} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Participant *</label>
                  {participants.length > 0 ? (
                    <select required value={formParticipantId} onChange={(e) => setFormParticipantId(e.target.value)} className="w-full h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500">
                      <option value="">Select participant</option>
                      {participants.map(p => <option key={p.id} value={p.id}>{p.name} ({p.id})</option>)}
                    </select>
                  ) : (
                    <input type="text" required value={formParticipantId} onChange={(e) => setFormParticipantId(e.target.value)} className="w-full h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500" placeholder="Enter participant ID" />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Visit Type *</label>
                  <select required value={formVisitType} onChange={(e) => setFormVisitType(e.target.value as VisitType)} className="w-full h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500">
                    {visitTypeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Date *</label>
                  <input type="date" required value={formScheduledDate} onChange={(e) => setFormScheduledDate(e.target.value)} className="w-full h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Site ID</label>
                  <input type="text" value={formSiteId} onChange={(e) => setFormSiteId(e.target.value)} className="w-full h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500" placeholder="Auto-filled from participant" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
                  <input type="text" value={formSiteName} onChange={(e) => setFormSiteName(e.target.value)} className="w-full h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500" placeholder="Auto-filled from participant" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Investigator</label>
                  <input type="text" value={formInvestigator} onChange={(e) => setFormInvestigator(e.target.value)} className="w-full h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500" placeholder="Name of assigned investigator" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea value={formNotes} onChange={(e) => setFormNotes(e.target.value)} rows={2} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500 resize-none" placeholder="Visit instructions or notes..." />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowAddForm(false); resetForm(); }} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-navy-900 rounded-lg hover:bg-navy-800 transition-colors">
                  Schedule Visit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Visit Status Modal */}
      {editingVisitId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl w-full max-w-sm mx-4" style={{ boxShadow: '0 25px 50px rgba(0,0,0,.15)' }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Update Visit</h2>
              <button onClick={() => setEditingVisitId(null)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select value={editStatus} onChange={(e) => setEditStatus(e.target.value as VisitStatus)} className="w-full h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500">
                  {visitStatusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vitals</label>
                <input type="text" value={editVitals} onChange={(e) => setEditVitals(e.target.value)} className="w-full h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500" placeholder="BP, pulse, temp..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea value={editNotes} onChange={(e) => setEditNotes(e.target.value)} rows={2} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500 resize-none" placeholder="Completion notes..." />
              </div>
              <div className="flex items-center justify-end gap-3">
                <button onClick={() => setEditingVisitId(null)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
                <button onClick={handleVisitUpdate} className="px-4 py-2 text-sm font-medium text-white bg-navy-900 rounded-lg hover:bg-navy-800 transition-colors">
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
