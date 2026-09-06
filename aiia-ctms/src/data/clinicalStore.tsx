import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type {
  Participant, ParticipantStatus, Gender,
  Visit, VisitStatus, VisitType,
  AdverseEvent, AESeverity, AEStatus, AECausality, AEOutcome,
} from './mockData';

// ── Context shape ──

interface ClinicalState {
  participants: Participant[];
  visits: Visit[];
  adverseEvents: AdverseEvent[];

  addParticipant: (p: Omit<Participant, 'id'>) => Participant;
  updateParticipant: (id: string, updates: Partial<Participant>) => void;
  deleteParticipant: (id: string) => void;

  addVisit: (v: Omit<Visit, 'id'>) => Visit;
  updateVisit: (id: string, updates: Partial<Visit>) => void;
  deleteVisit: (id: string) => void;

  addAdverseEvent: (ae: Omit<AdverseEvent, 'id'>) => AdverseEvent;
  updateAdverseEvent: (id: string, updates: Partial<AdverseEvent>) => void;
  deleteAdverseEvent: (id: string) => void;
}

const ClinicalContext = createContext<ClinicalState | null>(null);

// ── ID generation ──

let participantCounter = 0;
let visitCounter = 0;
let aeCounter = 0;

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

// ── Provider ──

export function ClinicalProvider({ children }: { children: ReactNode }) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [adverseEvents, setAdverseEvents] = useState<AdverseEvent[]>([]);

  // Participants
  const addParticipant = useCallback((p: Omit<Participant, 'id'>): Participant => {
    const newP: Participant = { ...p, id: genParticipantId() };
    setParticipants(prev => [newP, ...prev]);
    return newP;
  }, []);

  const updateParticipant = useCallback((id: string, updates: Partial<Participant>) => {
    setParticipants(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const deleteParticipant = useCallback((id: string) => {
    setParticipants(prev => prev.filter(p => p.id !== id));
  }, []);

  // Visits
  const addVisit = useCallback((v: Omit<Visit, 'id'>): Visit => {
    const newV: Visit = { ...v, id: genVisitId() };
    setVisits(prev => [newV, ...prev]);
    return newV;
  }, []);

  const updateVisit = useCallback((id: string, updates: Partial<Visit>) => {
    setVisits(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v));
  }, []);

  const deleteVisit = useCallback((id: string) => {
    setVisits(prev => prev.filter(v => v.id !== id));
  }, []);

  // Adverse Events
  const addAdverseEvent = useCallback((ae: Omit<AdverseEvent, 'id'>): AdverseEvent => {
    const newAE: AdverseEvent = { ...ae, id: genAEId() };
    setAdverseEvents(prev => [newAE, ...prev]);
    return newAE;
  }, []);

  const updateAdverseEvent = useCallback((id: string, updates: Partial<AdverseEvent>) => {
    setAdverseEvents(prev => prev.map(ae => ae.id === id ? { ...ae, ...updates } : ae));
  }, []);

  const deleteAdverseEvent = useCallback((id: string) => {
    setAdverseEvents(prev => prev.filter(ae => ae.id !== id));
  }, []);

  return (
    <ClinicalContext.Provider value={{
      participants, visits, adverseEvents,
      addParticipant, updateParticipant, deleteParticipant,
      addVisit, updateVisit, deleteVisit,
      addAdverseEvent, updateAdverseEvent, deleteAdverseEvent,
    }}>
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
