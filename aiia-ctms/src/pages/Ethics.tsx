import { useState } from 'react';
import {
  ShieldCheck,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  FileText,
  ExternalLink,
  Download,
  Copy,
  Check,
  Building,
  Award,
  X,
  Database,
} from 'lucide-react';
import { useClinical } from '@/data/clinicalStore';
import {
  trials,
  type EthicsSubmission,
  type EthicsSubmissionStatus,
  type EthicsSubmissionType,
  type EthicsReviewType,
  type EthicsRiskLevel,
} from '@/data/mockData';

const statusStyles: Record<string, { text: string; bg: string; border: string }> = {
  Approved: { text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  'Conditional Approval': { text: 'text-teal-700', bg: 'bg-teal-50', border: 'border-teal-200' },
  'Under Review': { text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
  Submitted: { text: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
  'Revision Required': { text: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200' },
  Rejected: { text: 'text-crimson-700', bg: 'bg-crimson-50', border: 'border-crimson-200' },
};

const riskBadge: Record<string, { text: string; bg: string }> = {
  'Minimal Risk': { text: 'text-emerald-700', bg: 'bg-emerald-50' },
  'Low Risk': { text: 'text-blue-700', bg: 'bg-blue-50' },
  'High Risk / Interventional': { text: 'text-purple-700', bg: 'bg-purple-50' },
};

export default function Ethics() {
  const {
    ethicsSubmissions,
    regulatoryTrackers,
    addEthicsSubmission,
    updateEthicsSubmission,
    generateFHIRExport,
    generateCDISCExport,
  } = useClinical();

  const [activeTab, setActiveTab] = useState<'ethics' | 'regulatory' | 'interop'>('ethics');

  // Ethics Tab States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [trialFilter, setTrialFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSubForReview, setSelectedSubForReview] = useState<EthicsSubmission | null>(null);
  const [certificateSub, setCertificateSub] = useState<EthicsSubmission | null>(null);

  // New Submission Form
  const [formTrialId, setFormTrialId] = useState(trials[0]?.id || '');
  const [formProtocolNum, setFormProtocolNum] = useState('');
  const [formCommitteeName, setFormCommitteeName] = useState('AIIA Institutional Ethics Committee (IEC-Ayush)');
  const [formCommitteeCode, setFormCommitteeCode] = useState('EC/NEW/INST/2023/1482');
  const [formSubmissionType, setFormSubmissionType] = useState<EthicsSubmissionType>('Initial Protocol');
  const [formReviewType, setFormReviewType] = useState<EthicsReviewType>('Full Board Review');
  const [formRiskLevel, setFormRiskLevel] = useState<EthicsRiskLevel>('Low Risk');
  const [formPiName, setFormPiName] = useState('Prof. (Dr.) Rajesh Kotecha');
  const [formComments, setFormComments] = useState('');

  // Review Decision Form
  const [reviewStatus, setReviewStatus] = useState<EthicsSubmissionStatus>('Approved');
  const [reviewLetterRef, setReviewLetterRef] = useState('');
  const [reviewValidUntil, setReviewValidUntil] = useState('');
  const [reviewComments, setReviewComments] = useState('');

  // Interoperability Tab States
  const [interopTrialId, setInteropTrialId] = useState(trials[0]?.id || 'AIIA-CT-2024-001');
  const [interopFormat, setInteropFormat] = useState<'fhir' | 'cdisc-xml' | 'cdisc-sdtm'>('fhir');
  const [copied, setCopied] = useState(false);

  // Filtered submissions
  const filteredSubmissions = ethicsSubmissions.filter((sub) => {
    const matchesSearch =
      sub.protocolNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.trialTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.committeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.piName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || sub.status === statusFilter;
    const matchesTrial = trialFilter === 'All' || sub.trialId === trialFilter;
    return matchesSearch && matchesStatus && matchesTrial;
  });

  const kpis = {
    total: ethicsSubmissions.length,
    approved: ethicsSubmissions.filter((s) => s.status === 'Approved').length,
    underReview: ethicsSubmissions.filter((s) => s.status === 'Under Review' || s.status === 'Submitted').length,
    registeredCTRI: regulatoryTrackers.filter((r) => r.ctriStatus === 'Registered').length,
  };

  const handleAddSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    const trial = trials.find((t) => t.id === formTrialId);
    if (!formProtocolNum.trim()) return;

    addEthicsSubmission({
      trialId: formTrialId,
      trialTitle: trial?.title || 'Ayurveda Clinical Protocol',
      protocolNumber: formProtocolNum.trim(),
      committeeName: formCommitteeName,
      committeeCode: formCommitteeCode,
      submissionType: formSubmissionType,
      reviewType: formReviewType,
      riskLevel: formRiskLevel,
      piName: formPiName,
      submissionDate: new Date().toISOString().slice(0, 10),
      status: 'Under Review',
      committeeComments: formComments,
      documentsAttached: ['Study_Protocol.pdf', 'Patient_Consent_Form.pdf', 'Investigator_Brochure.pdf'],
    });

    setShowAddModal(false);
    setFormProtocolNum('');
    setFormComments('');
  };

  const handleReviewDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubForReview) return;

    updateEthicsSubmission(selectedSubForReview.id, {
      status: reviewStatus,
      approvalLetterRef: reviewLetterRef || `AIIA/IEC/${new Date().getFullYear()}/APP/${Math.floor(100 + Math.random() * 900)}`,
      approvalDate: new Date().toISOString().slice(0, 10),
      validUntil: reviewValidUntil || '2025-12-31',
      committeeComments: reviewComments || 'Reviewed and approved in accordance with NDCT Rules 2019.',
    });

    setSelectedSubForReview(null);
    setReviewComments('');
    setReviewLetterRef('');
    setReviewValidUntil('');
  };

  // FHIR / CDISC export data
  const fhirData = generateFHIRExport(interopTrialId);
  const cdiscData = generateCDISCExport(interopTrialId);

  const getExportContent = () => {
    if (interopFormat === 'fhir') return JSON.stringify(fhirData, null, 2);
    if (interopFormat === 'cdisc-xml') return cdiscData.xml;
    return JSON.stringify(cdiscData.sdtm, null, 2);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getExportContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const content = getExportContent();
    const ext = interopFormat === 'cdisc-xml' ? 'xml' : 'json';
    const blob = new Blob([content], { type: ext === 'xml' ? 'application/xml' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${interopTrialId}_${interopFormat}.${ext}`;
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
            <span className="text-xs text-gray-400">• NDCT Rules 2019 & CDISC/FHIR Ready</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">Ethics & Regulatory Compliance</h1>
          <p className="text-sm text-gray-500">
            Institutional Ethics Committee (IEC) review workflow, CTRI registry compliance, and regulatory export engines
          </p>
        </div>

        {activeTab === 'ethics' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-navy-900 text-white text-sm font-medium rounded-lg hover:bg-navy-800 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Ethics Submission
          </button>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Protocol Submissions</p>
            <h3 className="text-xl font-bold text-gray-900">{kpis.total}</h3>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">IEC Cleared Protocols</p>
            <h3 className="text-xl font-bold text-gray-900">{kpis.approved}</h3>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Pending Ethics Review</p>
            <h3 className="text-xl font-bold text-gray-900">{kpis.underReview}</h3>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">CTRI Registered Trials</p>
            <h3 className="text-xl font-bold text-gray-900">{kpis.registeredCTRI} / {regulatoryTrackers.length}</h3>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-200 gap-6">
        <button
          onClick={() => setActiveTab('ethics')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'ethics'
              ? 'border-navy-900 text-navy-900'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          IEC / IRB Submissions & Workflow
        </button>
        <button
          onClick={() => setActiveTab('regulatory')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'regulatory'
              ? 'border-navy-900 text-navy-900'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Building className="w-4 h-4" />
          Regulatory & CTRI Tracking (NDCT 2019)
        </button>
        <button
          onClick={() => setActiveTab('interop')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'interop'
              ? 'border-navy-900 text-navy-900'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Database className="w-4 h-4" />
          CDISC & FHIR Interoperability Export
        </button>
      </div>

      {/* TAB 1: ETHICS SUBMISSIONS & REVIEW WORKFLOW */}
      {activeTab === 'ethics' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search protocol number, PI, committee, or trial..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy-500/20"
              >
                <option value="All">All Statuses</option>
                <option value="Approved">Approved</option>
                <option value="Under Review">Under Review</option>
                <option value="Conditional Approval">Conditional Approval</option>
                <option value="Revision Required">Revision Required</option>
                <option value="Rejected">Rejected</option>
              </select>
              <select
                value={trialFilter}
                onChange={(e) => setTrialFilter(e.target.value)}
                className="h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy-500/20"
              >
                <option value="All">All Trials</option>
                {trials.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.id} - {t.title.slice(0, 30)}...
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Submissions List */}
          <div className="space-y-3">
            {filteredSubmissions.map((sub) => {
              const status = statusStyles[sub.status] || statusStyles['Under Review'];
              const risk = riskBadge[sub.riskLevel] || riskBadge['Low Risk'];

              return (
                <div
                  key={sub.id}
                  className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-gray-500">{sub.id}</span>
                        <span className="text-gray-300">•</span>
                        <span className="font-semibold text-sm text-navy-900">{sub.protocolNumber}</span>
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${status.bg} ${status.text} ${status.border}`}>
                          {sub.status}
                        </span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${risk.bg} ${risk.text}`}>
                          {sub.riskLevel}
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                          {sub.submissionType}
                        </span>
                      </div>

                      <h4 className="text-base font-semibold text-gray-900">{sub.trialTitle}</h4>

                      <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-gray-500 pt-1">
                        <div>
                          <span className="font-medium text-gray-700">IEC:</span> {sub.committeeName}
                          <span className="ml-1 text-gray-400 font-mono">({sub.committeeCode})</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">PI:</span> {sub.piName}
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Submitted:</span> {sub.submissionDate}
                        </div>
                        {sub.validUntil && (
                          <div className="text-emerald-700 font-medium">
                            Valid Until: {sub.validUntil}
                          </div>
                        )}
                      </div>

                      {sub.committeeComments && (
                        <p className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-100 mt-2">
                          <span className="font-medium text-gray-700">Committee Comments: </span>
                          {sub.committeeComments}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {sub.status === 'Approved' && (
                        <button
                          onClick={() => setCertificateSub(sub)}
                          className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
                        >
                          <Award className="w-3.5 h-3.5" />
                          View Certificate
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setSelectedSubForReview(sub);
                          setReviewStatus(sub.status);
                          setReviewComments(sub.committeeComments || '');
                          setReviewLetterRef(sub.approvalLetterRef || '');
                          setReviewValidUntil(sub.validUntil || '2025-12-31');
                        }}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-lg transition-colors"
                      >
                        Review / Update Status
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: REGULATORY & CTRI TRACKER (NDCT RULES 2019) */}
      {activeTab === 'regulatory' && (
        <div className="space-y-6">
          <div className="bg-navy-900 text-white p-5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-semibold">New Drugs and Clinical Trials (NDCT) Rules, 2019 Compliance</h3>
              </div>
              <p className="text-xs text-white/70 mt-1 max-w-2xl">
                Statutory regulatory governance module under CDSCO (Govt of India). Ensures compulsory prospective registration on Clinical Trials Registry - India (CTRI), Ethics Committee validation, and 24-hour SAE reporting compliance.
              </p>
            </div>
            <a
              href="https://ctri.nic.in/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-xs font-medium rounded-lg transition-colors shrink-0"
            >
              Verify on CTRI Portal <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {regulatoryTrackers.map((reg) => (
              <div key={reg.id} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-navy-900 bg-navy-50 px-2 py-0.5 rounded">
                        {reg.ctriNumber}
                      </span>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {reg.ctriStatus}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-gray-900 mt-2">{reg.trialTitle}</h4>
                    <p className="text-xs text-gray-500 font-mono mt-0.5">{reg.trialId}</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-gray-600 bg-gray-50 p-3.5 rounded-lg">
                  <div>
                    <span className="font-semibold text-gray-700">Public Title:</span> {reg.publicTitle}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Scientific Title:</span> {reg.scientificTitle}
                  </div>
                  <div className="flex justify-between pt-1">
                    <span>
                      <span className="font-semibold text-gray-700">CDSCO Permission:</span> {reg.cdscoPermissionNumber}
                    </span>
                    <span>
                      <span className="font-semibold text-gray-700">Registered Date:</span> {reg.registrationDate}
                    </span>
                  </div>
                </div>

                {/* Statutory Checklist */}
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    NDCT 2019 Regulatory Verification Checklist
                  </h5>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs p-2 rounded bg-gray-50">
                      <span className="text-gray-700">Prospective CTRI registration before 1st subject</span>
                      <span className={`font-semibold ${reg.checklist.prospectiveRegistration ? 'text-emerald-700' : 'text-amber-600'}`}>
                        {reg.checklist.prospectiveRegistration ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs p-2 rounded bg-gray-50">
                      <span className="text-gray-700">IEC registered with CDSCO (EC/NEW/INST/2023)</span>
                      <span className="font-semibold text-emerald-700">Compliant</span>
                    </div>
                    <div className="flex items-center justify-between text-xs p-2 rounded bg-gray-50">
                      <span className="text-gray-700">24h Serious Adverse Event (SAE) reporting protocol</span>
                      <span className="font-semibold text-emerald-700">Active</span>
                    </div>
                    <div className="flex items-center justify-between text-xs p-2 rounded bg-gray-50">
                      <span className="text-gray-700">Participant compensation guarantee (Rule 39, 40, 42)</span>
                      <span className="font-semibold text-emerald-700">Enforced</span>
                    </div>
                    <div className="flex items-center justify-between text-xs p-2 rounded bg-gray-50">
                      <span className="text-gray-700">Ministry of Ayush GCP Guidelines adherence</span>
                      <span className="font-semibold text-emerald-700">Audited</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CDISC & FHIR INTEROPERABILITY EXPORT */}
      {activeTab === 'interop' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded">
                    Interoperability Layer (Page 2 & 5 of Software Plan)
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mt-1">Clinical Data Interoperability & Regulatory Export</h3>
                <p className="text-xs text-gray-500">
                  Export live trial data directly into HL7 FHIR (R4) and CDISC ODM / SDTM (DM, AE, VS, EX domains) formats.
                </p>
              </div>

              {/* Trial Selector */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-gray-700 whitespace-nowrap">Select Trial:</label>
                <select
                  value={interopTrialId}
                  onChange={(e) => setInteropTrialId(e.target.value)}
                  className="h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy-500/20"
                >
                  {trials.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.id} - {t.title.slice(0, 32)}...
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Format Switcher & Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setInteropFormat('fhir')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    interopFormat === 'fhir'
                      ? 'bg-navy-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  HL7 FHIR R4 Bundle (JSON)
                </button>
                <button
                  onClick={() => setInteropFormat('cdisc-xml')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    interopFormat === 'cdisc-xml'
                      ? 'bg-navy-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  CDISC ODM v1.3.2 (XML)
                </button>
                <button
                  onClick={() => setInteropFormat('cdisc-sdtm')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    interopFormat === 'cdisc-sdtm'
                      ? 'bg-navy-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  CDISC SDTM Datasets (DM, AE, VS, EX)
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-lg transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-navy-900 hover:bg-navy-800 text-white text-xs font-medium rounded-lg transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Package
                </button>
              </div>
            </div>

            {/* API Endpoint Banner */}
            <div className="p-3 bg-gray-50 rounded-lg text-xs font-mono text-gray-700 flex items-center justify-between border border-gray-200">
              <span>
                <span className="text-emerald-700 font-bold">GET</span>{' '}
                {interopFormat === 'fhir' ? `/api/fhir/export/${interopTrialId}` : `/api/cdisc/export/${interopTrialId}`}
              </span>
              <span className="text-gray-400 font-sans text-[11px]">Specification: 21 CFR Part 11 & GCP Compliant</span>
            </div>

            {/* Code Viewer */}
            <div className="relative bg-navy-950 text-gray-200 rounded-xl p-4 font-mono text-xs overflow-x-auto max-h-[460px] scrollbar-thin">
              <pre>{getExportContent()}</pre>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: NEW ETHICS SUBMISSION */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
              <div>
                <h3 className="text-base font-bold text-gray-900">New Ethics Committee Submission</h3>
                <p className="text-xs text-gray-500">Submit clinical trial protocol for IEC/IRB approval</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 transition-colors text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmission} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Clinical Trial *</label>
                <select
                  value={formTrialId}
                  onChange={(e) => setFormTrialId(e.target.value)}
                  className="w-full h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy-500/20"
                >
                  {trials.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.id} - {t.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Protocol Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AIIA/CLIN/ASH/2024/02"
                    value={formProtocolNum}
                    onChange={(e) => setFormProtocolNum(e.target.value)}
                    className="w-full h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Submission Type *</label>
                  <select
                    value={formSubmissionType}
                    onChange={(e) => setFormSubmissionType(e.target.value as EthicsSubmissionType)}
                    className="w-full h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy-500/20"
                  >
                    <option value="Initial Protocol">Initial Protocol</option>
                    <option value="Protocol Amendment">Protocol Amendment</option>
                    <option value="Annual Continuing Review">Annual Continuing Review</option>
                    <option value="Safety Notification">Safety Notification</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Review Type *</label>
                  <select
                    value={formReviewType}
                    onChange={(e) => setFormReviewType(e.target.value as EthicsReviewType)}
                    className="w-full h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy-500/20"
                  >
                    <option value="Full Board Review">Full Board Review</option>
                    <option value="Expedited Review">Expedited Review</option>
                    <option value="Exemption">Exemption</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Risk Category *</label>
                  <select
                    value={formRiskLevel}
                    onChange={(e) => setFormRiskLevel(e.target.value as EthicsRiskLevel)}
                    className="w-full h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy-500/20"
                  >
                    <option value="Minimal Risk">Minimal Risk</option>
                    <option value="Low Risk">Low Risk</option>
                    <option value="High Risk / Interventional">High Risk / Interventional</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Ethics Committee *</label>
                  <input
                    type="text"
                    required
                    value={formCommitteeName}
                    onChange={(e) => setFormCommitteeName(e.target.value)}
                    className="w-full h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">CDSCO Registration Code</label>
                  <input
                    type="text"
                    required
                    value={formCommitteeCode}
                    onChange={(e) => setFormCommitteeCode(e.target.value)}
                    className="w-full h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Principal Investigator</label>
                <input
                  type="text"
                  required
                  value={formPiName}
                  onChange={(e) => setFormPiName(e.target.value)}
                  className="w-full h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Submission Notes</label>
                <textarea
                  rows={2}
                  placeholder="Additional summary of protocol changes or justifications..."
                  value={formComments}
                  onChange={(e) => setFormComments(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy-500/20 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium text-white bg-navy-900 rounded-lg hover:bg-navy-800 transition-colors"
                >
                  Submit Protocol
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: REVIEW DECISION / STATUS UPDATE */}
      {selectedSubForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
              <div>
                <h3 className="text-base font-bold text-gray-900">Record Ethics Committee Decision</h3>
                <p className="text-xs text-gray-500">{selectedSubForReview.protocolNumber}</p>
              </div>
              <button
                onClick={() => setSelectedSubForReview(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 transition-colors text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleReviewDecision} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Decision Status *</label>
                <select
                  value={reviewStatus}
                  onChange={(e) => setReviewStatus(e.target.value as EthicsSubmissionStatus)}
                  className="w-full h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy-500/20"
                >
                  <option value="Approved">Approved</option>
                  <option value="Conditional Approval">Conditional Approval</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Revision Required">Revision Required</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Approval Letter Ref No</label>
                <input
                  type="text"
                  placeholder="e.g. AIIA/IEC/2024/APP/042"
                  value={reviewLetterRef}
                  onChange={(e) => setReviewLetterRef(e.target.value)}
                  className="w-full h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Validity Expiration Date</label>
                <input
                  type="date"
                  value={reviewValidUntil}
                  onChange={(e) => setReviewValidUntil(e.target.value)}
                  className="w-full h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Committee Comments / Provisos</label>
                <textarea
                  rows={3}
                  value={reviewComments}
                  onChange={(e) => setReviewComments(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy-500/20 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedSubForReview(null)}
                  className="px-4 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium text-white bg-navy-900 rounded-lg hover:bg-navy-800 transition-colors"
                >
                  Save Decision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: APPROVAL CERTIFICATE VIEWER */}
      {certificateSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-navy-900 text-white">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold">Institutional Ethics Clearance Certificate</h3>
              </div>
              <button
                onClick={() => setCertificateSub(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-8 space-y-6 text-gray-800">
              <div className="text-center border-b pb-4">
                <h4 className="text-lg font-serif font-bold text-navy-900">{certificateSub.committeeName}</h4>
                <p className="text-xs text-gray-500 mt-1">
                  CDSCO Registration No: <span className="font-mono font-semibold">{certificateSub.committeeCode}</span>
                </p>
                <p className="text-[11px] text-gray-400">All India Institute of Ayurveda, Sarita Vihar, New Delhi - 110076</p>
              </div>

              <div className="text-xs leading-relaxed space-y-3">
                <p>
                  This is to certify that the clinical study protocol entitled{' '}
                  <span className="font-bold text-navy-900">"{certificateSub.trialTitle}"</span> (Protocol No:{' '}
                  <span className="font-mono font-semibold">{certificateSub.protocolNumber}</span>), submitted by Principal Investigator{' '}
                  <span className="font-semibold">{certificateSub.piName}</span>, was reviewed in accordance with the New Drugs and Clinical Trials Rules, 2019 and Ministry of Ayush GCP guidelines.
                </p>
                <div className="bg-gray-50 p-3 rounded-lg border grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-gray-500">Certificate Reference:</span>{' '}
                    <span className="font-mono font-semibold text-gray-900">{certificateSub.approvalLetterRef || 'AIIA/IEC/2023/APP/089'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Review Category:</span>{' '}
                    <span className="font-semibold text-gray-900">{certificateSub.reviewType}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Date of Grant:</span>{' '}
                    <span className="font-semibold text-gray-900">{certificateSub.approvalDate || certificateSub.submissionDate}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Valid Through:</span>{' '}
                    <span className="font-semibold text-emerald-700">{certificateSub.validUntil || '2024-12-04'}</span>
                  </div>
                </div>
                <p className="text-gray-600 text-[11px] italic">
                  Approval is subject to continuing annual review and prompt reporting of any Serious Adverse Events (SAEs) within 24 hours of occurrence.
                </p>
              </div>

              <div className="flex justify-between items-end pt-6 border-t border-gray-100 text-xs">
                <div className="text-center">
                  <div className="w-32 border-b border-gray-400 mb-1"></div>
                  <p className="font-semibold text-gray-700">Member Secretary</p>
                  <p className="text-[10px] text-gray-400">IEC (Ayush)</p>
                </div>
                <div className="text-center">
                  <div className="w-32 border-b border-gray-400 mb-1"></div>
                  <p className="font-semibold text-gray-700">Chairman</p>
                  <p className="text-[10px] text-gray-400">Institutional Ethics Committee</p>
                </div>
              </div>
            </div>

            <div className="px-6 py-3 bg-gray-50 border-t flex justify-end">
              <button
                onClick={() => setCertificateSub(null)}
                className="px-4 py-2 bg-navy-900 text-white text-xs font-semibold rounded-lg hover:bg-navy-800 transition-colors"
              >
                Close Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
