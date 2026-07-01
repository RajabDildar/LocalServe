# LocalServe — Architecture & Tech Stack Document
**Version:** 1.0  
**Status:** Draft  
**Last Updated:** June 2026  
**Companion to:** localserve-spec.md v1.0

---

## 1. Tech Stack Summary

| Layer | Technology | Reason |
|---|---|---|
| Frontend Framework | React 18 + Vite | Fast dev server, HMR, smaller bundles than CRA |
| Language | TypeScript (full stack) | Type safety, better Claude Code output, catches bugs early |
| Styling | Tailwind CSS v3 | Utility-first, no context switching, great with shadcn |
| UI Components | shadcn/ui | Accessible, unstyled base, fully customizable |
| Client State | Zustand | Minimal boilerplate for auth + location state |
| Server State | TanStack Query (React Query) | Caching, background refetch, loading/error states |
| Forms | React Hook Form + Zod | Performance, schema-first validation |
| HTTP Client | Axios | Interceptors for JWT injection and error handling |
| Backend Framework | Node.js + Express | Mature, fast, MERN standard |
| Database | MongoDB Atlas + Mongoose | Geospatial support, flexible schema, MERN standard |
| Auth | JWT (access + refresh tokens) | Stateless, scalable |
| Payments | Stripe + Stripe Connect | Industry standard, escrow model, provider payouts |
| File Storage | Cloudinary | Free tier, built-in transformations, CDN |
| Email | Resend | Modern API, generous free tier, great DX |
| Real-time | Socket.io | WebSocket abstraction (v2 — planned, not MVP) |
| Deployment: Frontend | Vercel | Free tier, zero-config, auto-deploy from GitHub |
| Deployment: Backend | Render | Free tier, Docker support, easy env management |
| Deployment: DB | MongoDB Atlas | Official cloud MongoDB, free M0 tier |

---

## 2. System Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                        │
│   React + Vite + TypeScript + TailwindCSS + shadcn/ui   │
│   Hosted on Vercel                                      │
└────────────────────────┬────────────────────────────────┘
                         │ HTTPS REST API calls
                         │ (Axios + TanStack Query)
┌────────────────────────▼────────────────────────────────┐
│                    API LAYER                            │
│   Node.js + Express + TypeScript                        │
│   Hosted on Render                                      │
│                                                         │
│   Middleware chain:                                     │
│   Request → Helmet → CORS → Rate Limiter →              │
│   Auth (JWT) → Validator → Controller → Response        │
└───┬───────────────┬───────────────┬─────────────────────┘
    │               │               │
    ▼               ▼               ▼
┌───────────┐  ┌─────────┐  ┌──────────────┐
│  MongoDB  │  │Cloudinary│  │   Stripe     │
│  Atlas    │  │(Files)   │  │  + Connect   │
│(Geospatial│  └─────────┘  └──────────────┘
│ Indexes)  │
└───────────┘
    +
