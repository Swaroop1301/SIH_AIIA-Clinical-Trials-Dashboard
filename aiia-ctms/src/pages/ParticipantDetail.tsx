import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  Calendar,
  FlaskConical,
  Building2,
  AlertTriangle,
  Edit3,
  X,
} from 'lucide-react';
import { useClinical } from '@/data/clinicalStore';
import type { ParticipantStatus } from '@/data/mockData';

const statusStyles: Record<string, { text: string; bg: string }> = {
  Screening: { text: 'text-amber-700', bg: 'bg-amber-50' },
  Enrolled: { text: 'text-teal-700', bg: 'bg-teal-50' },
  Active: { text: 'text-emerald-700', bg: 'bg-emerald-50' },
  Completed: { text: 'text-navy-700', bg: 'bg-navy-50' },
  Withdrawn: { text: 'text-crimson-700', bg: 'bg-crimson-50' },
  Discontinued: { text: 'text-gray-700', bg: 'bg-gray-100' },
};

const visitStatusColors: Record<string, string> = {
  Scheduled: 'bg-blue-500',
  Completed: 'bg-emerald-500',
  Missed: 'bg-crimson-500',
  Cancelled: 'bg-gray-400',
};

const aeSeverityColors: Record<string, { text: string; bg: string }> = {
  Mild: { text: 'text-amber-700', bg: 'bg-amber-50' },
  Moderate: { text: 'text-orange-700', bg: 'bg-orange-50' },
  Severe: { text: 'text-crimson-700', bg: 'bg-crimson-50' },
  'Life-Threatening': { text: 'text-red-800', bg: 'bg-red-100' },
};

const statusOptions: ParticipantStatus[] = ['Screening', 'Enrolled', 'Active', 'Completed', 'Withdrawn', 'Discontinued'];
const tabs = ['Overview', 'Visits', 'Adverse Events', 'Timeline'];

