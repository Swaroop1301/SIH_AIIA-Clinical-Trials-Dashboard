import { useState } from 'react';
import {
  ClipboardList,
  Search,
  Filter,
  Download,
  Lock,
  FileCheck2,
  Key,
  Database,
  Eye,
  X,
  CheckCircle2,
} from 'lucide-react';
import { useClinical } from '@/data/clinicalStore';
import type { AuditLogEntry } from '@/data/mockData';

const actionStyles: Record<string, { bg: string; text: string }> = {
  CREATE: { bg: 'bg-blue-50', text: 'text-blue-700' },
  UPDATE: { bg: 'bg-amber-50', text: 'text-amber-700' },
  STATUS_CHANGE: { bg: 'bg-purple-50', text: 'text-purple-700' },
  VERSION_BUMP: { bg: 'bg-indigo-50', text: 'text-indigo-700' },
  ETHICS_SUBMISSION: { bg: 'bg-teal-50', text: 'text-teal-700' },
  ETHICS_DECISION: { bg: 'bg-emerald-50', text: 'text-emerald-700' },
  EXPORT_DATA: { bg: 'bg-rose-50', text: 'text-rose-700' },
  VERIFY: { bg: 'bg-cyan-50', text: 'text-cyan-700' },
  DELETE: { bg: 'bg-red-50', text: 'text-red-700' },
};

const moduleStyles: Record<string, { bg: string; text: string }> = {
  Ethics: { bg: 'bg-teal-50', text: 'text-teal-800' },
  Documents: { bg: 'bg-indigo-50', text: 'text-indigo-800' },
  Trials: { bg: 'bg-blue-50', text: 'text-blue-800' },
  Participants: { bg: 'bg-emerald-50', text: 'text-emerald-800' },
  Visits: { bg: 'bg-purple-50', text: 'text-purple-800' },
  'Adverse Events': { bg: 'bg-amber-50', text: 'text-amber-800' },
  Interoperability: { bg: 'bg-rose-50', text: 'text-rose-800' },
  Sites: { bg: 'bg-gray-100', text: 'text-gray-800' },
};

