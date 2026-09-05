# AIIA Clinical Trials Dashboard — Software Plan

## Team Overview
- **Ayush** — ML + Backend (AI Risk Engine)
- **Hrishikesh** — Backend Lead (Database + Authentication)
- **Aryan** — API + Frontend Integration Lead
- **Meet** — Compliance & Governance Backend Developer
- **Swaroop** — Lead UI/UX + Dashboard Developer (Frontend)
- **Vedika** — Clinical Workflow Frontend Developer

## Swaroop's Assignment

### Modules
- Design system (colors, typography, components) — React, Tailwind, shadcn/ui, Recharts
- Main layout: topbar, sidebar, content area
- Main dashboard: KPIs + charts
- Trial management & site management UI

### Dashboard KPIs
- Active Trials, Participants, Active Sites
- Adverse Events, Pending Approvals
- Expiring Documents, Protocol Deviations

### Deliverables
- Design system + responsive layout
- Dashboard, Trials UI, Trial 360 view, Sites UI

### Viva Statement
"I designed and built the main frontend experience — dashboard, trial management, site management and the reusable design system."

## Responsibility Matrix (Swaroop's involvement)
- Dashboard: PRIMARY OWNER
- UI Design System: PRIMARY OWNER
- Trials: PRIMARY OWNER (frontend)
- Sites: PRIMARY OWNER (frontend)
- Frontend Integration: SUPPORT
- Testing: ALL MEMBERS

## WHO WORKS WITH WHOM
- Hrishikesh to Everyone
- Aryan to Frontend + Backend
- Meet to Hrishikesh and Swaroop
- Ayush to Swaroop (feeds ML insights into dashboard)

## 6-Week Development Plan

### W1 - Foundation
Goal: project skeleton is live with auth working end-to-end
Swaroop: Design system, layout, sidebar, dashboard skeleton

### W2 - Core CTMS
Goal: Login to Dashboard to Trial to Site to Participant to Visit flow works
Build out Trials, Sites, Participants and Visits — full CRUD + UI

### W3 - Clinical + Safety
Goal: Participant to Visit to eCRF to Adverse Event to Safety Review flow works

### W4 - Compliance
Goal: ethics, regulatory and document workflows are fully auditable

### W5 - AI + Interop
Goal: ML risk insights appear live on the dashboard; data exports validate

### W6 - Demo Ready
Goal: stable, demo-ready build — no new features
Bug fixing, security checks, responsive design, demo data, deployment

## API Endpoints (Backend - for frontend integration)
- POST /api/auth/login
- GET /api/trials   POST /api/trials
- GET /api/participants/{id}
- GET /api/dashboard/overview
- POST /api/clinical-data
- POST /api/adverse-events
- POST /api/ethics/submissions
- GET /api/regulatory
- POST /api/ml/recruitment-risk
- GET /api/ml/insights/{trial_id}
- GET /api/fhir/export/{trial_id}
- GET /api/cdisc/export/{trial_id}

## Tech Stack
- Frontend: React, TailwindCSS, shadcn/ui, Recharts
- Backend: FastAPI (Python)
- Database: PostgreSQL + SQLAlchemy
- Auth: JWT + RBAC (9 roles)
- ML: Python ML pipeline