┌───────────┐
│  Resend   │
│  (Email)  │
└───────────┘
```

### Request Flow (example: customer searches for providers)

```
1. Customer opens app → browser prompts for location
2. Zustand stores { lat, lng } in client state
3. React Query calls GET /api/providers?lat=...&lng=...&radius=10&category=plumbing
4. Express route hits providerController.getNearby()
5. Controller calls MongoDB $near geospatial query with 2dsphere index
6. Results sorted by distance, filtered by isApproved + isAvailable
7. JSON response → React Query caches it
8. Provider cards rendered with distance badges
```

---

## 3. Project Structure

### 3.1 Monorepo Layout

```
localserve/
├── client/                  # React frontend
├── server/                  # Express backend
├── .gitignore
└── README.md
```

### 3.2 Backend Structure (`server/`)

```
server/
├── src/
│   ├── config/
│   │   ├── db.ts            # MongoDB connection
│   │   ├── stripe.ts        # Stripe SDK init
│   │   ├── cloudinary.ts    # Cloudinary config
│   │   └── env.ts           # Validated env vars (zod)
│   │
│   ├── middleware/
│   │   ├── auth.ts          # JWT verification, role guard
│   │   ├── validate.ts      # Zod schema validation wrapper
│   │   ├── upload.ts        # Multer + Cloudinary upload handler
│   │   ├── rateLimiter.ts   # Per-route rate limits
│   │   └── errorHandler.ts  # Global error handler
│   │
│   ├── models/
│   │   ├── User.ts
│   │   ├── ProviderProfile.ts
│   │   ├── Service.ts
│   │   ├── Booking.ts
│   │   ├── Review.ts
│   │   ├── Notification.ts
│   │   ├── Dispute.ts
│   │   └── Category.ts
│   │
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── provider.routes.ts
│   │   ├── service.routes.ts
│   │   ├── booking.routes.ts
│   │   ├── payment.routes.ts
│   │   ├── review.routes.ts
│   │   ├── notification.routes.ts
│   │   ├── dispute.routes.ts
│   │   └── admin.routes.ts
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── provider.controller.ts
│   │   ├── service.controller.ts
│   │   ├── booking.controller.ts
│   │   ├── payment.controller.ts
│   │   ├── review.controller.ts
│   │   ├── notification.controller.ts
│   │   ├── dispute.controller.ts
│   │   └── admin.controller.ts
│   │
│   ├── services/            # Business logic, NOT Express-specific
│   │   ├── auth.service.ts       # Token generation, hashing
│   │   ├── email.service.ts      # Resend email templates
│   │   ├── payment.service.ts    # Stripe operations
│   │   ├── geo.service.ts        # Distance calc, geo queries
│   │   └── notification.service.ts
│   │
│   ├── validators/          # Zod schemas for request validation
│   │   ├── auth.validator.ts
│   │   ├── booking.validator.ts
│   │   ├── provider.validator.ts
│   │   └── review.validator.ts
│   │
│   ├── utils/
│   │   ├── ApiError.ts      # Custom error class
│   │   ├── ApiResponse.ts   # Standard response wrapper
│   │   ├── asyncHandler.ts  # try/catch wrapper for controllers
│   │   └── constants.ts     # Booking statuses, roles, etc.
│   │
│   ├── types/
│   │   └── express.d.ts     # Extends req.user type
│   │
│   └── app.ts               # Express app setup
│   └── server.ts            # HTTP server entry point
│
├── .env
├── .env.example
├── tsconfig.json
└── package.json
```

### 3.3 Frontend Structure (`client/`)

```
client/
├── src/
│   ├── components/           # Shared, reusable UI
│   │   ├── ui/               # shadcn/ui generated components
│   │   ├── layout/           # Navbar, Footer, Sidebar
│   │   ├── common/           # StarRating, ProviderCard, BookingCard, etc.
│   │   └── forms/            # Reusable form components
│   │
│   ├── pages/                # Route-level components
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   └── ForgotPasswordPage.tsx
│   │   ├── customer/
│   │   │   ├── HomePage.tsx           # Provider discovery
│   │   │   ├── ProviderDetailPage.tsx
│   │   │   ├── BookingPage.tsx        # Booking request form
│   │   │   ├── BookingsDashboard.tsx  # Customer's bookings
│   │   │   └── PaymentPage.tsx        # Stripe Elements checkout
│   │   ├── provider/
│   │   │   ├── ProviderDashboard.tsx  # Incoming bookings
│   │   │   ├── ProfileSetupPage.tsx
│   │   │   ├── ServicesPage.tsx
│   │   │   └── EarningsPage.tsx
│   │   └── admin/
│   │       ├── AdminDashboard.tsx
│   │       ├── UsersPage.tsx
│   │       ├── PendingProvidersPage.tsx
│   │       ├── BookingsPage.tsx
│   │       └── DisputesPage.tsx
│   │
│   ├── features/             # Feature-specific logic (co-located)
│   │   ├── auth/
│   │   │   ├── authStore.ts         # Zustand store
│   │   │   └── useAuth.ts           # Hook wrapper
│   │   ├── location/
│   │   │   ├── locationStore.ts     # { lat, lng, address }
│   │   │   └── useLocation.ts
│   │   └── notifications/
│   │       └── notificationStore.ts
│   │
│   ├── hooks/                # Custom hooks
│   │   ├── useProviders.ts   # TanStack Query: fetch nearby providers
│   │   ├── useBooking.ts
│   │   ├── usePayment.ts
│   │   └── useGeolocation.ts # Browser geolocation abstraction
│   │
│   ├── services/             # Axios API call functions
│   │   ├── api.ts            # Axios instance with interceptors
│   │   ├── auth.api.ts
│   │   ├── provider.api.ts
│   │   ├── booking.api.ts
│   │   ├── payment.api.ts
│   │   └── review.api.ts
│   │
│   ├── utils/
│   │   ├── distance.ts       # km formatting helpers
│   │   ├── currency.ts       # price formatting
│   │   └── date.ts           # date formatting helpers
│   │
│   ├── types/
│   │   ├── user.types.ts
│   │   ├── booking.types.ts
│   │   ├── provider.types.ts
│   │   └── api.types.ts
│   │
│   ├── router/
│   │   ├── index.tsx          # React Router v6 routes
│   │   ├── ProtectedRoute.tsx # Auth guard
│   │   └── RoleRoute.tsx      # Role guard (customer/provider/admin)
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 4. Database Architecture

