import { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  Filter,
  History,
  Download,
  ShieldCheck,
  FileCheck,
  Tag,
  X,
  UploadCloud,
  Layers,
} from 'lucide-react';
import { useClinical } from '@/data/clinicalStore';
import {
  trials,
  type DocumentItem,
  type DocumentCategory,
} from '@/data/mockData';

const categoryStyles: Record<string, { bg: string; text: string }> = {
  Protocol: { bg: 'bg-navy-50', text: 'text-navy-800' },
  'Investigator Brochure': { bg: 'bg-purple-50', text: 'text-purple-800' },
  'Informed Consent Form (ICF)': { bg: 'bg-teal-50', text: 'text-teal-800' },
  'Ethics Approval': { bg: 'bg-emerald-50', text: 'text-emerald-800' },
  'Regulatory Clearance / CTRI': { bg: 'bg-blue-50', text: 'text-blue-800' },
  'Case Report Form (CRF)': { bg: 'bg-amber-50', text: 'text-amber-800' },
  'Lab Certification': { bg: 'bg-rose-50', text: 'text-rose-800' },
};

const categoryList: DocumentCategory[] = [
  'Protocol',
  'Investigator Brochure',
  'Informed Consent Form (ICF)',
  'Ethics Approval',
  'Regulatory Clearance / CTRI',
  'Case Report Form (CRF)',
  'Lab Certification',
];

