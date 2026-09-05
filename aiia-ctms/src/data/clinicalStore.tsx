import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import {
  type Participant,
  type Visit,
  type AdverseEvent,
  type EthicsSubmission,
  type RegulatoryTracker,
  type DocumentItem,
  type DocumentVersion,
  type AuditLogEntry,
  type AuditActionType,
  type AuditModule,
  trials,
  initialEthicsSubmissions,
  initialRegulatoryTrackers,
  initialDocuments,
  initialAuditLogs,
} from './mockData';

// ── Context shape ──

interface ClinicalState {
  participants: Participant[];
  visits: Visit[];
  adverseEvents: AdverseEvent[];
  ethicsSubmissions: EthicsSubmission[];
  regulatoryTrackers: RegulatoryTracker[];
  documents: DocumentItem[];
  auditLogs: AuditLogEntry[];

  addParticipant: (p: Omit<Participant, 'id'>) => Participant;
  updateParticipant: (id: string, updates: Partial<Participant>) => void;
  deleteParticipant: (id: string) => void;

  addVisit: (v: Omit<Visit, 'id'>) => Visit;
  updateVisit: (id: string, updates: Partial<Visit>) => void;
  deleteVisit: (id: string) => void;

  addAdverseEvent: (ae: Omit<AdverseEvent, 'id'>) => AdverseEvent;
  updateAdverseEvent: (id: string, updates: Partial<AdverseEvent>) => void;
  deleteAdverseEvent: (id: string) => void;

  // Meet's Compliance & Governance APIs
  addEthicsSubmission: (sub: Omit<EthicsSubmission, 'id'>) => EthicsSubmission;
  updateEthicsSubmission: (id: string, updates: Partial<EthicsSubmission>) => void;

  updateRegulatoryTracker: (id: string, updates: Partial<RegulatoryTracker>) => void;

  addDocument: (doc: {
    title: string;
    category: DocumentItem['category'];
    trialId: string;
    trialTitle: string;
    author: string;
    effectiveDate: string;
    initialChangeSummary: string;
    fileSize?: string;
    fileName?: string;
  }) => DocumentItem;
  addDocumentVersion: (
    docId: string,
    versionData: {
      versionIncrement: 'minor' | 'major';
      changeSummary: string;
      uploadedBy: string;
      fileSize?: string;
      fileName?: string;
    }
  ) => DocumentVersion | null;
  updateDocumentStatus: (docId: string, status: DocumentItem['status']) => void;

  logAuditAction: (entry: {
    actor: string;
    role: string;
    action: AuditActionType;
    module: AuditModule;
    targetId: string;
    targetName: string;
    details: string;
  }) => AuditLogEntry;

  generateFHIRExport: (trialId: string) => any;
  generateCDISCExport: (trialId: string) => { xml: string; sdtm: any };
}

const ClinicalContext = createContext<ClinicalState | null>(null);

// ── ID & Hash generation helpers ──

let participantCounter = 0;
let visitCounter = 0;
let aeCounter = 0;
let ethicsCounter = 10;
let docCounter = 200;
let auditCounter = 120;

function genParticipantId() {
  participantCounter++;
  return `PRT-${String(participantCounter).padStart(4, '0')}`;
}
function genVisitId() {
  visitCounter++;
  return `VST-${String(visitCounter).padStart(4, '0')}`;
}
function genAEId() {
  aeCounter++;
  return `AE-${String(aeCounter).padStart(4, '0')}`;
}
function genEthicsId() {
  ethicsCounter++;
  return `ETH-2024-${String(ethicsCounter).padStart(3, '0')}`;
}
function genDocId() {
  docCounter++;
  return `DOC-${docCounter}`;
}
function genAuditId() {
  auditCounter++;
  return `AUD-2024-${String(auditCounter).padStart(4, '0')}`;
}

// Pseudo-random deterministic SHA-256 style hash generator for audit chain
function pseudoSha256(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  const tail = Math.abs((hash * 31) ^ 0x5a5a5a5a).toString(16).padStart(8, '0');
  return `${hex}${tail}f7e8d9c0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4`.slice(0, 64);
}