### 4.1 MongoDB Schema Decisions

- Store provider location as **GeoJSON Point** (`{ type: 'Point', coordinates: [lng, lat] }`). Note: MongoDB uses `[longitude, latitude]` order.
- Add `2dsphere` index on `ProviderProfile.location` for all geospatial queries.
- Booking stores `totalAmount`, `platformFee`, and `providerAmount` separately so they are never recalculated after the fact.
- Booking status is an **enum enforced at the schema level**. No free-text status strings.
- Reviews are tied to a `bookingId` and only one review per booking is allowed (unique index).

### 4.2 Mongoose Schemas

#### User
```typescript
const userSchema = new Schema({
  name:                  { type: String, required: true, trim: true },
  email:                 { type: String, required: true, unique: true, lowercase: true },
  passwordHash:          { type: String, required: true },
  role:                  { type: String, enum: ['customer', 'provider', 'admin'], required: true },
  phone:                 { type: String },
  avatar:                { type: String },           // Cloudinary URL
  isVerified:            { type: Boolean, default: false },
  isActive:              { type: Boolean, default: true },
  verificationToken:     { type: String },
  resetPasswordToken:    { type: String },
  resetPasswordExpires:  { type: Date },
}, { timestamps: true });

// Indexes
userSchema.index({ email: 1 });
```

#### ProviderProfile
```typescript
const providerProfileSchema = new Schema({
  userId:          { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  bio:             { type: String, maxlength: 1000 },
  location: {
    type:          { type: String, enum: ['Point'], required: true },
    coordinates:   { type: [Number], required: true },  // [lng, lat]
  },
  serviceRadius:   { type: Number, required: true },     // in km
  isApproved:      { type: Boolean, default: false },
  isAvailable:     { type: Boolean, default: true },
  avgRating:       { type: Number, default: 0, min: 0, max: 5 },
  reviewCount:     { type: Number, default: 0 },
  stripeAccountId: { type: String },                     // Stripe Connect account ID
  portfolioImages: [{ type: String }],                   // Cloudinary URLs
}, { timestamps: true });

// CRITICAL: 2dsphere index enables $near and $geoWithin queries
providerProfileSchema.index({ location: '2dsphere' });
providerProfileSchema.index({ isApproved: 1, isAvailable: 1 });
```

#### Service
```typescript
const serviceSchema = new Schema({
  providerId:    { type: Schema.Types.ObjectId, ref: 'ProviderProfile', required: true },
  title:         { type: String, required: true },
  description:   { type: String, required: true },
  categoryId:    { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  subcategory:   { type: String },
  pricingType:   { type: String, enum: ['fixed', 'hourly', 'custom'], required: true },
  price:         { type: Number },                   // null if pricingType is 'custom'
  images:        [{ type: String }],
  isActive:      { type: Boolean, default: true },
}, { timestamps: true });

serviceSchema.index({ providerId: 1, categoryId: 1 });
```

#### Booking
```typescript
const BOOKING_STATUSES = [
  'pending',       // customer sent request, awaiting provider
  'accepted',      // provider accepted, awaiting payment
  'paid',          // customer paid, escrow holding funds
  'rejected',      // provider rejected
  'cancelled',     // cancelled before payment
  'in_progress',   // provider started work
  'completed',     // provider marked done, awaiting customer confirm
  'confirmed',     // customer confirmed, triggers payout
  'disputed',      // customer raised dispute
  'refunded',      // payment refunded
];

const bookingSchema = new Schema({
  customerId:       { type: Schema.Types.ObjectId, ref: 'User', required: true },
  providerId:       { type: Schema.Types.ObjectId, ref: 'User', required: true },
  serviceId:        { type: Schema.Types.ObjectId, ref: 'Service', required: true },
  status:           { type: String, enum: BOOKING_STATUSES, default: 'pending' },
  scheduledAt:      { type: Date, required: true },
  description:      { type: String },
  serviceAddress:   { type: String },
  totalAmount:      { type: Number },               // Set when provider accepts
  platformFee:      { type: Number },               // e.g. 10% of totalAmount
  providerAmount:   { type: Number },               // totalAmount - platformFee
  paymentIntentId:  { type: String },               // Stripe PaymentIntent ID
  autoReleaseAt:    { type: Date },                 // Auto-release date (confirmed + 4 days)
  cancelReason:     { type: String },
}, { timestamps: true });

bookingSchema.index({ customerId: 1, status: 1 });
bookingSchema.index({ providerId: 1, status: 1 });
bookingSchema.index({ paymentIntentId: 1 });
```