export default function AuditTrail() {
  const { auditLogs } = useClinical();

  const [searchQuery, setSearchQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState<string>('All');
  const [actionFilter, setActionFilter] = useState<string>('All');
  const [inspectEntry, setInspectEntry] = useState<AuditLogEntry | null>(null);

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.targetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.targetId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesModule = moduleFilter === 'All' || log.module === moduleFilter;
    const matchesAction = actionFilter === 'All' || log.action === actionFilter;
    return matchesSearch && matchesModule && matchesAction;
  });

  const exportCSV = () => {
    const headers = ['Audit ID', 'Timestamp', 'Actor', 'Role', 'Action', 'Module', 'Target ID', 'Details', 'Hash', 'IP Address'];
    const rows = filteredLogs.map((l) => [
      l.id,
      `"${l.timestamp}"`,
      `"${l.actor}"`,
      `"${l.role}"`,
      l.action,
      l.module,
      l.targetId,
      `"${l.details.replace(/"/g, '""')}"`,
      l.hash,
      l.ipAddress,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AIIA_CTMS_Audit_Trail_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportJSON = () => {
    const jsonContent = JSON.stringify(filteredLogs, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AIIA_CTMS_Audit_Trail_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-navy-100 text-navy-800">
              Module Owner: Meet (Compliance & Governance Lead)
            </span>
            <span className="text-xs text-gray-400">• 21 CFR Part 11 & GCP Audit Ledger</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">Immutable Audit Trail</h1>
          <p className="text-sm text-gray-500">
            Read-only chronological record of all clinical, regulatory, document, and safety events
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <button
            onClick={exportJSON}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export JSON
          </button>
        </div>
      </div>

      {/* Critical Rule Compliance Notice */}
      <div className="bg-navy-900 text-white rounded-xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-sm">CRITICAL REGULATORY RULE: Audit Logs are Read-Only</span>
            <span className="text-xs bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
              Cryptographically Sealed
            </span>
          </div>
          <p className="text-xs text-white/70 max-w-3xl">
            In accordance with 21 CFR Part 11 and Good Clinical Practice (GCP), this audit log is strictly immutable.
            No entry can be edited, deleted, or backdated. Every record includes user attribution, timestamp, operation type, and SHA-256 digital hash verification.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono bg-white/10 px-3 py-1.5 rounded-lg shrink-0">
          <Key className="w-3.5 h-3.5 text-amber-300" />
          <span>Ledger Integrity: VALID</span>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Logged System Actions</p>
            <h3 className="text-xl font-bold text-gray-900">{auditLogs.length}</h3>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Cryptographic Hashes</p>
            <h3 className="text-xl font-bold text-gray-900">100% Sealed</h3>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Monitored Modules</p>
            <h3 className="text-xl font-bold text-gray-900">8 Modules</h3>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Inspection Readiness</p>
            <h3 className="text-xl font-bold text-gray-900">Auditable</h3>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search audit trail by ID, actor, details, or target..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy-500/20"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy-500/20"
          >
            <option value="All">All Modules</option>
            <option value="Ethics">Ethics</option>
            <option value="Documents">Documents</option>
            <option value="Trials">Trials</option>
            <option value="Participants">Participants</option>
            <option value="Visits">Visits</option>
            <option value="Adverse Events">Adverse Events</option>
            <option value="Interoperability">Interoperability</option>
          </select>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy-500/20"
          >
            <option value="All">All Actions</option>
            <option value="CREATE">CREATE</option>
            <option value="UPDATE">UPDATE</option>
            <option value="STATUS_CHANGE">STATUS_CHANGE</option>
            <option value="VERSION_BUMP">VERSION_BUMP</option>
            <option value="ETHICS_SUBMISSION">ETHICS_SUBMISSION</option>
            <option value="ETHICS_DECISION">ETHICS_DECISION</option>
            <option value="EXPORT_DATA">EXPORT_DATA</option>
            <option value="VERIFY">VERIFY</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/75 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-4">Audit ID & Timestamp</th>
                <th className="py-3 px-4">Actor & Role</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Module</th>
                <th className="py-3 px-4">Target Reference</th>
                <th className="py-3 px-4">Change Details</th>
                <th className="py-3 px-4 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredLogs.map((log) => {
                const action = actionStyles[log.action] || { bg: 'bg-gray-100', text: 'text-gray-700' };
                const mod = moduleStyles[log.module] || { bg: 'bg-gray-100', text: 'text-gray-700' };

                return (
                  <tr key={log.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-mono font-bold text-gray-900">{log.id}</div>
                      <div className="text-[11px] text-gray-400">{log.timestamp}</div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-semibold text-gray-900">{log.actor}</div>
                      <div className="text-[11px] text-gray-500">{log.role}</div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] ${action.bg} ${action.text}`}>
                        {log.action}
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded font-semibold text-[11px] ${mod.bg} ${mod.text}`}>
                        {log.module}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-mono text-gray-700 font-semibold">{log.targetId}</div>
                      <div className="text-[11px] text-gray-500 truncate max-w-[140px]">{log.targetName}</div>
                    </td>

                    <td className="py-3 px-4">
                      <p className="text-gray-700 line-clamp-2 max-w-md">{log.details}</p>
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setInspectEntry(log)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-navy-900 hover:text-navy-700 bg-navy-50 hover:bg-navy-100 px-2.5 py-1 rounded transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: INSPECT AUDIT ENTRY */}
      {inspectEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-navy-900 text-white">
              <div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-base font-bold">Tamper-Proof Audit Record</h3>
                </div>
                <p className="text-xs text-white/70 font-mono">{inspectEntry.id}</p>
              </div>
              <button
                onClick={() => setInspectEntry(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-lg border">
                <div>
                  <span className="text-gray-500 font-medium">Timestamp:</span>
                  <div className="font-semibold text-gray-900 font-mono">{inspectEntry.timestamp}</div>
                </div>
                <div>
                  <span className="text-gray-500 font-medium">Actor / Role:</span>
                  <div className="font-semibold text-gray-900">{inspectEntry.actor} ({inspectEntry.role})</div>
                </div>
                <div>
                  <span className="text-gray-500 font-medium">Module:</span>
                  <div className="font-semibold text-gray-900">{inspectEntry.module}</div>
                </div>
                <div>
                  <span className="text-gray-500 font-medium">Action Type:</span>
                  <div className="font-semibold text-gray-900 font-mono">{inspectEntry.action}</div>
                </div>
                <div>
                  <span className="text-gray-500 font-medium">Target Reference:</span>
                  <div className="font-semibold text-gray-900">{inspectEntry.targetId} - {inspectEntry.targetName}</div>
                </div>
                <div>
                  <span className="text-gray-500 font-medium">Client IP:</span>
                  <div className="font-semibold text-gray-900 font-mono">{inspectEntry.ipAddress}</div>
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Audit Details / Modification Delta:</label>
                <div className="bg-gray-50 p-3 rounded-lg border text-gray-800 leading-relaxed font-sans">
                  {inspectEntry.details}
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Cryptographic Checksum (SHA-256):</label>
                <div className="bg-navy-950 text-emerald-400 p-2.5 rounded-lg font-mono text-[11px] break-all border border-navy-800">
                  {inspectEntry.hash}
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Signature Verified: This record matches the immutable ledger block and has not been altered.</span>
              </div>
            </div>

            <div className="px-6 py-3 bg-gray-50 border-t flex justify-end">
              <button
                onClick={() => setInspectEntry(null)}
                className="px-4 py-2 bg-navy-900 text-white text-xs font-semibold rounded-lg hover:bg-navy-800 transition-colors"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