// ── Provider ──

export function ClinicalProvider({ children }: { children: ReactNode }) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [adverseEvents, setAdverseEvents] = useState<AdverseEvent[]>([]);
  const [ethicsSubmissions, setEthicsSubmissions] = useState<EthicsSubmission[]>(initialEthicsSubmissions);
  const [regulatoryTrackers, setRegulatoryTrackers] = useState<RegulatoryTracker[]>(initialRegulatoryTrackers);
  const [documents, setDocuments] = useState<DocumentItem[]>(initialDocuments);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(initialAuditLogs);

  // ── Immutable Audit Log Generator ──
  const logAuditAction = useCallback(
    (entry: {
      actor: string;
      role: string;
      action: AuditActionType;
      module: AuditModule;
      targetId: string;
      targetName: string;
      details: string;
    }): AuditLogEntry => {
      const now = new Date();
      const timestamp = now.toISOString().replace('T', ' ').slice(0, 19);
      const newId = genAuditId();
      const hash = pseudoSha256(`${newId}:${timestamp}:${entry.actor}:${entry.action}:${entry.targetId}`);
      const newAudit: AuditLogEntry = {
        id: newId,
        timestamp,
        ...entry,
        hash,
        ipAddress: '192.168.1.104',
      };
      setAuditLogs((prev) => [newAudit, ...prev]);
      return newAudit;
    },
    []
  );

  // ── Participants ──
  const addParticipant = useCallback((p: Omit<Participant, 'id'>): Participant => {
    const newP: Participant = { ...p, id: genParticipantId() };
    setParticipants((prev) => [newP, ...prev]);
    logAuditAction({
      actor: 'Vedika Sakharkar',
      role: 'Clinical Workflow Specialist',
      action: 'CREATE',
      module: 'Participants',
      targetId: newP.id,
      targetName: newP.name,
      details: `Enrolled participant ${newP.name} (Age: ${newP.age}, Gender: ${newP.gender}) into trial ${newP.trialName}`,
    });
    return newP;
  }, [logAuditAction]);

  const updateParticipant = useCallback((id: string, updates: Partial<Participant>) => {
    setParticipants((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    logAuditAction({
      actor: 'Vedika Sakharkar',
      role: 'Clinical Workflow Specialist',
      action: 'UPDATE',
      module: 'Participants',
      targetId: id,
      targetName: `Participant ${id}`,
      details: `Updated participant record with fields: ${Object.keys(updates).join(', ')}`,
    });
  }, [logAuditAction]);

  const deleteParticipant = useCallback((id: string) => {
    setParticipants((prev) => prev.filter((p) => p.id !== id));
  }, []);

  // ── Visits ──
  const addVisit = useCallback((v: Omit<Visit, 'id'>): Visit => {
    const newV: Visit = { ...v, id: genVisitId() };
    setVisits((prev) => [newV, ...prev]);
    logAuditAction({
      actor: 'Vedika Sakharkar',
      role: 'Clinical Workflow Specialist',
      action: 'CREATE',
      module: 'Visits',
      targetId: newV.id,
      targetName: `${newV.visitType} Visit for ${newV.participantName}`,
      details: `Scheduled ${newV.visitType} visit for ${newV.participantName} on ${newV.scheduledDate}`,
    });
    return newV;
  }, [logAuditAction]);

  const updateVisit = useCallback((id: string, updates: Partial<Visit>) => {
    setVisits((prev) => prev.map((v) => (v.id === id ? { ...v, ...updates } : v)));
    logAuditAction({
      actor: 'Vedika Sakharkar',
      role: 'Clinical Workflow Specialist',
      action: 'UPDATE',
      module: 'Visits',
      targetId: id,
      targetName: `Visit ${id}`,
      details: `Updated visit details: ${Object.keys(updates).join(', ')}`,
    });
  }, [logAuditAction]);

  const deleteVisit = useCallback((id: string) => {
    setVisits((prev) => prev.filter((v) => v.id !== id));
  }, []);

  // ── Adverse Events ──
  const addAdverseEvent = useCallback((ae: Omit<AdverseEvent, 'id'>): AdverseEvent => {
    const newAE: AdverseEvent = { ...ae, id: genAEId() };
    setAdverseEvents((prev) => [newAE, ...prev]);
    logAuditAction({
      actor: ae.reporter || 'Safety Monitor',
      role: 'Safety & Pharmacovigilance Specialist',
      action: 'CREATE',
      module: 'Adverse Events',
      targetId: newAE.id,
      targetName: newAE.eventDescription,
      details: `Reported ${newAE.severity} adverse event for participant ${newAE.participantName} (Trial: ${newAE.trialName}). Status: ${newAE.status}`,
    });
    return newAE;
  }, [logAuditAction]);

  const updateAdverseEvent = useCallback((id: string, updates: Partial<AdverseEvent>) => {
    setAdverseEvents((prev) => prev.map((ae) => (ae.id === id ? { ...ae, ...updates } : ae)));
    logAuditAction({
      actor: 'Meet Patil',
      role: 'Compliance & Safety Reviewer',
      action: 'STATUS_CHANGE',
      module: 'Adverse Events',
      targetId: id,
      targetName: `Adverse Event ${id}`,
      details: `Updated adverse event record: ${Object.keys(updates).join(', ')}`,
    });
  }, [logAuditAction]);

  const deleteAdverseEvent = useCallback((id: string) => {
    setAdverseEvents((prev) => prev.filter((ae) => ae.id !== id));
  }, []);

  // ── Ethics Submissions (Meet's Module) ──
  const addEthicsSubmission = useCallback(
    (sub: Omit<EthicsSubmission, 'id'>): EthicsSubmission => {
      const newSub: EthicsSubmission = { ...sub, id: genEthicsId() };
      setEthicsSubmissions((prev) => [newSub, ...prev]);
      logAuditAction({
        actor: 'Meet Patil',
        role: 'Compliance & Governance Lead',
        action: 'ETHICS_SUBMISSION',
        module: 'Ethics',
        targetId: newSub.id,
        targetName: newSub.protocolNumber,
        details: `Submitted new protocol (${newSub.submissionType}) to ${newSub.committeeName} for trial ${newSub.trialTitle}`,
      });
      return newSub;
    },
    [logAuditAction]
  );

  const updateEthicsSubmission = useCallback(
    (id: string, updates: Partial<EthicsSubmission>) => {
      setEthicsSubmissions((prev) => prev.map((sub) => (sub.id === id ? { ...sub, ...updates } : sub)));
      logAuditAction({
        actor: 'Meet Patil',
        role: 'Compliance & Governance Lead',
        action: updates.status ? 'ETHICS_DECISION' : 'UPDATE',
        module: 'Ethics',
        targetId: id,
        targetName: `Submission ${id}`,
        details: `Ethics review status updated to "${updates.status || 'Updated'}". Comments: ${updates.committeeComments || 'None'}`,
      });
    },
    [logAuditAction]
  );

  // ── Regulatory Tracking (Meet's Module) ──
  const updateRegulatoryTracker = useCallback(
    (id: string, updates: Partial<RegulatoryTracker>) => {
      setRegulatoryTrackers((prev) => prev.map((reg) => (reg.id === id ? { ...reg, ...updates } : reg)));
      logAuditAction({
        actor: 'Meet Patil',
        role: 'Compliance & Governance Lead',
        action: 'VERIFY',
        module: 'Ethics',
        targetId: id,
        targetName: `Regulatory ${id}`,
        details: `Updated regulatory tracking information: ${Object.keys(updates).join(', ')}`,
      });
    },
    [logAuditAction]
  );

  // ── Document Management with Strict Versioning (Meet's Module) ──
  // CRITICAL RULE: Documents are versioned, NEVER overwritten (v1.0 -> v1.1 -> v1.2)
  const addDocument = useCallback(
    (doc: {
      title: string;
      category: DocumentItem['category'];
      trialId: string;
      trialTitle: string;
      author: string;
      effectiveDate: string;
      initialChangeSummary: string;
      fileSize?: string;
      fileName?: string;
    }): DocumentItem => {
      const newId = genDocId();
      const initialVersion: DocumentVersion = {
        version: 'v1.0',
        uploadedBy: doc.author,
        uploadedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        changeSummary: doc.initialChangeSummary || 'Initial document upload.',
        fileSize: doc.fileSize || '1.8 MB',
        fileName: doc.fileName || `${doc.title.replace(/\s+/g, '_')}_v1.0.pdf`,
        fileHash: pseudoSha256(`${newId}:v1.0:${Date.now()}`),
        status: 'Approved',
      };

      const newDoc: DocumentItem = {
        id: newId,
        title: doc.title,
        category: doc.category,
        trialId: doc.trialId,
        trialTitle: doc.trialTitle,
        currentVersion: 'v1.0',
        status: 'Approved',
        author: doc.author,
        effectiveDate: doc.effectiveDate,
        versionHistory: [initialVersion],
      };

      setDocuments((prev) => [newDoc, ...prev]);
      logAuditAction({
        actor: doc.author,
        role: 'Compliance Officer',
        action: 'CREATE',
        module: 'Documents',
        targetId: newDoc.id,
        targetName: newDoc.title,
        details: `Created new document ${newDoc.title} (${newDoc.category}) at initial version v1.0`,
      });
      return newDoc;
    },
    [logAuditAction]
  );

  const addDocumentVersion = useCallback(
    (
      docId: string,
      versionData: {
        versionIncrement: 'minor' | 'major';
        changeSummary: string;
        uploadedBy: string;
        fileSize?: string;
        fileName?: string;
      }
    ): DocumentVersion | null => {
      let createdVersion: DocumentVersion | null = null;

      setDocuments((prev) =>
        prev.map((doc) => {
          if (doc.id !== docId) return doc;

          // Compute next version tag (e.g. v1.1 -> v1.2 or v1.1 -> v2.0)
          const currentParts = doc.currentVersion.replace('v', '').split('.').map(Number);
          let nextVersionTag = 'v1.1';
          if (versionData.versionIncrement === 'major') {
            nextVersionTag = `v${(currentParts[0] || 1) + 1}.0`;
          } else {
            nextVersionTag = `v${currentParts[0] || 1}.${(currentParts[1] || 0) + 1}`;
          }

          const newVersion: DocumentVersion = {
            version: nextVersionTag,
            uploadedBy: versionData.uploadedBy,
            uploadedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
            changeSummary: versionData.changeSummary,
            fileSize: versionData.fileSize || '2.2 MB',
            fileName: versionData.fileName || `${doc.title.replace(/\s+/g, '_')}_${nextVersionTag}.pdf`,
            fileHash: pseudoSha256(`${doc.id}:${nextVersionTag}:${Date.now()}`),
            status: 'Approved',
          };

          createdVersion = newVersion;

          // Mark previous versions as Superseded without overwriting
          const updatedHistory = doc.versionHistory.map((vh) => ({
            ...vh,
            status: 'Superseded' as const,
          }));

          logAuditAction({
            actor: versionData.uploadedBy,
            role: 'Compliance & Governance Lead',
            action: 'VERSION_BUMP',
            module: 'Documents',
            targetId: doc.id,
            targetName: doc.title,
            details: `Strict Version Bump: ${doc.currentVersion} -> ${nextVersionTag}. Reason: ${versionData.changeSummary}. Prior version archived as Superseded.`,
          });

          return {
            ...doc,
            currentVersion: nextVersionTag,
            effectiveDate: new Date().toISOString().slice(0, 10),
            versionHistory: [newVersion, ...updatedHistory],
          };
        })
      );

      return createdVersion;
    },
    [logAuditAction]
  );

  const updateDocumentStatus = useCallback(
    (docId: string, status: DocumentItem['status']) => {
      setDocuments((prev) => prev.map((doc) => (doc.id === docId ? { ...doc, status } : doc)));
      logAuditAction({
        actor: 'Meet Patil',
        role: 'Compliance & Governance Lead',
        action: 'STATUS_CHANGE',
        module: 'Documents',
        targetId: docId,
        targetName: `Document ${docId}`,
        details: `Document lifecycle status changed to ${status}`,
      });
    },
    [logAuditAction]
  );

  // ── Interoperability: FHIR R4 & CDISC Export Engines (Meet's Module) ──
  const generateFHIRExport = useCallback(
    (trialId: string) => {
      const trial = trials.find((t) => t.id === trialId) || trials[0];
      const trialParticipants = participants.filter((p) => p.trialId === trialId);
      const trialAEs = adverseEvents.filter((ae) => ae.trialId === trialId);

      const fhirBundle = {
        resourceType: 'Bundle',
        type: 'collection',
        id: `fhir-aiia-${trial.id.toLowerCase()}`,
        meta: {
          lastUpdated: new Date().toISOString(),
          profile: ['http://hl7.org/fhir/StructureDefinition/Bundle'],
        },
        entry: [
          {
            fullUrl: `urn:uuid:researchstudy-${trial.id}`,
            resource: {
              resourceType: 'ResearchStudy',
              id: trial.id,
              identifier: [
                { system: 'https://ctri.nic.in', value: 'CTRI/2024/03/064218' },
                { system: 'https://aiia.gov.in/protocol', value: trial.protocol },
              ],
              title: trial.title,
              status: trial.status.toLowerCase(),
              phase: {
                coding: [
                  {
                    system: 'http://terminology.hl7.org/CodeSystem/research-study-phase',
                    code: trial.phase.toLowerCase().replace(' ', '-'),
                    display: trial.phase,
                  },
                ],
              },
              category: [
                {
                  coding: [
                    {
                      system: 'http://aiia.gov.in/ayurveda/therapeutic-area',
                      code: trial.therapeuticArea,
                      display: trial.therapeuticArea,
                    },
                  ],
                },
              ],
              condition: [
                {
                  text: trial.therapeuticArea,
                },
              ],
              sponsor: {
                display: trial.sponsor,
              },
              principalInvestigator: {
                display: trial.pi,
              },
              enrollment: [
                {
                  display: `Target: ${trial.targetEnrollment}, Current Enrolled: ${trial.participants || trialParticipants.length}`,
                },
              ],
            },
          },
          ...trialParticipants.map((p) => ({
            fullUrl: `urn:uuid:patient-${p.id}`,
            resource: {
              resourceType: 'Patient',
              id: p.id,
              identifier: [{ system: 'https://aiia.gov.in/subject-id', value: p.id }],
              name: [{ text: p.name, family: p.name.split(' ').slice(-1)[0] }],
              gender: p.gender.toLowerCase(),
              birthDate: `${new Date().getFullYear() - p.age}-01-01`,
              telecom: [
                { system: 'phone', value: p.contact },
                { system: 'email', value: p.email },
              ],
              managingOrganization: {
                display: p.siteName || 'All India Institute of Ayurveda',
              },
            },
          })),
          ...trialAEs.map((ae) => ({
            fullUrl: `urn:uuid:adverseevent-${ae.id}`,
            resource: {
              resourceType: 'AdverseEvent',
              id: ae.id,
              actuality: 'actual',
              severity: {
                coding: [
                  {
                    system: 'http://terminology.hl7.org/CodeSystem/adverse-event-severity',
                    code: ae.severity.toLowerCase(),
                    display: ae.severity,
                  },
                ],
              },
              event: {
                text: ae.eventDescription,
              },
              subject: {
                reference: `urn:uuid:patient-${ae.participantId}`,
                display: ae.participantName,
              },
              date: ae.onsetDate,
              outcome: {
                coding: [
                  {
                    system: 'http://terminology.hl7.org/CodeSystem/adverse-event-outcome',
                    code: ae.outcome.toLowerCase().replace(' ', '-'),
                    display: ae.outcome,
                  },
                ],
              },
              recorder: {
                display: ae.reporter,
              },
            },
          })),
        ],
      };

      logAuditAction({
        actor: 'Meet Patil',
        role: 'Compliance & Interoperability Lead',
        action: 'EXPORT_DATA',
        module: 'Interoperability',
        targetId: trial.id,
        targetName: trial.title,
        details: `Executed GET /api/fhir/export/${trial.id}. Exported HL7 FHIR R4 ResearchStudy bundle with ${fhirBundle.entry.length} resource entries.`,
      });

      return fhirBundle;
    },
    [participants, adverseEvents, logAuditAction]
  );

  const generateCDISCExport = useCallback(
    (trialId: string) => {
      const trial = trials.find((t) => t.id === trialId) || trials[0];
      const trialParticipants = participants.filter((p) => p.trialId === trialId);
      const trialAEs = adverseEvents.filter((ae) => ae.trialId === trialId);

      // CDISC SDTM Datasets
      const sdtmDM = (trialParticipants.length > 0
        ? trialParticipants
        : [
            { id: 'PRT-0001', name: 'Rameshwar Sharma', age: 46, gender: 'Male', siteId: 'SITE-01' },
            { id: 'PRT-0002', name: 'Sunita Devi', age: 39, gender: 'Female', siteId: 'SITE-01' },
          ]
      ).map((p, idx) => ({
        STUDYID: trial.id,
        DOMAIN: 'DM',
        USUBJID: `${trial.id}-${p.id}`,
        SUBJID: p.id,
        RFSTDTC: '2024-01-20',
        RFENDTC: '2024-04-20',
        SITEID: 'SITE-01',
        AGE: p.age,
        AGEU: 'YEARS',
        SEX: p.gender === 'Male' ? 'M' : 'F',
        RACE: 'ASIAN INDIAN',
        ETHNIC: 'NOT HISPANIC OR LATINO',
        ARMCD: idx % 2 === 0 ? 'ASHWAGANDHA_500' : 'PLACEBO',
        ARM: idx % 2 === 0 ? 'Ashwagandha Extract 500mg BID' : 'Placebo Capsule BID',
        COUNTRY: 'IND',
      }));

      const sdtmAE = trialAEs.map((ae, idx) => ({
        STUDYID: trial.id,
        DOMAIN: 'AE',
        USUBJID: `${trial.id}-${ae.participantId}`,
        AESEQ: idx + 1,
        AETERM: ae.eventDescription,
        AEDECOD: ae.eventDescription,
        AEBODSYS: 'Gastrointestinal Disorders',
        AESTDTC: ae.onsetDate,
        AESEV: ae.severity.toUpperCase(),
        AESER: ae.severity === 'Severe' || ae.severity === 'Life-Threatening' ? 'Y' : 'N',
        AEREL: ae.causality.toUpperCase(),
        AEOUT: ae.outcome.toUpperCase(),
      }));

      const sdtmVS = [
        {
          STUDYID: trial.id,
          DOMAIN: 'VS',
          USUBJID: `${trial.id}-PRT-0001`,
          VSTESTCD: 'SYSBP',
          VSTEST: 'Systolic Blood Pressure',
          VSORRES: '124',
          VSORRESU: 'mmHg',
          VSDTC: '2024-01-20T09:30',
          VISIT: 'BASELINE',
        },
        {
          STUDYID: trial.id,
          DOMAIN: 'VS',
          USUBJID: `${trial.id}-PRT-0001`,
          VSTESTCD: 'DIABP',
          VSTEST: 'Diastolic Blood Pressure',
          VSORRES: '82',
          VSORRESU: 'mmHg',
          VSDTC: '2024-01-20T09:30',
          VISIT: 'BASELINE',
        },
        {
          STUDYID: trial.id,
          DOMAIN: 'VS',
          USUBJID: `${trial.id}-PRT-0001`,
          VSTESTCD: 'PULSE',
          VSTEST: 'Pulse Rate',
          VSORRES: '74',
          VSORRESU: 'beats/min',
          VSDTC: '2024-01-20T09:30',
          VISIT: 'BASELINE',
        },
      ];

      const sdtmEX = [
        {
          STUDYID: trial.id,
          DOMAIN: 'EX',
          USUBJID: `${trial.id}-PRT-0001`,
          EXTRT: 'Withania somnifera Extract (Ashwagandha)',
          EXDOSE: '500',
          EXDOSU: 'mg',
          EXDOSFRM: 'CAPSULE',
          EXROUTE: 'ORAL',
          EXSTDTC: '2024-01-20',
          EXENDTC: '2024-04-20',
          EXFAST: 'N',
        },
      ];

      // Generate CDISC ODM XML string
      const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
<ODM xmlns="http://www.cdisc.org/ns/odm/v1.3"
     FileType="Snapshot"
     FileOID="ODM.AIIA.${trial.id}.${Date.now()}"
     CreationDateTime="${new Date().toISOString()}"
     ODMVersion="1.3.2">
  <ClinicalData StudyOID="${trial.id}" MetaDataVersionOID="MDV.001">
    <SubjectData SubjectKey="${sdtmDM[0]?.USUBJID || 'SUBJ-01'}">
      <StudyEventData StudyEventOID="SE.BASELINE">
        <FormData FormOID="FORM.DM">
          <ItemGroupData ItemGroupOID="IG.DM" ItemGroupDataSeq="1">
            <ItemDataString ItemOID="IT.SUBJID" Value="${sdtmDM[0]?.SUBJID || 'PRT-0001'}"/>
            <ItemDataInteger ItemOID="IT.AGE" Value="${sdtmDM[0]?.AGE || 45}"/>
            <ItemDataString ItemOID="IT.SEX" Value="${sdtmDM[0]?.SEX || 'M'}"/>
            <ItemDataString ItemOID="IT.ARM" Value="${sdtmDM[0]?.ARM || 'Ashwagandha Extract'}"/>
          </ItemGroupData>
        </FormData>
      </StudyEventData>
    </SubjectData>
  </ClinicalData>
</ODM>`;

      logAuditAction({
        actor: 'Meet Patil',
        role: 'Compliance & Interoperability Lead',
        action: 'EXPORT_DATA',
        module: 'Interoperability',
        targetId: trial.id,
        targetName: trial.title,
        details: `Executed GET /api/cdisc/export/${trial.id}. Exported CDISC ODM XML and SDTM packages across 4 domains: DM (Demographics), AE (Adverse Events), VS (Vital Signs), EX (Exposure).`,
      });

      return {
        xml: xmlString,
        sdtm: {
          DM: sdtmDM,
          AE: sdtmAE,
          VS: sdtmVS,
          EX: sdtmEX,
        },
      };
    },
    [participants, adverseEvents, logAuditAction]
  );

  return (
    <ClinicalContext.Provider
      value={{
        participants,
        visits,
        adverseEvents,
        ethicsSubmissions,
        regulatoryTrackers,
        documents,
        auditLogs,
        addParticipant,
        updateParticipant,
        deleteParticipant,
        addVisit,
        updateVisit,
        deleteVisit,
        addAdverseEvent,
        updateAdverseEvent,
        deleteAdverseEvent,
        addEthicsSubmission,
        updateEthicsSubmission,
        updateRegulatoryTracker,
        addDocument,
        addDocumentVersion,
        updateDocumentStatus,
        logAuditAction,
        generateFHIRExport,
        generateCDISCExport,
      }}
    >
      {children}
    </ClinicalContext.Provider>
  );
}

// ── Hook ──

export function useClinical(): ClinicalState {
  const ctx = useContext(ClinicalContext);
  if (!ctx) throw new Error('useClinical must be used inside ClinicalProvider');
  return ctx;
}
