# LocalServe — Project Context for Antigravity Cli

## What This Project Is

A two-sided marketplace where customers find and hire local service providers
based on location. Full spec at `docs/spec.md`. Architecture at `docs/architecture.md`.

## Current Phase

<!-- UPDATE THIS EVERY TIME YOU COMPLETE A PHASE -->

Phase 1: Foundation — Auth system + Mongoose models

## Monorepo Structure

localserve/
├── client/ # React + Vite + TypeScript frontend
├── server/ # Node.js + Express + TypeScript backend
└── docs/ # Spec and architecture docs

## Tech Stack

- Frontend: React 19, Vite, TypeScript, Tailwind CSS, shadcn/ui,
  TanStack Query, Zustand, React Hook Form + Zod, Axios
- Backend: Node.js, Express, TypeScript, MongoDB + Mongoose, JWT,
  Stripe + Stripe Connect, Cloudinary, Resend
- DB: MongoDB Atlas (free tier). Geospatial 2dsphere indexes on
  ProviderProfile.location. GeoJSON coordinates are [lng, lat] order.

## Key Commands

# Backend

cd server && npm run dev
cd server && npm run build # compile TypeScript
cd server && npm run start # make dist
cd server && npm run seed # seed DB with test data

# Frontend

cd client && npm run dev # Vite on port 5173
cd client && npm run build

# Stripe webhooks (local)

stripe listen --forward-to localhost:5000/api/payments/webhook

## API Convention

All API responses use this exact shape:

Success:
{ "success": true, "data": { ... }, "message": "..." }

Error:
{ "success": false, "message": "...", "errors": [] }

NEVER return raw data without this wrapper.
NEVER use res.send() — always use res.status(code).json(ApiResponse).

## Backend Coding Rules

1. ALL controllers are wrapped with asyncHandler() — no try/catch in controllers
2. Throw ApiError for all error cases: throw new ApiError(404, 'Not found')
3. ALL Zod schemas live in server/src/validators/ — one file per domain
4. ALL business logic goes in server/src/services/ — controllers are thin
5. ALL mongoose models must have timestamps: true
6. NEVER trust client-side booking status — always validate state machine server-side
7. Stripe webhook handler must use express.raw() body parser, NOT express.json()
8. MongoDB GeoJSON coordinates: [longitude, latitude] — NOT [lat, lng]

## Frontend Coding Rules

1. NO direct fetch() calls — all API calls go through Axios instance in services/api.ts
2. ALL server state uses TanStack Query — no useState for async data
3. ALL client state (auth, location) goes in Zustand stores in features/
4. Forms use React Hook Form + Zod — never uncontrolled inputs
5. shadcn/ui components for all UI — run `npx shadcn@latest add [component]` to add
6. NO inline styles — Tailwind classes only

## TypeScript Rules

- Strict mode is ON in both tsconfig.json files
- No `any` types — use `unknown` and type guard if truly unknown
- All Mongoose documents use the IModel interface pattern
- Shared types between client and server should be documented inline

## Environment Variables

Backend .env has: MONGODB_URI, JWT_SECRET, JWT_REFRESH_SECRET,
STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY, STRIPE_WEBHOOK_SECRET,
CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET,
RESEND_API_KEY, CLIENT_URL, PORT, PLATFORM_COMMISSION_PERCENT, AUTO_RELEASE_DAYS

Frontend .env has: VITE_API_URL, VITE_STRIPE_PUBLISHABLE_KEY

NEVER hardcode secrets. NEVER commit .env files.

## Booking State Machine

The only valid status transitions (enforced server-side only):
pending → accepted (provider) | rejected (provider) | cancelled (customer)
accepted → paid (Stripe webhook only — never manually)
paid → in_progress (provider) | cancelled (triggers refund)
in_progress → completed (provider)
completed → confirmed (customer — triggers Stripe transfer to provider) | disputed (customer)
All others: terminal states

## Payment Architecture

- Escrow model: customer pays to LocalServe Stripe account
- On confirmation: Transfer providerAmount to provider's Stripe Connect account
- Commission: PLATFORM_COMMISSION_PERCENT env var (default 10%)
- Amounts: always stored in dollars (float), converted to cents only when calling Stripe API

## Do Not

- Do NOT use mongoose.connect() more than once (it's in config/db.ts already)
- Do NOT skip email verification when testing — use seed script to pre-verify test users
- Do NOT add Socket.io yet — it's Phase 8 (post-MVP)
- Do NOT add map view yet — it's post-MVP
- Do NOT use localStorage for tokens — access token in memory, refresh in httpOnly cookie
