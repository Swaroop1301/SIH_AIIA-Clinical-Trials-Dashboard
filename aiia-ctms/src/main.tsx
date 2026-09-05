import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ClinicalProvider } from '@/data/clinicalStore'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClinicalProvider>
      <App />
    </ClinicalProvider>
  </StrictMode>,
)