#### Review
```typescript
const reviewSchema = new Schema({
  bookingId:       { type: Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
  customerId:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
  providerId:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating:          { type: Number, required: true, min: 1, max: 5 },
  comment:         { type: String, maxlength: 1000 },
  providerResponse:{ type: String, maxlength: 500 },
}, { timestamps: true });

// One review per booking
reviewSchema.index({ bookingId: 1 }, { unique: true });
reviewSchema.index({ providerId: 1 });
```

#### Notification
```typescript
const notificationSchema = new Schema({
  userId:          { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type:            { type: String, required: true },  // e.g. 'booking_accepted', 'payment_received'
  title:           { type: String, required: true },
  message:         { type: String, required: true },
  isRead:          { type: Boolean, default: false },
  relatedEntityId: { type: Schema.Types.ObjectId },   // bookingId or disputeId
  relatedModel:    { type: String },                  // 'Booking' or 'Dispute'
}, { timestamps: true });

notificationSchema.index({ userId: 1, isRead: 1 });
```

#### Dispute
```typescript
const DISPUTE_STATUSES = ['open', 'under_review', 'resolved_refund', 'resolved_no_action'];
const DISPUTE_REASONS = ['service_not_done', 'poor_quality', 'no_show', 'overcharged', 'other'];

const disputeSchema = new Schema({
  bookingId:    { type: Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
  raisedBy:     { type: Schema.Types.ObjectId, ref: 'User', required: true },
  reason:       { type: String, enum: DISPUTE_REASONS, required: true },
  description:  { type: String, required: true },
  status:       { type: String, enum: DISPUTE_STATUSES, default: 'open' },
  adminNote:    { type: String },
  refundAmount: { type: Number },
  resolvedAt:   { type: Date },
  resolvedBy:   { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });
```

#### Category
```typescript
const categorySchema = new Schema({
  name:          { type: String, required: true, unique: true },
  slug:          { type: String, required: true, unique: true },
  icon:          { type: String },
  subcategories: [{ type: String }],
  isActive:      { type: Boolean, default: true },
}, { timestamps: true });
```

---

## 5. API Design

### 5.1 Standard Response Format

Every API response uses this shape:

```typescript
// Success
{
  "success": true,
  "data": { ... },
  "message": "Providers fetched successfully"
}

// Error
{
  "success": false,
  "message": "Booking not found",
  "errors": []   // validation errors array, if any
}
```

### 5.2 API Routes Reference

#### Auth  `/ api/auth`
```
POST   /register                 Register (customer or provider)
POST   /login                    Login, returns access + refresh token
POST   /logout                   Invalidate refresh token
POST   /refresh-token            Issue new access token
GET    /verify-email/:token      Verify email address
POST   /forgot-password          Send reset email
POST   /reset-password/:token    Reset password
GET    /me                       Get current user (protected)
```

#### Providers  `/api/providers`
```
GET    /                         Discover providers (with geo + filters)
GET    /:id                      Get provider public profile
PUT    /profile                  Update own provider profile (provider only)
PUT    /availability             Toggle availability on/off (provider only)
POST   /stripe/onboard           Start Stripe Connect onboarding (provider only)
GET    /stripe/status            Check Stripe Connect status (provider only)
```

**Discovery query parameters:**
```
GET /api/providers?lat=31.45&lng=73.13&radius=10&category=plumbing&sort=distance&minRating=4
```

| Param | Type | Description |
|---|---|---|
| lat | Number | Customer latitude (required) |
| lng | Number | Customer longitude (required) |
| radius | Number | Max distance in km (default: 10) |
| category | String | Category slug filter |
| sort | String | `distance` / `rating` / `price_low` / `newest` |
| minRating | Number | Minimum provider rating |
| maxPrice | Number | Max service price |
| page | Number | Pagination |
| limit | Number | Results per page (default: 20) |

#### Services  `/api/services`
```
GET    /provider/:providerId     List all services of a provider
POST   /                         Create a service (provider only)
PUT    /:id                      Update a service (provider only)
DELETE /:id                      Deactivate a service (provider only)
```

#### Bookings  `/api/bookings`
```
POST   /                         Customer creates a booking request
GET    /                         List bookings (customer: own, provider: incoming)
GET    /:id                      Get single booking (parties involved only)
PUT    /:id/accept               Provider accepts (sets price, triggers payment)
PUT    /:id/reject               Provider rejects (with reason)
PUT    /:id/cancel               Cancel booking (customer or provider)
PUT    /:id/start                Provider marks in-progress
PUT    /:id/complete             Provider marks completed
PUT    /:id/confirm              Customer confirms completion (triggers payout)
```

