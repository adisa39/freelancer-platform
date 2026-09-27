# BF Blessy — Pioneer Platform Frontend

**Tunatafsiri kwa ubora** — Africa's Translation Job Marketplace.

Full-stack Next.js 16 (App Router) frontend, redesigned and adapted to the **Pioneer Platform** Express/MongoDB backend.

---

## Architecture

```
Frontend (Next.js 16)          Backend (Express/Node)
localhost:3000          ←→     localhost:5000/api
                               (pioneer-platform package)
```

---

## Pages & Backend Mapping

| Route | Description | Backend API |
|-------|-------------|-------------|
| `/` | Homepage — hero, categories, how it works | Static |
| `/jobs` | Job board with search & filters | `GET /api/jobs` |
| `/post-job` | Post a new job (client or pioneer) | `POST /api/jobs` |
| `/pioneers` | Browse pioneer directory | `GET /api/users` |
| `/services` | Translation service categories | Static |
| `/about` | Company info, timeline, team | Static |
| `/contact` | Quote request + message form | `POST /api/quotes` `POST /api/contact` |
| `/login` | Login with JWT | `POST /api/auth/login` |
| `/register` | Register as client or pioneer | `POST /api/auth/register` |
| `/dashboard` | Orders, applications, payments | `GET /api/users/stats` `GET /api/jobs/mine/list` `GET /api/payments/mine` |

---

## Quick Start

```bash
# 1. Start the Pioneer Platform backend (port 5000)
cd ../pioneer-platform
cp .env.example .env   # set MONGODB_URI + JWT_SECRET
npm run dev

# 2. Start the Next.js frontend (port 3000)
cd ../bfblessy
cp .env.local.example .env.local
npm install
npm run dev
```

`.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
MONGODB_URI=mongodb://localhost:27017/bfblessy
JWT_SECRET=your_secret_here
```

---

## API Client

All backend calls go through `src/lib/api.ts`:

```ts
import { authApi, jobsApi, usersApi, applicationsApi, paymentsApi } from '@/lib/api';

// Auth
const { data } = await authApi.login({ email, password });
tokenHelpers.set(data.accessToken);

// Jobs board  
const jobs = await jobsApi.list({ status: 'open', category: 'Legal Translation' });

// Post a job
await jobsApi.create({ title, description, budget, paymentType, milestones, ... });

// Browse pioneers
const pioneers = await usersApi.pioneers({ skillLevel: 'expert', skills: 'Swahili' });

// Invite pioneer
await jobsApi.invite(jobId, pioneerId);

// Apply to job
await applicationsApi.apply(jobId, { coverLetter, proposedRate, estimatedDuration });

// Payments
await paymentsApi.initiate(jobId, { amount, milestoneId });
await paymentsApi.release(paymentId);
```

---

## Token Flow

```
Register/Login → GET accessToken + refreshToken
→ Store in localStorage via tokenHelpers.set()
→ Every API call sends: Authorization: Bearer <token>
→ Refresh via POST /api/auth/refresh when expired
```

---

## Brand System

Extracted from the BF Blessy logo:

| Token | Value | Usage |
|-------|-------|-------|
| `--sand` | `#C8B882` | "BF" brand, prices, highlights |
| `--blue` | `#2D7DD2` | "Blessy" brand, CTAs, links |
| `--blue-bright` | `#3D8FE8` | Hover states, accents |
| `--green` | `#4CAF50` | Circuit nodes, success, verified |
| `--black` | `#060A0F` | Page background |
| `--dark` | `#0C1219` | Section backgrounds |

Fonts: **Sora** (display/headings) + **DM Sans** (body)

---

## Pioneer Platform API Reference (backend)

```
POST   /api/auth/register        Register (pioneer or client)
POST   /api/auth/login           Login → accessToken + refreshToken
GET    /api/auth/me              Get current user
PUT    /api/auth/me              Update profile

GET    /api/jobs                 List jobs (filterable)
POST   /api/jobs                 Create job
GET    /api/jobs/:id             Get single job
PUT    /api/jobs/:id             Update job
DELETE /api/jobs/:id             Delete job
PATCH  /api/jobs/:id/status      Update job status
POST   /api/jobs/:id/invite      Invite a pioneer
GET    /api/jobs/mine/list       My posted jobs

POST   /api/jobs/:id/applications   Apply to job
GET    /api/jobs/:id/applications   Get all applicants
GET    /api/applications/mine       My applications
PATCH  /api/applications/:id/status Accept/Reject/Withdraw

POST   /api/jobs/:id/payments    Initiate payment (→ escrow)
PATCH  /api/payments/:id/release Release payment to pioneer
GET    /api/payments/mine        Payment history

POST   /api/jobs/:id/reviews     Submit review
GET    /api/users/:id/reviews    Get user reviews

GET    /api/users                Browse pioneers
GET    /api/users/stats          Dashboard stats
GET    /api/users/:id            Pioneer public profile
```
