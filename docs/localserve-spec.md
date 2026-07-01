# LocalServe — Product Specification Document
**Version:** 1.0  
**Status:** Draft  
**Last Updated:** June 2026

---

## 1. Overview

**LocalServe** is a web platform that connects customers with local service providers across any service category, based on the customer's real-time or saved location. Think of it as a geo-aware marketplace where you can find, vet, book, and pay a plumber, tutor, cleaner, electrician, or any other skilled service professional — all from one place, with trust signals (reviews, ratings, verified profiles) built in.

The platform operates on a two-sided marketplace model:
- **Customers** discover and hire service providers.
- **Service Providers** list their services, manage bookings, and get paid.

---

## 2. Problem Statement

Finding reliable local service providers today is fragmented and frustrating:

- People rely on word-of-mouth, WhatsApp groups, or social media posts.
- There is no single trustworthy platform to discover, compare, and directly book local professionals.
- Service providers have no structured way to showcase their work, pricing, or availability to nearby customers.
- Payments are done in cash or informal transfers, with no escrow or dispute mechanism.
- There is no system for accountability — no reviews tied to real completed jobs, no trust layer.

**The result:** Customers waste time. Providers lose business. Transactions happen with no trust infrastructure.

LocalServe solves this by building a structured, location-aware marketplace with transparent pricing, verified profiles, a formal booking flow, and integrated payments.

---

## 3. Target Users

### 3.1 Primary Actors

| Actor | Description |
|---|---|
| **Customer** | Anyone who needs a local service — household tasks, repairs, education, beauty, events, etc. |
| **Service Provider** | An individual or small business offering skilled services. Can range from solo freelancers to small local agencies. |
| **Platform Admin** | Internal team managing the platform — approvals, disputes, content, analytics. |

### 3.2 User Personas

**Persona 1 — The Customer: Sarah, 32**
Sarah is a working professional who needs a reliable electrician. She has no referrals. She wants to browse options nearby, see ratings, pick one, and book on the same day. She wants to pay online and leave a review after.

**Persona 2 — The Provider: Usman, 28**
Usman is a freelance plumber with 5 years of experience. He has no online presence and gets work only through calls. He wants a platform where he can list his skills, set his prices, and receive booking requests without doing any marketing himself.

**Persona 3 — The Admin: Platform Team**
Needs to review and approve provider profiles, handle disputes, ban bad actors, and track platform health metrics.

---

## 4. Functional Requirements

Features are classified using MoSCoW prioritization:
- **Must Have** — MVP cannot launch without these.
- **Should Have** — High value, added shortly after MVP.
- **Could Have** — Desirable, lower priority.
- **Won't Have (Now)** — Explicitly out of scope for now.

---

### 4.1 Authentication & User Management

| # | Feature | Priority |
|---|---|---|
| A1 | Customer registration and login (email + password) | Must Have |
| A2 | Provider registration and login (email + password) | Must Have |
| A3 | JWT-based session management | Must Have |
| A4 | Role-based access (Customer, Provider, Admin) | Must Have |
| A5 | Email verification on signup | Must Have |
| A6 | Password reset via email | Must Have |
| A7 | OAuth login (Google) | Should Have |
| A8 | Profile picture upload | Should Have |
| A9 | Account deactivation by user | Could Have |
| A10 | Two-factor authentication | Could Have |

---

### 4.2 Provider Profiles & Listings

| # | Feature | Priority |
|---|---|---|
| P1 | Provider creates a profile: name, bio, photo, contact | Must Have |
| P2 | Provider selects service category and subcategory | Must Have |
| P3 | Provider sets pricing (fixed, hourly, or custom quote) | Must Have |
| P4 | Provider sets service radius (how far they travel) | Must Have |
| P5 | Provider sets location (lat/lng, auto-detect or manual) | Must Have |
| P6 | Provider can list multiple service offerings | Must Have |
| P7 | Provider uploads portfolio images/work samples | Should Have |
| P8 | Provider sets availability (days and time slots) | Should Have |
| P9 | Provider profile admin approval before going live | Must Have |
| P10 | Provider can mark themselves as unavailable temporarily | Should Have |
| P11 | Provider verification badge (ID/document upload) | Could Have |

---

### 4.3 Location-Based Discovery

| # | Feature | Priority |
|---|---|---|
| L1 | Customer's location auto-detected via browser geolocation | Must Have |
| L2 | Customer can manually enter or change location | Must Have |
| L3 | Providers shown sorted by distance from customer | Must Have |
| L4 | Distance displayed on each provider card (e.g. "2.3 km away") | Must Have |
| L5 | Only providers whose service radius covers customer's location are shown | Must Have |
| L6 | Filter by max distance (e.g. within 5 km / 10 km / 25 km) | Must Have |
| L7 | Filter by service category and subcategory | Must Have |
| L8 | Filter by rating (min stars) | Should Have |
| L9 | Filter by price range | Should Have |
| L10 | Sort by: distance, rating, price, newest | Should Have |
| L11 | Map view of nearby providers | Could Have |

---

### 4.4 Booking & Request Flow

