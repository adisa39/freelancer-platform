# BF Blessy Linker Marketplace

Mobile-first marketplace mini-app built with Next.js 16 App Router. Wallet ownership is verified with an InterLink challenge before Next.js creates the marketplace session. Route Handlers under `src/app/api` manage MongoDB-backed marketplace flows.

## Setup

1. Copy `.env.example` to `.env.local`.
2. Set `MONGODB_URI`, a randomly generated `JWT_SECRET` of at least 32 characters, `NEXT_PUBLIC_CHAIN_ID`, and `INTERLINK_RPC` for the network you will use.
3. Install dependencies and run `npm run dev`.

The browser requests a short-lived challenge from the same-origin `/api/auth` handler and asks the connected wallet to sign it. The server recovers the signer, asks the InterLink gateway to verify the challenge, links the wallet to a marketplace profile, and sets a one-day HttpOnly session cookie. InterLink access tokens stay on the server and are discarded after verification.

Registration creates a client or freelancer profile and stores the verified wallet and chain ID. Freelancers can add a display name, location, skills, and bio. The committed example settings target the InterLink testnet described in the supplied network document; configure the production RPC and chain ID explicitly before using another network.

## Main flows

- `/jobs`: open projects backed by the local job API.
- `/jobs/[id]`: job details and Linker proposals.
- `/jobs/[id]/applications`: poster review and assignment.
- `/linkers`: Linker directory; `/linkers/[id]`: public profile.
- `/post-job`: create a tITL-denominated testnet job.

## API routes

- `POST /api/auth` with `{ "action": "challenge", "walletAddress": "..." }` starts wallet verification; with `{ "action": "interlink", ... }` it verifies the signed challenge and creates or retrieves the profile. `GET /api/auth` returns the current user; `POST` with `{ "action": "logout" }` clears the local session.
- `GET, POST /api/jobs`: list and create jobs.
- `GET /api/jobs/[id]`: retrieve a job; `PATCH` with `action: "assign"` assigns an eligible application.
- `GET, POST /api/jobs/[id]/applications`: poster review and Linker application submission.
- `GET /api/freelancers`: list Linkers; `GET /api/freelancers/[id]`: retrieve a public profile.
- Contact, quote, service, and order handlers are also under `/api`.

The current InterLink testnet RPC requires gateway authentication and target-contract allowlisting. On-chain escrow must be configured against an InterLink-approved escrow contract before funding/release actions are enabled.