#### Payments  `/api/payments`
```
POST   /create-intent            Create Stripe PaymentIntent for a booking
POST   /webhook                  Stripe webhook endpoint (raw body)
GET    /history                  Customer: payment history
GET    /earnings                 Provider: earnings history
```

#### Reviews  `/api/reviews`
```
POST   /                         Customer submits review (booking must be confirmed)
GET    /provider/:providerId      Get all reviews for a provider (public)
PUT    /:id/respond              Provider responds to their review
```

#### Notifications  `/api/notifications`
```
GET    /                         Get user's notifications (paginated)
GET    /unread-count             Get unread count only
PUT    /:id/read                 Mark one as read
PUT    /read-all                 Mark all as read
```

#### Disputes  `/api/disputes`
```
POST   /                         Customer raises a dispute
GET    /:id                      Get dispute details
```

#### Admin  `/api/admin`
```
GET    /users                    List all users (with filters)
PUT    /users/:id/status         Activate / suspend / ban user
GET    /providers/pending        List providers awaiting approval
PUT    /providers/:id/approve    Approve a provider profile
PUT    /providers/:id/reject     Reject a provider profile (with reason)
GET    /bookings                 List all bookings (filterable)
GET    /disputes                 List all disputes
PUT    /disputes/:id/resolve     Admin resolves dispute (with optional refund)
DELETE /reviews/:id              Admin removes abusive review
GET    /categories               Manage service categories
POST   /categories               Create category
PUT    /categories/:id           Update category
```

---

## 6. Authentication Architecture

### 6.1 Token Strategy

Two tokens are issued on login:

| Token | Expiry | Storage | Purpose |
|---|---|---|---|
| **Access Token** (JWT) | 15 minutes | Memory (JS variable / React state) | Sent with every API request |
| **Refresh Token** (JWT) | 7 days | httpOnly cookie | Used to issue new access tokens silently |

**Why this way:**
- Access token in memory: not vulnerable to XSS (no localStorage).
- Refresh token in httpOnly cookie: not accessible by JavaScript, so XSS-safe.
- Short-lived access token limits damage if intercepted.

### 6.2 Auth Middleware

```typescript
// middleware/auth.ts

export const protect = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) throw new ApiError(401, 'Not authenticated');

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id).select('-passwordHash');
  if (!req.user || !req.user.isActive) throw new ApiError(401, 'User not found or suspended');

  next();
});

export const requireRole = (...roles: string[]) => (req, res, next) => {
  if (!roles.includes(req.user.role)) throw new ApiError(403, 'Forbidden');
  next();
};

// Usage in routes
router.put('/providers/:id/approve', protect, requireRole('admin'), adminController.approveProvider);
router.post('/bookings', protect, requireRole('customer'), bookingController.create);
```

### 6.3 Email Verification Flow

```
Register → hash password → save user (isVerified: false)
→ generate verificationToken (crypto.randomBytes) → store hashed token on user
→ send email with link: /verify-email/:rawToken
→ User clicks link → GET /api/auth/verify-email/:token
→ Hash incoming token → find user with matching hash → set isVerified: true
```

---

## 7. Geolocation Architecture

### 7.1 How Provider Discovery Works

**Step 1 — Provider stores location:**
When a provider sets up their profile, the frontend requests their browser location (or they enter an address geocoded via browser). This is saved as a GeoJSON Point:
```json
{
  "location": {
    "type": "Point",
    "coordinates": [73.0479, 31.4504]   // [longitude, latitude] — MongoDB order
  },
  "serviceRadius": 15
}
```

**Step 2 — Customer triggers discovery:**
On the homepage, the browser requests location via `navigator.geolocation.getCurrentPosition()`. The coordinates go into Zustand state and are sent as query params.

**Step 3 — Geospatial MongoDB query:**
```typescript
// geo.service.ts
export const findNearbyProviders = async ({
  lat, lng, radiusKm, categoryId, sort, minRating, page, limit
}) => {
  const radiusMeters = radiusKm * 1000;

  const geoQuery = {
    location: {
      $near: {
        $geometry: { type: 'Point', coordinates: [lng, lat] },
        $maxDistance: radiusMeters,
      }
    },
    isApproved: true,
    isAvailable: true,
    ...(minRating && { avgRating: { $gte: minRating } }),
  };

  const providers = await ProviderProfile.find(geoQuery)
    .populate('userId', 'name avatar')
    .skip((page - 1) * limit)
    .limit(limit);

  // Add distance to each result
  return providers.map(p => ({
    ...p.toObject(),
    distanceKm: calculateDistance(lat, lng, p.location.coordinates[1], p.location.coordinates[0])
  }));
};
```