export default function Documents() {
  const { documents, addDocument, addDocumentVersion } = useClinical();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTrial, setSelectedTrial] = useState<string>('All');

  // Modals
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [versionHistoryDoc, setVersionHistoryDoc] = useState<DocumentItem | null>(null);
  const [newVersionDoc, setNewVersionDoc] = useState<DocumentItem | null>(null);

  // New Document Form
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState<DocumentCategory>('Protocol');
  const [docTrialId, setDocTrialId] = useState(trials[0]?.id || '');
  const [docAuthor, setDocAuthor] = useState('Meet Patil (Compliance Officer)');
  const [docNotes, setDocNotes] = useState('Initial version release');
  const [docEffectiveDate, setDocEffectiveDate] = useState(new Date().toISOString().slice(0, 10));

  // New Version Form
  const [versionIncrement, setVersionIncrement] = useState<'minor' | 'major'>('minor');
  const [versionChangeSummary, setVersionChangeSummary] = useState('');
  const [versionUploader, setVersionUploader] = useState('Meet Patil (Compliance Officer)');

  // Filtered documents
  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.trialTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    const matchesTrial = selectedTrial === 'All' || doc.trialId === selectedTrial;
    return matchesSearch && matchesCategory && matchesTrial;
  });

  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    const trial = trials.find((t) => t.id === docTrialId);
    if (!docTitle.trim()) return;

    addDocument({
      title: docTitle.trim(),
      category: docCategory,
      trialId: docTrialId,
      trialTitle: trial?.title || 'Ayurveda Clinical Trial',
      author: docAuthor,
      effectiveDate: docEffectiveDate,
      initialChangeSummary: docNotes,
      fileSize: '1.9 MB',
      fileName: `${docTitle.trim().replace(/\s+/g, '_')}_v1.0.pdf`,
    });

    setShowUploadModal(false);
    setDocTitle('');
    setDocNotes('Initial version release');
  };

  const handleBumpVersion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVersionDoc || !versionChangeSummary.trim()) return;

    addDocumentVersion(newVersionDoc.id, {
      versionIncrement,
      changeSummary: versionChangeSummary.trim(),
      uploadedBy: versionUploader,
      fileSize: '2.4 MB',
      fileName: `${newVersionDoc.title.replace(/\s+/g, '_')}_bump.pdf`,
    });

    setNewVersionDoc(null);
    setVersionChangeSummary('');
  };

  const triggerDownload = (fileName: string) => {
    const blob = new Blob([`AIIA CTMS Controlled Document: ${fileName}\nIntegrity Hash: Verified\n21 CFR Part 11 Compliant`], {
      type: 'text/plain',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
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
            <span className="text-xs text-gray-400">• Strict Versioning & Audit Control</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">Document Management System</h1>
          <p className="text-sm text-gray-500">
            Versioned clinical trial binder, regulatory filings, ICFs, and immutable revision histories
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-navy-900 text-white text-sm font-medium rounded-lg hover:bg-navy-800 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Upload New Document
        </button>
      </div>

      {/* Critical Rule Compliance Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900">
          <span className="font-bold">CRITICAL REGULATORY RULE (Software Plan Page 5):</span> Documents are strictly
          version-controlled and <span className="font-semibold underline">never overwritten</span> (e.g.{' '}
          <span className="font-mono font-bold">v1.0 → v1.1 → v1.2 → v2.0</span>). When a revision is uploaded, prior versions
          remain accessible in the immutable version history ledger with tamper-evident digital hashes.
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Controlled Documents</p>
            <h3 className="text-xl font-bold text-gray-900">{documents.length}</h3>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Archived Revisions</p>
            <h3 className="text-xl font-bold text-gray-900">
              {documents.reduce((acc, d) => acc + d.versionHistory.length, 0)}
            </h3>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Approved Protocols</p>
            <h3 className="text-xl font-bold text-gray-900">
              {documents.filter((d) => d.category === 'Protocol' && d.status === 'Approved').length}
            </h3>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Document Categories</p>
            <h3 className="text-xl font-bold text-gray-900">{categoryList.length}</h3>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents by title, ID, author, or trial..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy-500/20"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy-500/20"
          >
            <option value="All">All Categories</option>
            {categoryList.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <select
            value={selectedTrial}
            onChange={(e) => setSelectedTrial(e.target.value)}
            className="h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy-500/20"
          >
            <option value="All">All Trials</option>
            {trials.map((t) => (
              <option key={t.id} value={t.id}>
                {t.id}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Document Table / Cards */}
      <div className="space-y-3">
        {filteredDocs.map((doc) => {
          const cat = categoryStyles[doc.category] || { bg: 'bg-gray-50', text: 'text-gray-800' };
          const activeVersion = doc.versionHistory[0] || {
            version: doc.currentVersion,
            fileSize: '2.1 MB',
            fileName: `${doc.title}.pdf`,
          };

          return (
            <div
              key={doc.id}
              className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-gray-500">{doc.id}</span>
                    <span className="text-gray-300">•</span>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${cat.bg} ${cat.text}`}>
                      {doc.category}
                    </span>
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-navy-900 text-white">
                      {doc.currentVersion}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium">
                      {doc.status}
                    </span>
                    <span className="text-xs text-gray-400">({doc.versionHistory.length} revisions)</span>
                  </div>

                  <h3 className="text-base font-bold text-gray-900 mt-1">{doc.title}</h3>

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-gray-500 pt-1">
                    <div>
                      <span className="font-semibold text-gray-700">Trial:</span> {doc.trialTitle}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Author:</span> {doc.author}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Effective Date:</span> {doc.effectiveDate}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">File:</span> {activeVersion.fileName} (
                      {activeVersion.fileSize})
                    </div>
                  </div>

                  {/* Latest Change summary */}
                  {activeVersion.changeSummary && (
                    <p className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-100 mt-2">
                      <span className="font-semibold text-gray-700">Latest Changelog ({activeVersion.version}): </span>
                      {activeVersion.changeSummary}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    onClick={() => setVersionHistoryDoc(doc)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-lg transition-colors"
                  >
                    <History className="w-3.5 h-3.5" />
                    Version History ({doc.versionHistory.length})
                  </button>

                  <button
                    onClick={() => {
                      setNewVersionDoc(doc);
                      setVersionChangeSummary('');
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-navy-50 hover:bg-navy-100 text-navy-800 text-xs font-semibold rounded-lg transition-colors"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    Upload New Version
                  </button>

                  <button
                    onClick={() => triggerDownload(activeVersion.fileName)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-navy-900 hover:bg-navy-800 text-white text-xs font-medium rounded-lg transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: UPLOAD NEW DOCUMENT */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
              <div>
                <h3 className="text-base font-bold text-gray-900">Upload New Controlled Document</h3>
                <p className="text-xs text-gray-500">Initializes at v1.0 in the document repository</p>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 transition-colors text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDocument} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Clinical Study Protocol Amendment 02"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  className="w-full h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Category *</label>
                  <select
                    value={docCategory}
                    onChange={(e) => setDocCategory(e.target.value as DocumentCategory)}
                    className="w-full h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy-500/20"
                  >
                    {categoryList.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Associated Trial *</label>
                  <select
                    value={docTrialId}
                    onChange={(e) => setDocTrialId(e.target.value)}
                    className="w-full h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy-500/20"
                  >
                    {trials.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.id}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Author / Uploader</label>
                  <input
                    type="text"
                    required
                    value={docAuthor}
                    onChange={(e) => setDocAuthor(e.target.value)}
                    className="w-full h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Effective Date</label>
                  <input
                    type="date"
                    required
                    value={docEffectiveDate}
                    onChange={(e) => setDocEffectiveDate(e.target.value)}
                    className="w-full h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Initial Version Change Summary</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Summary of document purpose or baseline details..."
                  value={docNotes}
                  onChange={(e) => setDocNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy-500/20 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium text-white bg-navy-900 rounded-lg hover:bg-navy-800 transition-colors"
                >
                  Upload & Register v1.0
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: UPLOAD NEW VERSION (STRICT VERSIONING) */}
      {newVersionDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-navy-900 text-white">
              <div>
                <h3 className="text-base font-bold">Upload New Document Version</h3>
                <p className="text-xs text-white/70">
                  Current Version: <span className="font-mono font-bold text-amber-300">{newVersionDoc.currentVersion}</span>
                </p>
              </div>
              <button
                onClick={() => setNewVersionDoc(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleBumpVersion} className="p-6 space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900">
                <span className="font-bold">Strict Versioning Policy:</span> Version {newVersionDoc.currentVersion} will be
                archived as <span className="font-semibold">Superseded</span> and permanently preserved. It will{' '}
                <span className="underline font-bold">never be overwritten</span>.
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Version Increment Type *</label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs cursor-pointer ${
                      versionIncrement === 'minor'
                        ? 'border-navy-900 bg-navy-50/50 font-bold text-navy-900'
                        : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="increment"
                      checked={versionIncrement === 'minor'}
                      onChange={() => setVersionIncrement('minor')}
                      className="text-navy-900"
                    />
                    Minor Revision (e.g. v1.1 → v1.2)
                  </label>
                  <label
                    className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs cursor-pointer ${
                      versionIncrement === 'major'
                        ? 'border-navy-900 bg-navy-50/50 font-bold text-navy-900'
                        : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="increment"
                      checked={versionIncrement === 'major'}
                      onChange={() => setVersionIncrement('major')}
                      className="text-navy-900"
                    />
                    Major Amendment (e.g. v1.1 → v2.0)
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Uploader Name</label>
                <input
                  type="text"
                  required
                  value={versionUploader}
                  onChange={(e) => setVersionUploader(e.target.value)}
                  className="w-full h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Change Summary & Justification *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail the exact clinical/regulatory modifications made in this revision..."
                  value={versionChangeSummary}
                  onChange={(e) => setVersionChangeSummary(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy-500/20 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setNewVersionDoc(null)}
                  className="px-4 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-navy-900 rounded-lg hover:bg-navy-800 transition-colors"
                >
                  Confirm Version Bump
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VERSION HISTORY TIMELINE */}
      {versionHistoryDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
              <div>
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-navy-900" />
                  <h3 className="text-base font-bold text-gray-900">Immutable Version History</h3>
                </div>
                <p className="text-xs text-gray-500">{versionHistoryDoc.title}</p>
              </div>
              <button
                onClick={() => setVersionHistoryDoc(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 transition-colors text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <p className="text-xs text-gray-500">
                All revisions below are cryptographically sealed in accordance with 21 CFR Part 11. None of these records can be altered or erased.
              </p>

              <div className="relative border-l-2 border-navy-100 ml-4 pl-6 space-y-6">
                {versionHistoryDoc.versionHistory.map((ver, idx) => (
                  <div key={idx} className="relative">
                    {/* Timeline dot */}
                    <div
                      className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 border-white ${
                        ver.status === 'Approved' ? 'bg-emerald-600' : 'bg-gray-400'
                      }`}
                    />

                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-navy-900 text-white">
                            {ver.version}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded font-medium ${
                              ver.status === 'Approved'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            {ver.status}
                          </span>
                        </div>
                        <span className="text-[11px] text-gray-500 font-medium">{ver.uploadedAt}</span>
                      </div>

                      <p className="text-xs text-gray-800 font-medium">{ver.changeSummary}</p>

                      <div className="text-[11px] text-gray-500 space-y-1 pt-1 border-t border-gray-200">
                        <div className="flex justify-between">
                          <span>Uploaded by: <strong className="text-gray-700">{ver.uploadedBy}</strong></span>
                          <span>File: <strong className="text-gray-700">{ver.fileName} ({ver.fileSize})</strong></span>
                        </div>
                        <div className="font-mono text-[10px] text-gray-400 truncate">
                          SHA-256: {ver.fileHash}
                        </div>
                      </div>

                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => triggerDownload(ver.fileName)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-navy-900 hover:text-navy-700"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download this revision
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 py-3 bg-gray-50 border-t flex justify-end">
              <button
                onClick={() => setVersionHistoryDoc(null)}
                className="px-4 py-2 bg-navy-900 text-white text-xs font-semibold rounded-lg hover:bg-navy-800 transition-colors"
              >
                Close History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