export default function ParticipantDetail() {
  const { id } = useParams<{ id: string }>();
  const { participants, visits, adverseEvents, updateParticipant } = useClinical();
  const [activeTab, setActiveTab] = useState('Overview');
  const [editing, setEditing] = useState(false);
  const [editStatus, setEditStatus] = useState<ParticipantStatus>('Screening');

  const participant = participants.find((p) => p.id === id);

  if (!participant) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-gray-500 text-lg">Participant not found</p>
        <Link to="/app/participants" className="text-navy-900 text-sm mt-2 hover:underline">
          Back to Participants
        </Link>
      </div>
    );
  }

  const status = statusStyles[participant.status] || statusStyles.Active;
  const pVisits = visits.filter(v => v.participantId === participant.id);
  const pAEs = adverseEvents.filter(ae => ae.participantId === participant.id);

  const handleStatusUpdate = () => {
    updateParticipant(participant.id, { status: editStatus });
    setEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        to="/app/participants"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-navy-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Participants
      </Link>

      {/* Participant Header */}
      <div className="bg-white rounded-xl p-6" style={{ boxShadow: 'var(--shadow-card)' }}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-navy-50 flex items-center justify-center shrink-0">
              <User className="w-7 h-7 text-navy-900" strokeWidth={1.8} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-gray-400">{participant.id}</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${status.bg} ${status.text}`}>
                  {participant.status}
                </span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">{participant.name}</h1>
              <p className="text-sm text-gray-500 mt-1">
                {participant.age} years, {participant.gender}
              </p>
            </div>
          </div>
          <button
            onClick={() => { setEditing(true); setEditStatus(participant.status); }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-navy-900 border border-navy-200 rounded-lg hover:bg-navy-50 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit Status
          </button>
        </div>

        {/* Contact + Trial info */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-2">
          {participant.contact && (
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" />
              {participant.contact}
            </span>
          )}
          {participant.email && (
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" />
              {participant.email}
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-9 h-9 rounded-lg bg-navy-50 flex items-center justify-center">
              <FlaskConical className="w-4 h-4 text-navy-900" strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{participant.trialName || '—'}</p>
              <p className="text-xs text-gray-500">Assigned Trial</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-emerald-600" strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{participant.siteName || '—'}</p>
              <p className="text-xs text-gray-500">Site</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-teal-600" strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{pVisits.length}</p>
              <p className="text-xs text-gray-500">Visits</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-9 h-9 rounded-lg bg-crimson-50 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-crimson-600" strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{pAEs.length}</p>
              <p className="text-xs text-gray-500">Adverse Events</p>
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
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Personal Information</h3>
                <dl className="space-y-2">
                  <div className="flex">
                    <dt className="text-sm text-gray-400 w-40">Full Name</dt>
                    <dd className="text-sm text-gray-700">{participant.name}</dd>
                  </div>
                  <div className="flex">
                    <dt className="text-sm text-gray-400 w-40">Age</dt>
                    <dd className="text-sm text-gray-700">{participant.age} years</dd>
                  </div>
                  <div className="flex">
                    <dt className="text-sm text-gray-400 w-40">Gender</dt>
                    <dd className="text-sm text-gray-700">{participant.gender}</dd>
                  </div>
                  <div className="flex">
                    <dt className="text-sm text-gray-400 w-40">Phone</dt>
                    <dd className="text-sm text-gray-700">{participant.contact || '—'}</dd>
                  </div>
                  <div className="flex">
                    <dt className="text-sm text-gray-400 w-40">Email</dt>
                    <dd className="text-sm text-gray-700">{participant.email || '—'}</dd>
                  </div>
                  <div className="flex">
                    <dt className="text-sm text-gray-400 w-40">Participant ID</dt>
                    <dd className="text-sm font-mono text-gray-700">{participant.id}</dd>
                  </div>
                </dl>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Enrollment Details</h3>
                <dl className="space-y-2">
                  <div className="flex">
                    <dt className="text-sm text-gray-400 w-40">Trial</dt>
                    <dd className="text-sm text-gray-700">{participant.trialName || '—'}</dd>
                  </div>
                  <div className="flex">
                    <dt className="text-sm text-gray-400 w-40">Trial ID</dt>
                    <dd className="text-sm font-mono text-gray-700">{participant.trialId || '—'}</dd>
                  </div>
                  <div className="flex">
                    <dt className="text-sm text-gray-400 w-40">Site</dt>
                    <dd className="text-sm text-gray-700">{participant.siteName || '—'}</dd>
                  </div>
                  <div className="flex">
                    <dt className="text-sm text-gray-400 w-40">Enrollment Date</dt>
                    <dd className="text-sm text-gray-700">
                      {new Date(participant.enrollmentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </dd>
                  </div>
                  <div className="flex">
                    <dt className="text-sm text-gray-400 w-40">Status</dt>
                    <dd>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${status.bg} ${status.text}`}>
                        {participant.status}
                      </span>
                    </dd>
                  </div>
                </dl>
                {participant.notes && (
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Notes</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{participant.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'Visits' && (
            <div>
              {pVisits.length > 0 ? (
                <div className="space-y-3">
                  {pVisits.map((visit) => (
                    <div key={visit.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-2.5 h-2.5 rounded-full ${visitStatusColors[visit.status] || 'bg-gray-400'}`} />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{visit.visitType}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(visit.scheduledDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            {visit.investigator && ` · ${visit.investigator}`}
                          </p>
                        </div>
                      </div>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        visit.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' :
                        visit.status === 'Scheduled' ? 'bg-blue-50 text-blue-700' :
                        visit.status === 'Missed' ? 'bg-crimson-50 text-crimson-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {visit.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-400">No visits scheduled for this participant.</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Go to <Link to="/app/visits" className="text-navy-900 hover:underline">Visit Management</Link> to schedule a visit.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'Adverse Events' && (
            <div>
              {pAEs.length > 0 ? (
                <div className="space-y-3">
                  {pAEs.map((ae) => {
                    const sevStyle = aeSeverityColors[ae.severity] || aeSeverityColors.Mild;
                    return (
                      <div key={ae.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-mono text-gray-400">{ae.id}</span>
                              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${sevStyle.bg} ${sevStyle.text}`}>
                                {ae.severity}
                              </span>
                            </div>
                            <p className="text-sm font-medium text-gray-900">{ae.eventDescription}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Onset: {new Date(ae.onsetDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              &middot; Causality: {ae.causality}
                            </p>
                          </div>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            ae.status === 'Open' ? 'bg-crimson-50 text-crimson-700' :
                            ae.status === 'Under Review' ? 'bg-amber-50 text-amber-700' :
                            ae.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {ae.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-400">No adverse events reported for this participant.</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Go to <Link to="/app/adverse-events" className="text-navy-900 hover:underline">Adverse Events</Link> to report an event.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'Timeline' && (
            <div className="space-y-4">
              {/* Enrollment event */}
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 rounded-full mt-1 shrink-0 bg-emerald-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Participant Registered</p>
                  <p className="text-xs text-gray-500">
                    {new Date(participant.enrollmentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
              {/* Visit events */}
              {pVisits
                .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
                .map((visit) => (
                <div key={visit.id} className="flex items-start gap-3">
                  <div className={`w-3 h-3 rounded-full mt-1 shrink-0 ${
                    visit.status === 'Completed' ? 'bg-emerald-500' :
                    visit.status === 'Scheduled' ? 'bg-navy-900' :
                    visit.status === 'Missed' ? 'bg-crimson-500' : 'bg-gray-300'
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{visit.visitType} — {visit.status}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(visit.scheduledDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              ))}
              {/* AE events */}
              {pAEs.map((ae) => (
                <div key={ae.id} className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full mt-1 shrink-0 bg-crimson-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Adverse Event: {ae.eventDescription}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(ae.onsetDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      &middot; {ae.severity}
                    </p>
                  </div>
                </div>
              ))}
              {pVisits.length === 0 && pAEs.length === 0 && (
                <p className="text-sm text-gray-400 pl-6">No additional events recorded yet.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit Status Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl w-full max-w-sm mx-4" style={{ boxShadow: '0 25px 50px rgba(0,0,0,.15)' }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Update Status</h2>
              <button onClick={() => setEditing(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Status</label>
                <select value={editStatus} onChange={(e) => setEditStatus(e.target.value as ParticipantStatus)} className="w-full h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500">
                  {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex items-center justify-end gap-3">
                <button onClick={() => setEditing(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
                <button onClick={handleStatusUpdate} className="px-4 py-2 text-sm font-medium text-white bg-navy-900 rounded-lg hover:bg-navy-800 transition-colors">
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