**Step 4 — Distance calculation:**
The `$near` operator sorts by distance automatically. We also compute the human-readable distance (e.g. "3.2 km away") using the Haversine formula:
```typescript
export const calculateDistance = (lat1, lng1, lat2, lng2): number => {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat/2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng/2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};
```

### 7.2 Provider Radius Filtering

A provider with `serviceRadius: 15` should only appear if the customer is within 15 km of the provider. The `$maxDistance` in the query is set from the customer's perspective to the maximum allowed radius. Providers with a smaller radius than the customer's distance will naturally not appear.

However, for providers with varying radii, we use an additional `$geoWithin` check:
```typescript
// Filter: customer location must be within the provider's service circle
ProviderProfile.find({
  location: {
    $geoWithin: {
      $centerSphere: [[customerLng, customerLat], radiusKm / 6371]
    }
  }
})
```

The correct approach: query `$near` first for ordering by distance, then filter on `serviceRadius` — or use a pipeline with `$geoNear` in aggregation for more control.

---

## 8. Payment Architecture

### 8.1 Escrow Model with Stripe

LocalServe uses a **platform escrow** model:
1. Customer pays → money lands in the **LocalServe Stripe account**.
2. Money sits there until service is confirmed.
3. On customer confirmation → LocalServe **transfers** `providerAmount` to the **provider's Stripe Connect account**.
4. `platformFee` stays in LocalServe's account as revenue.

This avoids the complexity of "uncaptured PaymentIntents" and works cleanly with Stripe Connect.

### 8.2 Stripe Connect Setup

Each provider must connect a Stripe account (Express account type — easiest for providers):

```
Provider clicks "Connect Stripe" →
POST /api/payments/stripe/onboard →
  Stripe creates Express account → returns onboarding URL →
  Provider redirected to Stripe's hosted onboarding →
  Provider completes → redirected back to LocalServe →
GET /api/payments/stripe/status → check if charges_enabled: true
```

This is required before a provider can receive any payouts.

### 8.3 Full Payment Flow

```
1. BOOKING ACCEPTED
   Provider accepts booking → sets price
   Booking status: pending → accepted

2. PAYMENT INITIATION
   Customer clicks "Pay Now"
   POST /api/payments/create-intent { bookingId }
     → Calculate: totalAmount, platformFee (10%), providerAmount
     → Save amounts on Booking document
     → Create Stripe PaymentIntent: amount = totalAmount
     → Return { clientSecret } to frontend

3. PAYMENT CAPTURE (frontend)
   Stripe Elements collects card details
   stripe.confirmPayment({ clientSecret })
     → Stripe captures payment to LocalServe account
     → Stripe fires webhook: payment_intent.succeeded

4. WEBHOOK HANDLER
   POST /api/payments/webhook (raw body, verified with Stripe signature)
   Event: payment_intent.succeeded
     → Find booking by paymentIntentId
     → Set booking.status = 'paid'
     → Set booking.paymentStatus = 'paid'
     → Set autoReleaseAt = now + 4 days
     → Send email to customer (payment confirmed) + provider (booking paid)

5. SERVICE COMPLETION
   Provider marks in_progress → marks completed
   Customer confirms completion
   PUT /api/bookings/:id/confirm
     → Verify customer owns this booking
     → Transfer providerAmount to provider's Stripe Connect account
       stripe.transfers.create({
         amount: providerAmount * 100,  // in cents
         currency: 'usd',
         destination: provider.stripeAccountId,
         transfer_group: bookingId
       })
     → Set booking.status = 'confirmed', paymentStatus = 'released'
     → Send payout confirmation email to provider

6. AUTO-RELEASE (if customer never confirms)
   A cron job runs daily checking autoReleaseAt < now && status === 'completed'
   → Automatically triggers the same transfer logic as step 5
```

### 8.4 Refund Flow

```
Provider cancels after payment OR admin resolves dispute with refund:
  → stripe.refunds.create({ payment_intent: paymentIntentId, amount: refundAmount })
  → Set booking.status = 'refunded', paymentStatus = 'refunded'
  → Notify customer
```

### 8.5 Webhook Security

```typescript
// payment.routes.ts — raw body needed for Stripe signature verification
router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.handleWebhook);

// payment.controller.ts
const sig = req.headers['stripe-signature'];
const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
```

Webhooks are **idempotent**: check if the action has already been applied before processing, using the event ID stored in the database.