| # | Feature | Priority |
|---|---|---|
| B1 | Customer sends a booking request to a provider (with date, time, description) | Must Have |
| B2 | Provider receives notification of the request | Must Have |
| B3 | Provider accepts or rejects the request | Must Have |
| B4 | Booking status lifecycle: Pending → Accepted / Rejected → In Progress → Completed / Cancelled | Must Have |
| B5 | Customer can cancel before provider accepts | Must Have |
| B6 | Provider can cancel after accepting (with reason) | Must Have |
| B7 | Customer can view all their bookings and statuses | Must Have |
| B8 | Provider can view all their incoming bookings | Must Have |
| B9 | Booking includes optional notes/description from customer | Must Have |
| B10 | Provider can propose a custom price when accepting (quote-based) | Should Have |
| B11 | Customer confirms custom quote before payment | Should Have |
| B12 | Provider can mark a booking as "In Progress" and "Completed" | Must Have |
| B13 | Customer confirms completion to trigger payment release | Must Have |

---

### 4.5 Payments

| # | Feature | Priority |
|---|---|---|
| PAY1 | Stripe integration for card payments | Must Have |
| PAY2 | Customer pays at booking confirmation (escrow model — held until service done) | Must Have |
| PAY3 | Funds released to provider when customer confirms completion | Must Have |
| PAY4 | Platform takes a percentage cut (configurable %) | Must Have |
| PAY5 | Payment receipts sent via email | Must Have |
| PAY6 | Customer can view payment history | Must Have |
| PAY7 | Provider can view earnings history and pending payouts | Must Have |
| PAY8 | Stripe Connect for provider payouts (direct to their bank) | Must Have |
| PAY9 | Refund flow if provider cancels after payment | Must Have |
| PAY10 | JazzCash / EasyPaisa integration | Should Have |
| PAY11 | Provider withdrawal management (request payout) | Should Have |
| PAY12 | Invoices / downloadable receipts | Could Have |

---

### 4.6 Reviews & Ratings

| # | Feature | Priority |
|---|---|---|
| R1 | Customer can leave a rating (1–5 stars) after service completion | Must Have |
| R2 | Customer can leave a written review | Must Have |
| R3 | Reviews only allowed on completed bookings (verified reviews) | Must Have |
| R4 | Provider's average rating displayed on profile and listing cards | Must Have |
| R5 | Provider can respond to reviews | Should Have |
| R6 | Admin can remove abusive reviews | Must Have |
| R7 | Review count displayed alongside rating | Must Have |
| R8 | Customers can flag a review as inappropriate | Could Have |

---

### 4.7 Notifications

| # | Feature | Priority |
|---|---|---|
| N1 | Email notifications for booking request (to provider) | Must Have |
| N2 | Email notifications for booking accepted/rejected (to customer) | Must Have |
| N3 | Email notification when payment is received (to provider) | Must Have |
| N4 | Email notification when service is marked complete (to customer) | Must Have |
| N5 | In-app notification bell with unread count | Should Have |
| N6 | Real-time in-app notifications (via WebSockets) | Should Have |
| N7 | SMS notifications (Twilio or similar) | Could Have |

---

### 4.8 Messaging / Chat

| # | Feature | Priority |
|---|---|---|
| M1 | In-app chat between customer and provider on an accepted booking | Should Have |
| M2 | Real-time messaging (WebSockets) | Should Have |
| M3 | File/image sharing in chat | Could Have |
| M4 | Chat history persisted and viewable | Should Have |

---

### 4.9 Admin Panel

| # | Feature | Priority |
|---|---|---|
| AD1 | View and manage all users (customers and providers) | Must Have |
| AD2 | Approve or reject provider profiles | Must Have |
| AD3 | Suspend or ban accounts | Must Have |
| AD4 | View all bookings and their statuses | Must Have |
| AD5 | Handle disputes (view dispute, issue refund, resolve) | Must Have |
| AD6 | Manage service categories and subcategories | Must Have |
| AD7 | Platform revenue dashboard (total transactions, platform cut) | Should Have |
| AD8 | View and remove reviews | Must Have |
| AD9 | Configurable platform commission rate | Should Have |

---

### 4.10 Disputes & Refunds

| # | Feature | Priority |
|---|---|---|
| D1 | Customer can raise a dispute on a completed/cancelled booking | Must Have |
| D2 | Admin reviews the dispute and can issue full or partial refund | Must Have |
| D3 | Dispute reason categories + description field | Must Have |
| D4 | Dispute status tracking (Open → Under Review → Resolved) | Should Have |

---

## 5. MVP Definition

The MVP is the smallest version of LocalServe that is genuinely usable. A real customer can find a real provider, book them, pay, and leave a review. It is not a demo; it is a working product.

### MVP Scope

**Included in MVP:**

