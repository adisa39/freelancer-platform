# BF Blessy Linker Marketplace

Mobile-first marketplace mini-app built with Next.js 16 App Router. InterLink MDK provides sign-in, while Next.js Route Handlers under `src/app/api` manage the marketplace session and MongoDB-backed job flows.

## Setup

1. Copy `.env.local.example` to `.env.local`.
2. Set `MONGODB_URI`, a strong `JWT_SECRET`, and the App ID registered for this mini-app in both `NEXT_PUBLIC_INTERLINK_APP_ID` and `INTERLINK_APP_ID`.
3. Install dependencies and run `npm run dev`.

The sign-in and registration screens use `@interlinklabs/mdk` (`Mdk2`). The browser SDK completes InterLink authentication; the same-origin `/api/auth` handler validates the returned web token with InterLink before setting the marketplace's HttpOnly session cookie. Do not put InterLink access tokens or private credentials in client-side environment variables.

Registration creates a job poster or Linker profile. Linkers can add a display name, location, skills, and bio. The server stores InterLink `loginId` as the account identity; marketplace roles remain `client` and `translator` internally.

## Main flows

- `/jobs`: open projects backed by the local job API.
- `/jobs/[id]`: job details and Linker proposals.
- `/jobs/[id]/applications`: poster review and assignment.
- `/linkers`: Linker directory; `/linkers/[id]`: public profile.
- `/post-job`: create a tITL-denominated testnet job.

## API routes

- `POST /api/auth`: validate an InterLink web token and create a same-origin session; `GET /api/auth` returns the current user; `POST` with `{ "action": "logout" }` clears the local session.
- `GET, POST /api/jobs`: list and create jobs.
- `GET /api/jobs/[id]`: retrieve a job; `PATCH` with `action: "assign"` assigns an eligible application.
- `GET, POST /api/jobs/[id]/applications`: poster review and Linker application submission.
- `GET /api/freelancers`: list Linkers; `GET /api/freelancers/[id]`: retrieve a public profile.
- Contact, quote, service, and order handlers are also under `/api`.

The current InterLink testnet RPC requires gateway authentication and target-contract allowlisting. On-chain escrow must be configured against an InterLink-approved escrow contract before funding/release actions are enabled.
