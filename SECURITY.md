# KisanSetu Security Architecture & Policy

> **Smart India Hackathon (SIH PS 26132)**  
> *Strengthening Market Linkages and Price Discovery for Agricultural Produce*

---

## 1. Overview & Threat Model

KisanSetu is an omnichannel agri-trading system comprising:
1. **Frontend**: Next.js 16 App Router (exported statically with `output: 'export'` for high-availability GitHub Pages edge hosting).
2. **Backend**: FastAPI (Python 3.12) REST API with SQLModel / PostGIS ORM, YOLOv8 computer vision grading engine, and automated milestone escrow settlement rails.

---

## 2. Authentication & Authorization

### 2.1 JWT Session Management
- **Cryptographic Signing**: HS256 algorithm with strict minimum-32-byte secret key enforcement in production (`SECRET_KEY`).
- **Stateless Verification**: Bearer tokens passed via standard HTTP headers (`Authorization: Bearer <token>`) and synchronised with secure cookies (`SameSite=Lax`).
- **Token Expiry**: Configurable TTL (default 7 days for mobile field connectivity).

### 2.2 Role-Based Access Control (RBAC)
KisanSetu enforces strict stakeholder separation across 6 distinct personas:

| Stakeholder Role | Access Permissions | Permitted Portal Routes |
|---|---|---|
| `FARMER` | List harvest lots, review buyer bids, accept contracts, receive escrow DBT | `/farmer/*` |
| `BUYER` | Place tenders, verify AI assays, lock escrow funds, confirm weighbridge delivery | `/buyer/*` |
| `ORGANIZATION` / `FPO` | Manage smallholder clusters, consolidate milk-run logistics, e-NWR warehouse bays | `/fpo/*` |
| `TRANSPORTATION` | Accept haulage dispatches, verify pickup/delivery OTPs, claim fuel advances | `/transportation/*` |
| `WAREHOUSE` | Manage bay capacity, monitor sensor telemetry, issue e-NWR warehouse receipts | `/warehouse/*` |
| `ADMIN` | Dispute arbitration, audit logs, stakeholder management, system governance | `/admin/*` (All portals) |

---

## 3. Static Export Route Guards

Because Next.js `middleware.ts` does not execute in static export mode (`output: 'export'`), KisanSetu employs client-side `<ProtectedRoute>` layout boundaries at each portal root:
- `frontend/app/farmer/layout.tsx`
- `frontend/app/buyer/layout.tsx`
- `frontend/app/fpo/layout.tsx`
- `frontend/app/transportation/layout.tsx`
- `frontend/app/warehouse/layout.tsx`
- `frontend/app/admin/layout.tsx`

Unauthenticated users or users with mismatched roles are redirected to `/login?redirectTo=...` or `/unauthorized`.

---

## 4. API Endpoints Security Hardening

- **User Auditing (`GET /api/auth/users`)**: Restricted strictly to `ADMIN` roles. Responses use the `UserPublic` Pydantic schema which strips all password hashes and cryptographic secrets.
- **e-KYC Modification (`POST /api/auth/kyc/{user_id}`)**: Restricts modification to the verified account owner (`current_user.id == user_id`) or system administrators.
- **Password Verification (`verify_password`)**: Strictly uses `bcrypt.checkpw`. Insecure plaintext and unsalted hash fallback mechanisms are completely eliminated.
- **CORS Allowlist**: Configurable via `BACKEND_CORS_ORIGINS` environment variable, pre-configured to allow local dev environments and the official GitHub Pages deployment domain (`https://prze8969.github.io`).

---

## 5. Production Deployment Checklist

Before deploying KisanSetu to a production environment:

1. [ ] Set `ENV=production` in the backend environment.
2. [ ] Generate a secure 256-bit random string for `SECRET_KEY` (e.g., `openssl rand -hex 32`).
3. [ ] Set `NEXT_PUBLIC_API_BASE_URL` to your production backend URL (e.g., `https://api.kisansetu.in`).
4. [ ] Set `NEXT_PUBLIC_DEMO_MODE=false` if pre-filled demo quick-selection is not desired.
5. [ ] Provide valid API keys for `OPENROUTESERVICE_API_KEY`, `GST_API_KEY`, and WhatsApp Business API credentials.
6. [ ] Connect a managed PostgreSQL database with PostGIS extensions.