| Area | What's Included |
|---|---|
| Auth | Email/password signup + login, JWT, email verification, password reset, roles (Customer, Provider, Admin) |
| Provider Profile | Profile creation, service category/subcategory selection, pricing type (fixed/hourly), location + service radius, admin approval to go live |
| Discovery | Location-based listing sorted by distance, filter by category and max distance, provider cards with rating and distance |
| Booking | Full request → accept/reject → in-progress → complete lifecycle, customer and provider dashboards |
| Payments | Stripe card payments, escrow hold on booking, release on completion, platform commission, refund on cancellation, Stripe Connect for provider payouts |
| Reviews | Star rating + written review on completed bookings, average rating on profile |
| Notifications | Email notifications for all key booking and payment events |
| Admin | User management, provider approval, booking oversight, review removal, dispute + refund handling, category management |
| Disputes | Customer can raise a dispute, admin resolves with full/partial refund |

**Not in MVP (planned for v2):**
- In-app real-time messaging
- Map view of providers
- Availability calendar
- OAuth login (Google)
- SMS notifications
- JazzCash/EasyPaisa
- Provider counter-offer / custom quote flow
- Mobile app

---

### MVP Success Criteria

A successful MVP means:
1. A provider can register, set up their profile, and get approved.
2. A customer can find that provider by location, send a booking request, and pay via Stripe.
3. The provider can accept, complete the job, and receive their payout.
4. The customer can leave a review.
5. An admin can manage users, handle a dispute, and issue a refund.

---

## 6. Key User Flows

### Flow 1 — Provider Onboarding
```
Register → Email Verification → Complete Profile (category, pricing, location, radius)
→ Submit for Approval → Admin Reviews → Approved → Profile Live
```

### Flow 2 — Customer Books a Service
```
Register / Login → Allow Location or Enter Manually → Browse Providers by Distance & Category
→ View Provider Profile + Reviews → Send Booking Request (date, time, notes)
→ Provider Accepts → Customer Pays via Stripe → Booking Confirmed
```

### Flow 3 — Service Completion & Payout
```
Provider Marks In Progress → Provider Marks Completed → Customer Confirms Completion
→ Payment Released to Provider (minus platform commission) → Customer Prompted to Review
```

### Flow 4 — Dispute Flow
```
Customer Raises Dispute (after completion or cancellation) → Admin Reviews Both Sides
→ Admin Issues Refund or Closes Dispute → Both Parties Notified
```

---

## 7. Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Performance** | Page load under 2s on average connection. API responses under 300ms for most endpoints. |
| **Security** | JWT with refresh tokens. Passwords hashed (bcrypt). Stripe webhooks verified. Input sanitization. Rate limiting on auth endpoints. |
| **Scalability** | Stateless backend (horizontally scalable). DB indexes on location (geospatial), category, and rating. |
| **Reliability** | Payment webhooks must be idempotent. Booking state machine must be enforced server-side — never trust client-side status. |
| **Geo** | MongoDB geospatial queries ($near, $geoWithin) for location-based provider discovery. |
| **Data Privacy** | User location stored only with consent. Providers can hide exact address and show general area only. |
| **Mobile Responsiveness** | Web app must be fully responsive for mobile browsers (pre-app launch). |

---

## 8. High-Level Data Entities

| Entity | Key Attributes |
|---|---|
| **User** | id, name, email, passwordHash, role (customer/provider/admin), phone, avatar, isVerified, location |
| **ProviderProfile** | id, userId, bio, categories, services[], location (GeoJSON Point), serviceRadius (km), avgRating, reviewCount, isApproved, isAvailable |
| **Service** | id, providerId, title, description, category, subcategory, pricingType (fixed/hourly/custom), price |
| **Booking** | id, customerId, providerId, serviceId, status, scheduledAt, description, totalAmount, platformFee, providerAmount, paymentStatus, paymentIntentId |
| **Payment** | id, bookingId, stripePaymentIntentId, amount, platformFee, status, paidAt |
| **Review** | id, bookingId, customerId, providerId, rating, comment, providerResponse, createdAt |
| **Notification** | id, userId, type, message, isRead, relatedEntityId, createdAt |
| **Dispute** | id, bookingId, raisedBy, reason, description, status, adminNote, resolution, resolvedAt |
| **Category** | id, name, subcategories[] |

---

## 9. Out of Scope (v1)

- Mobile apps (iOS / Android)
- AI-based provider matching or recommendations
- Provider background check / ID verification integrations
- Multi-language / localization
- Subscription plans for providers (pay-to-rank)
- Referral or loyalty program
- Video consultations / remote services
- Job post model (customer posts a job, providers bid)

---

## 10. Open Questions to Resolve Before Build

| # | Question | Recommendation |
|---|---|---|
| OQ1 | What is the platform commission %? | 10–15% is industry standard. Pick one before payment implementation. |
| OQ2 | Does the provider connect a Stripe account (Stripe Connect), or does platform hold and transfer manually? | Stripe Connect — cleaner, scalable, fewer compliance headaches. |
| OQ3 | Can a customer book multiple services in one booking, or one per booking? | One service per booking for MVP simplicity. |
| OQ4 | What if a customer never confirms completion? | Auto-release payment after 3–5 days (configurable by admin). |
| OQ5 | Should providers set per-day availability or simple on/off? | Simple on/off for MVP, full calendar for v2. |

---

*End of Specification Document v1.0*