### 8.6 Commission Calculation

```typescript
// utils/constants.ts
export const PLATFORM_COMMISSION = Number(process.env.PLATFORM_COMMISSION_PERCENT || 10) / 100;

// When provider accepts a booking and sets price:
const totalAmount = servicePrice;
const platformFee = Math.round(totalAmount * PLATFORM_COMMISSION * 100) / 100;
const providerAmount = totalAmount - platformFee;
```

---

## 9. File Upload Architecture

### 9.1 Upload Flow

```
Client selects file →
Multer (in-memory storage) receives file on server →
Upload to Cloudinary via cloudinary.uploader.upload() →
Get back secure_url (CDN-hosted) →
Store URL in MongoDB
```

### 9.2 Multer + Cloudinary Config

```typescript
// middleware/upload.ts
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'localserve/providers',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }]
  }
});

export const uploadImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }  // 5MB limit
});
```

File size limits and format restrictions are enforced at the middleware level.

---

## 10. Email Architecture

### 10.1 Why Resend

Resend has a clean Node.js SDK, React Email support, 3000 emails/month free, and does not require domain verification for testing. Each email type is a separate template function.

### 10.2 Email Service

```typescript
// services/email.service.ts
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = 'LocalServe <noreply@localserve.app>';

export const sendBookingRequestEmail = async (provider: IUser, booking: IBooking) => {
  await resend.emails.send({
    from: FROM,
    to: provider.email,
    subject: 'New Booking Request',
    html: bookingRequestTemplate(provider.name, booking),
  });
};

export const sendBookingAcceptedEmail = async (customer: IUser, booking: IBooking) => { ... };
export const sendPaymentConfirmationEmail = async (customer: IUser, booking: IBooking) => { ... };
export const sendPayoutNotificationEmail = async (provider: IUser, amount: number) => { ... };
export const sendDisputeOpenedEmail = async (admin: IUser, dispute: IDispute) => { ... };
export const sendVerificationEmail = async (user: IUser, token: string) => { ... };
export const sendPasswordResetEmail = async (user: IUser, token: string) => { ... };
```

---

## 11. Security Architecture

### 11.1 Express Security Middleware Stack

```typescript
// app.ts — middleware applied in this exact order
app.use(helmet());                           // Sets secure HTTP headers
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(mongoSanitize());                    // Strips $ and . from req.body (NoSQL injection)
app.use(express.json({ limit: '10kb' }));    // Limit body size
app.use(cookieParser());
```

### 11.2 Rate Limiting

```typescript
// Different limits for different routes
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });   // 10/15min on auth
const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });   // 100/15min on API

app.use('/api/auth', authLimiter);
app.use('/api', apiLimiter);
```

### 11.3 Input Validation

All request bodies are validated with Zod before reaching controllers:

```typescript
// validators/booking.validator.ts
export const createBookingSchema = z.object({
  serviceId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid service ID'),
  scheduledAt: z.string().datetime(),
  description: z.string().max(500).optional(),
  serviceAddress: z.string().max(200).optional(),
});

// middleware/validate.ts
export const validate = (schema: ZodSchema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) throw new ApiError(400, 'Validation failed', result.error.errors);
  req.body = result.data;
  next();
};
```

### 11.4 Authorization Checks

Resource ownership is always verified server-side. Never trust the client:

```typescript
// booking.controller.ts — confirm completion
export const confirmCompletion = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  // Must exist
  if (!booking) throw new ApiError(404, 'Booking not found');

  // Must be the customer
  if (booking.customerId.toString() !== req.user._id.toString())
    throw new ApiError(403, 'Not authorized');

  // Must be in the right state
  if (booking.status !== 'completed')
    throw new ApiError(400, 'Booking is not in completed state');

  // Now safe to proceed with payout
  await paymentService.releasePayment(booking);
});
```

### 11.5 Booking State Machine

The state machine is enforced exclusively on the server. No status transition is allowed unless the server validates it. Each `PUT /:id/[action]` endpoint checks the current status before allowing the change:

```
pending       → accepted (provider only)
pending       → rejected (provider only)
pending       → cancelled (customer only, before acceptance)
accepted      → paid (stripe webhook only)
paid          → in_progress (provider only)
paid          → cancelled (either party, triggers refund)
in_progress   → completed (provider only)
completed     → confirmed (customer only, triggers payout)
completed     → disputed (customer only)
confirmed     → [terminal]
disputed      → resolved by admin
```

---

## 12. Error Handling

### 12.1 Custom Error Class

```typescript
// utils/ApiError.ts
export class ApiError extends Error {
  statusCode: number;
  errors: any[];

  constructor(statusCode: number, message: string, errors: any[] = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}
```

