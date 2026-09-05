import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import Landing from '@/pages/Landing';
import Dashboard from '@/pages/Dashboard';
import Trials from '@/pages/Trials';
import TrialDetail from '@/pages/TrialDetail';
import Sites from '@/pages/Sites';
import SiteDetail from '@/pages/SiteDetail';
import {
  Participants,
  Visits,
  AdverseEvents,
  Ethics,
  Documents,
  AuditTrail,
  Reports,
} from '@/pages/Placeholders';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<Landing />} />

        {/* Protected/App Routes */}
        <Route path="/app" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="trials" element={<Trials />} />
          <Route path="trials/:id" element={<TrialDetail />} />
          <Route path="sites" element={<Sites />} />
          <Route path="sites/:id" element={<SiteDetail />} />
          <Route path="participants" element={<Participants />} />
          <Route path="visits" element={<Visits />} />
          <Route path="adverse-events" element={<AdverseEvents />} />
          <Route path="ethics" element={<Ethics />} />
          <Route path="documents" element={<Documents />} />
          <Route path="audit" element={<AuditTrail />} />
          <Route path="reports" element={<Reports />} />
        </Route>

        {/* Redirect old routes to new /app paths */}
        <Route path="/trials" element={<Navigate to="/app/trials" replace />} />
        <Route path="/trials/:id" element={<Navigate to={`/app/trials`} replace />} />
        <Route path="/sites" element={<Navigate to="/app/sites" replace />} />
        <Route path="/sites/:id" element={<Navigate to={`/app/sites`} replace />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