### 12.2 Global Error Handler

```typescript
// middleware/errorHandler.ts
export const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log full error in dev, minimal in prod
  if (process.env.NODE_ENV === 'development') console.error(err);

  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || [],
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
```

### 12.3 Async Handler

```typescript
// utils/asyncHandler.ts
export const asyncHandler = (fn: Function) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
```

Every controller is wrapped with `asyncHandler`. No try/catch in controllers.

---

## 13. Deployment Architecture

### 13.1 Architecture

```
                    ┌──────────────┐
                    │    GitHub    │
                    │  (monorepo)  │
                    └──────┬───────┘
                    push   │
               ┌───────────┴──────────┐
               ▼                      ▼
        ┌────────────┐         ┌───────────┐
        │   Vercel   │         │   Render  │
        │ (frontend) │         │ (backend) │
        │   auto     │         │   auto    │
        │  deploys   │         │  deploys  │
        └────────────┘         └───────────┘
                                     │
                    ┌────────────────┼─────────────────┐
                    ▼                ▼                 ▼
             ┌──────────┐    ┌────────────┐   ┌──────────────┐
             │ MongoDB  │    │ Cloudinary │   │    Resend    │
             │  Atlas   │    │  (files)   │   │   (email)    │
             └──────────┘    └────────────┘   └──────────────┘
```

### 13.2 Environment Variables

**Backend (`.env`):**
```
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb+srv://...

# JWT
JWT_SECRET=your-long-random-secret
JWT_REFRESH_SECRET=another-long-random-secret
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Email
RESEND_API_KEY=re_...

# App
CLIENT_URL=http://localhost:5173
PLATFORM_COMMISSION_PERCENT=10
AUTO_RELEASE_DAYS=4
```

**Frontend (`.env`):**
```
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 13.3 Free Tier Constraints to Know

| Service | Free Tier Limit | What to Watch |
|---|---|---|
| MongoDB Atlas M0 | 512 MB storage, shared cluster | Fine for dev + light production |
| Render (Web Service) | 750 hrs/month, spins down after 15 min inactivity | Add a ping cron to keep alive |
| Vercel | 100 GB bandwidth / month | More than enough |
| Cloudinary | 25 GB storage, 25 GB bandwidth | Fine for portfolio project |
| Resend | 3,000 emails/month, 100/day | Fine for dev |
| Stripe | No monthly fee, 2.9% + 30¢ per transaction | Use test mode for dev |

---

## 14. Development Workflow

### 14.1 Setup Sequence

```bash
# 1. Clone repo
git clone https://github.com/yourusername/localserve.git
cd localserve

# 2. Backend setup
cd server && npm install
cp .env.example .env
# Fill in .env values
npm run dev          # ts-node-dev with hot reload

# 3. Frontend setup
cd ../client && npm install
cp .env.example .env
npm run dev          # Vite dev server at :5173

# 4. Stripe webhook (local testing)
# Install Stripe CLI
stripe listen --forward-to localhost:5000/api/payments/webhook
```

### 14.2 Key npm Scripts

**Backend:**
```json
{
  "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js",
  "seed": "ts-node src/scripts/seed.ts"
}
```

**Frontend:**
```json
{
  "dev": "vite",
  "build": "tsc && vite build",
  "preview": "vite preview",
  "lint": "eslint src --ext .ts,.tsx"
}
```

### 14.3 Recommended Build Order

Build the app in this sequence to avoid blocking yourself:

```
Phase 1 — Foundation
  ├── DB connection + all Mongoose models
  ├── User auth (register, login, JWT, email verify)
  └── Role-based middleware

Phase 2 — Core Provider Flow
  ├── Provider profile CRUD
  ├── Service listings
  ├── Geospatial provider discovery endpoint
  └── Admin: provider approval

Phase 3 — Booking Flow
  ├── Booking creation (customer)
  ├── Accept/reject (provider)
  ├── Status lifecycle endpoints
  └── Email notifications at each step

Phase 4 — Payments
  ├── Stripe Connect onboarding (provider)
  ├── PaymentIntent creation
  ├── Stripe Elements on frontend
  ├── Webhook handler
  └── Payout / transfer on completion

Phase 5 — Reviews & Disputes
  ├── Review submission + rating update
  └── Dispute creation + admin resolution

Phase 6 — Admin Panel
  └── All admin routes + basic UI

Phase 7 — Polish
  ├── In-app notifications
  ├── Loading states, error boundaries
  └── Responsive design pass
```

---

*End of Architecture Document v1.0*
