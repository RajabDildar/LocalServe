# LocalServe — Product Specification

**Version:** 2.0
**Status:** Approved source of truth
**Last updated:** 5 September 2026
**Companion document:** `docs/localserve-architecture.md` v2.0
**Product type:** Portfolio demonstration; not intended for live commercial operation

---

## 1. Document Authority

This document defines **what LocalServe must do**. The companion architecture document defines **how it must be built**. If the implementation conflicts with either document, the documents take precedence until they are intentionally revised.

The words **must**, **must not**, **should**, and **may** are normative:

- **Must / must not:** required for the MVP to be considered complete.
- **Should:** expected after the core MVP path is complete, but not a launch blocker.
- **May:** optional enhancement.

Every unresolved product decision from v1.0 has been resolved in this version. This document contains no open product questions.

---

## 2. Product Definition

LocalServe is a responsive web marketplace that helps people discover nearby service providers, request a fixed-price service for a specific place and time, pay in Stripe test mode, track the work, and leave a verified review.

It demonstrates three product areas:

1. **Location-aware discovery:** customers see approved providers who serve their location.
2. **Trust and scheduling:** provider approval, fixed service listings, conflict-aware booking requests, controlled status transitions, disputes, and verified reviews.
3. **Marketplace payments:** a complete Stripe Connect test-mode flow, including a 10% platform commission, delayed test transfer, refund, and transfer reversal behavior.

LocalServe is a portfolio project. It must use only test data and Stripe test mode. It must never imply that it provides real escrow, regulated payment custody, identity verification, or production-ready financial services.

---

## 3. Goals and Non-Goals

### 3.1 MVP Goals

The MVP must allow a reviewer to complete the following end-to-end demonstration:

1. Register and verify one account.
2. Use that account as a customer and optionally create a provider profile.
3. Submit the provider profile for an administrator's quality review.
4. Create fixed-price services with durations under the provider's service area.
5. Discover an approved provider by customer location, category, distance, rating, and price.
6. Request a non-conflicting appointment.
7. Accept the request and complete a Stripe Connect test payment.
8. Move the booking through service execution and confirmation.
9. Release a test transfer after confirmation or the 72-hour confirmation deadline.
10. Demonstrate cancellation, refund, dispute, moderation, and verified review paths.

### 3.2 Non-Goals

The following are explicitly outside the MVP:

- Real-money operation or public commercial launch
- Legal escrow or money-transmitter functionality
- Real identity, background, licence, or document verification
- Hourly pricing, custom quotations, bargaining, or provider bidding
- Native iOS or Android applications
- Multi-language localization
- Real-time chat, SMS, or push notifications
- Map-based discovery view or route navigation
- Recurring bookings or multi-service carts
- Subscription plans, promoted listings, referrals, or loyalty programmes
- Artificial-intelligence matching or recommendations
- Tax calculation or legally compliant invoicing
- Production service-level guarantees

---

## 4. Actors and Account Model

| Actor                 | Capabilities                                                                                                                                                                                                                      |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Visitor**           | Browse approved providers and active services; choose a search location; view public reviews.                                                                                                                                     |
| **User / Customer**   | All visitor capabilities; create and manage booking requests; pay in test mode; cancel under the defined policy; dispute; review; create a provider profile.                                                                      |
| **Approved Provider** | All customer capabilities; publish fixed-price services; receive and manage booking requests; manage weekly availability and date overrides; complete Stripe Connect test onboarding; receive test transfers; respond to reviews. |
| **Administrator**     | Moderate users, profiles, services, bookings, reviews, categories, disputes, refunds, and demo configuration. Administrator accounts are never created through public registration.                                               |

### 4.1 Dual Capability

A normal account is always customer-capable. Provider capability is added to the same account when its provider profile is approved. A user must not need a second email address or account to both hire and provide services.

An administrator is a separate privileged account type. Administrative permissions must not be inferred from a provider profile or accepted from a public request.

---

## 5. MVP Scope and Functional Requirements

### 5.1 Authentication and Account Management

| ID      | Requirement                                                                                                                                                         |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AUTH-01 | A visitor must be able to register with name, normalized email address, and password.                                                                               |
| AUTH-02 | Public registration must create a normal user; it must never accept an administrator role.                                                                          |
| AUTH-03 | A new user must verify their email before login. Verification links expire after 24 hours and may be resent subject to rate limits.                                 |
| AUTH-04 | A verified active user must be able to log in and restore a session after refreshing the browser.                                                                   |
| AUTH-05 | A user must be able to request a password-reset link without the response revealing whether the email exists. Reset links expire after one hour and are single-use. |
| AUTH-06 | Logout must revoke the current refresh session. “Log out all devices” must revoke all refresh sessions for the user.                                                |
| AUTH-07 | Suspending a user must prevent new logins and protected actions. Existing paid bookings must remain visible to administrators for resolution.                       |
| AUTH-08 | Authentication errors must use generic messages where account enumeration would otherwise be possible.                                                              |

### 5.2 Provider Profile and Approval

| ID      | Requirement                                                                                                                                                                                                                                                                                                                                                                                      |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| PROF-01 | A verified normal user must be able to create one provider profile.                                                                                                                                                                                                                                                                                                                              |
| PROF-02 | The profile must contain a bio, general-area label, private GeoJSON point, service radius from 1–100 km, `acceptingNewBookings` flag, IANA time-zone identifier, weekly availability, and approval status.                                                                                                                                                                                       |
| PROF-03 | The profile may contain an avatar and portfolio images, but portfolio media is not an MVP completion blocker.                                                                                                                                                                                                                                                                                    |
| PROF-04 | Approval status must be one of `draft`, `pending`, `approved`, or `rejected`; multiple boolean approval flags must not be used.                                                                                                                                                                                                                                                                  |
| PROF-05 | A provider must have a complete profile and at least one active valid service before submitting for approval.                                                                                                                                                                                                                                                                                    |
| PROF-06 | An administrator must approve or reject a pending profile and must supply a reason when rejecting it.                                                                                                                                                                                                                                                                                            |
| PROF-07 | A rejected provider must be able to edit and resubmit the profile. Resubmission changes the status to `pending`.                                                                                                                                                                                                                                                                                 |
| PROF-08 | Changing the approved profile's bio, location, general area, service radius, or public media must return it to `pending`. Price changes, service activation, weekly availability, date overrides, and `acceptingNewBookings` do not require profile reapproval.                                                                                                                                  |
| PROF-09 | Only `approved`, unsuspended providers with `acceptingNewBookings=true` may appear in discovery results or accept new bookings. A profile returning to `pending` is hidden and cannot accept new requests, but already accepted bookings remain valid and may be fulfilled. Account suspension instead blocks protected actions and requires administrator resolution of affected paid bookings. |
| PROF-10 | “Approved” means profile-quality moderation only. The UI must not display “identity verified”, “background checked”, or an equivalent claim.                                                                                                                                                                                                                                                     |
| PROF-11 | Weekly availability consists of zero or more non-overlapping local-time windows for each weekday. Boundaries must use 15-minute increments; a window cannot cross midnight and must instead be split across two days.                                                                                                                                                                            |
| PROF-12 | A provider may define a date override that replaces the weekly windows for that local calendar date with either closed availability or custom windows. Schedule evaluation uses the provider's IANA time zone. Changes affect only future acceptance decisions and never cancel or alter an accepted booking.                                                                                    |

### 5.3 Service Listings

| ID      | Requirement                                                                                                                                                                                                             |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SERV-01 | A draft, pending, or approved provider-profile owner must be able to create, edit, activate, and deactivate their own services; services are public only while the profile is approved.                                 |
| SERV-02 | Every service must have a title, description, active category reference, active subcategory reference belonging to that category, fixed price, currency, duration, and active flag.                                     |
| SERV-03 | The MVP pricing type is fixed price only. Hourly and custom-quote values must not be accepted by the API or shown in the UI.                                                                                            |
| SERV-04 | The MVP currency is USD because all payments are portfolio demonstrations in Stripe test mode. Amounts must be displayed as USD and stored as integer cents.                                                            |
| SERV-05 | Service duration must be between 30 minutes and 8 hours in 15-minute increments.                                                                                                                                        |
| SERV-06 | Deactivation must be a soft change. Existing bookings retain their immutable service snapshot and must not be changed or deleted.                                                                                       |
| SERV-07 | Category and subcategory values must reference active administrator-managed records; arbitrary client-provided category names are not valid.                                                                            |
| SERV-08 | Deactivating a category or subcategory hides affected services from discovery and prevents new requests until the taxonomy is reactivated or the service is moved to active taxonomy. Existing bookings are unaffected. |

### 5.4 Location and Discovery

| ID     | Requirement                                                                                                                                                                                                                                                                                                                                                                                              |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| LOC-01 | Visitors must be able to use browser geolocation or choose a location through manual address search. Denying browser permission must not block manual discovery.                                                                                                                                                                                                                                         |
| LOC-02 | Discovery must require a validated latitude and longitude and must reject values outside geographic bounds.                                                                                                                                                                                                                                                                                              |
| LOC-03 | A provider qualifies only when its account is active, its profile is approved, it has `acceptingNewBookings=true`, it has at least one active matching service, it is inside the customer's selected search radius, and the customer is inside the provider's own service radius. Weekly schedule fit is evaluated when a customer selects a booking time, not against the visitor's current clock time. |
| LOC-04 | Default results must be sorted nearest first and must include calculated distance in kilometres.                                                                                                                                                                                                                                                                                                         |
| LOC-05 | The MVP must support category/subcategory, maximum distance, minimum rating, minimum fixed-price, and maximum fixed-price filters.                                                                                                                                                                                                                                                                       |
| LOC-06 | Sort options must be distance, rating, lowest matching fixed price, and newest approved provider.                                                                                                                                                                                                                                                                                                        |
| LOC-07 | When multiple services match, a provider card displays “From” using the lowest-priced active matching service.                                                                                                                                                                                                                                                                                           |
| LOC-08 | Public responses must never contain a provider's exact stored coordinates or private address. They expose only general area and calculated distance.                                                                                                                                                                                                                                                     |
| LOC-09 | Search coordinates are ephemeral client state unless the user explicitly saves a booking address. General browsing must not silently persist location history.                                                                                                                                                                                                                                           |
| LOC-10 | Results must be paginated with deterministic ordering and a maximum page size of 50.                                                                                                                                                                                                                                                                                                                     |

### 5.5 Booking Requests and Scheduling

| ID      | Requirement                                                                                                                                                                                                                                                                                                                                       |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| BOOK-01 | A logged-in active customer must be able to request one active fixed-price service from one approved, unsuspended provider with `acceptingNewBookings=true`, provided the proposed interval fits the provider's effective availability.                                                                                                           |
| BOOK-02 | A request must contain service ID, proposed start time, description, selected service-address coordinates, formatted address, and optional access instructions.                                                                                                                                                                                   |
| BOOK-03 | The API must derive the provider and price from the selected service. It must not trust client-provided provider IDs, prices, duration, fees, currency, or statuses.                                                                                                                                                                              |
| BOOK-04 | The API must verify that the service address is inside the provider's service radius, even if discovery used a different location.                                                                                                                                                                                                                |
| BOOK-05 | At request creation, the scheduled start must be on a 15-minute boundary, at least 3 hours and no more than 90 days in the future. The end time is derived from the service-duration snapshot. All stored instants use UTC.                                                                                                                       |
| BOOK-06 | A booking stores immutable snapshots of service title, category/subcategory, duration, price, currency, commission rate, platform fee, provider amount, provider/customer display identities, and the exact service address and coordinates. Later service/profile edits must not alter the booking.                                              |
| BOOK-07 | The provider may accept or reject a `requested` booking. Rejection requires a reason.                                                                                                                                                                                                                                                             |
| BOOK-08 | Accepting must revalidate approval, the availability toggle, the provider's effective weekly/date-override availability, both parties' eligibility, and all time rules. It must atomically reserve the requested interval for both provider and customer and fail with a conflict response if either party has an overlapping active reservation. |
| BOOK-09 | An accepted reservation remains held while payment is due. Expiry or cancellation releases it.                                                                                                                                                                                                                                                    |
| BOOK-10 | A provider may start a successfully paid booking during the half-open interval from 30 minutes before the scheduled start, inclusive, until 30 minutes after it, exclusive, provided no dispute is active. At the upper boundary, starting is no longer permitted and provider-no-show dispute eligibility begins.                                |
| BOOK-11 | Every transition must be authorized and enforced by the server using the expected current state. The client must never set a raw booking status.                                                                                                                                                                                                  |
| BOOK-12 | Booking lists must be role-aware, filterable by state, paginated, and ordered newest first by default.                                                                                                                                                                                                                                            |
| BOOK-13 | A user must not request or book a service owned by that user's own provider profile. The API must enforce this self-booking prohibition.                                                                                                                                                                                                          |
| BOOK-14 | Rescheduling is outside the MVP. A party must cancel or reject the existing booking under the applicable policy and create a new request.                                                                                                                                                                                                         |
| BOOK-15 | A new request receives `responseDeadline = min(createdAt + 24 hours, scheduledStart - 2 hours)`. If the provider has not accepted or rejected it by that instant, the system expires it.                                                                                                                                                          |
| BOOK-16 | A deadline is reached when `now >= deadline`; the action governed by that deadline is allowed only while `now < deadline`. Concurrent deadline jobs and user commands must use atomic expected-state updates so only one outcome succeeds.                                                                                                        |

### 5.6 Booking Lifecycle

The only booking statuses are:

| Status                  | Meaning                                                                                                  |
| ----------------------- | -------------------------------------------------------------------------------------------------------- |
| `requested`             | Customer submitted a request; provider has not acted.                                                    |
| `awaiting_payment`      | Provider accepted and the interval is reserved; customer must pay.                                       |
| `scheduled`             | Stripe test payment succeeded; service is ready to start.                                                |
| `in_progress`           | Provider marked the service as started.                                                                  |
| `awaiting_confirmation` | Provider marked the work complete; customer may confirm or dispute.                                      |
| `completed`             | Customer confirmed or the 72-hour deadline elapsed without a dispute.                                    |
| `rejected`              | Provider rejected the request. Terminal.                                                                 |
| `cancelled`             | An authorized cancellation or a full-refund non-delivery dispute resolution ended the booking. Terminal. |
| `expired`               | The provider-response deadline or payment deadline elapsed. Terminal.                                    |

Valid transitions are:

| From                    | Action and actor                                             | To                      |
| ----------------------- | ------------------------------------------------------------ | ----------------------- |
| —                       | Customer creates valid request                               | `requested`             |
| `requested`             | Provider accepts                                             | `awaiting_payment`      |
| `requested`             | Provider rejects with reason                                 | `rejected`              |
| `requested`             | Customer cancels                                             | `cancelled`             |
| `requested`             | Response deadline passes                                     | `expired`               |
| `awaiting_payment`      | Stripe webhook confirms payment                              | `scheduled`             |
| `awaiting_payment`      | Customer or provider cancels                                 | `cancelled`             |
| `awaiting_payment`      | Payment deadline passes                                      | `expired`               |
| `scheduled`             | Provider starts                                              | `in_progress`           |
| `scheduled`             | Customer cancels before scheduled start, or provider cancels | `cancelled`             |
| `in_progress`           | Provider marks work complete                                 | `awaiting_confirmation` |
| `in_progress`           | Provider cancels                                             | `cancelled`             |
| `awaiting_confirmation` | Customer confirms                                            | `completed`             |
| `awaiting_confirmation` | 72 hours pass without an active dispute                      | `completed`             |

An administrator may force-cancel a nonterminal booking for a documented moderation or support reason only when no dispute is active. The action releases schedule reservations and queues one full test refund when payment succeeded. An active dispute must use the dispute-resolution path instead. Dispute state is orthogonal and must not be represented as a booking status. `completed`, `rejected`, `cancelled`, and `expired` are terminal lifecycle states; a post-completion dispute changes financial/dispute records but does not reopen the booking lifecycle.

### 5.7 Payment, Commission, Transfer, and Refund Demonstration

| ID     | Requirement                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PAY-01 | All payment features must run in Stripe test mode. The UI must visibly label checkout, earnings, refunds, and transfers as demonstrations.                                                                                                                                                                                                                                                                                               |
| PAY-02 | LocalServe must demonstrate Stripe Connect Express test onboarding for providers. A provider must be test-payout capable before accepting a paid booking.                                                                                                                                                                                                                                                                                |
| PAY-03 | Payment is initiated only for a booking in `awaiting_payment`; repeated requests must return or reuse the same valid PaymentIntent where appropriate.                                                                                                                                                                                                                                                                                    |
| PAY-04 | Payment is due within 24 hours after provider acceptance or two hours before the scheduled start, whichever occurs first. The API must not allow an acceptance whose payment deadline would already have passed.                                                                                                                                                                                                                         |
| PAY-05 | Stripe webhook verification and state, not a frontend redirect, determines whether payment succeeded.                                                                                                                                                                                                                                                                                                                                    |
| PAY-06 | The platform commission is 10% of the service price. It is stored as 1,000 basis points and snapshotted on the booking.                                                                                                                                                                                                                                                                                                                  |
| PAY-07 | `platformFeeCents = roundHalfUp(grossAmountCents × 1000 / 10000)` and `providerAmountCents = grossAmountCents − platformFeeCents`. All values are integer cents.                                                                                                                                                                                                                                                                         |
| PAY-08 | The demonstration uses separate charges and transfers. It must be described as delayed test transfer, never escrow.                                                                                                                                                                                                                                                                                                                      |
| PAY-09 | A provider test transfer becomes eligible only when the booking reaches `completed` and no dispute is active.                                                                                                                                                                                                                                                                                                                            |
| PAY-10 | Customer confirmation makes the transfer eligible and queues a release attempt immediately. Otherwise, the system auto-completes and queues release 72 hours after the provider marks work complete, provided no dispute is active. `released` is recorded only after Stripe confirms success.                                                                                                                                           |
| PAY-11 | Customer cancellation before the scheduled start receives a full test refund if payment succeeded. Provider cancellation before `awaiting_confirmation` also receives a full test refund.                                                                                                                                                                                                                                                |
| PAY-12 | At or after the scheduled start, or once work starts, the customer cannot directly cancel; they must use the applicable dispute flow.                                                                                                                                                                                                                                                                                                    |
| PAY-13 | A refund proportionally reduces both platform commission and provider entitlement. Calculations must use cumulative refunded cents and then apply only the delta for the current refund, preventing rounding drift across multiple partial refunds. If a transfer has already been released, the system must reverse up to the provider-recovery delta. Partial and full reversal outcomes must be stored independently from the refund. |
| PAY-14 | Payment, transfer, and refund operations must be idempotent, auditable, and recoverable after a process restart.                                                                                                                                                                                                                                                                                                                         |
| PAY-15 | Test processing fees may be shown for educational purposes but do not change the contractual 10% commission or provider amount in the demo ledger.                                                                                                                                                                                                                                                                                       |
| PAY-16 | If a late Stripe success arrives after the booking was cancelled or expired, the booking remains terminal and the system must queue one idempotent full refund.                                                                                                                                                                                                                                                                          |

Payment state must be separate from booking state:

- `unpaid`
- `processing`
- `succeeded`
- `failed`
- `partially_refunded`
- `refunded`

Transfer state must be separate:

- `not_eligible`
- `pending_release`
- `released`
- `partially_reversed`
- `reversed`
- `failed`

### 5.8 Cancellation and Disputes

| ID      | Requirement                                                                                                                                                                                                                                                                                                                                                                                                        |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| DISP-01 | Customer cancellation is permitted in `requested` and `awaiting_payment`, and in `scheduled` only before the scheduled start. A succeeded payment is fully refunded.                                                                                                                                                                                                                                               |
| DISP-02 | A provider must reject rather than cancel a `requested` booking. After acceptance, the provider may cancel through `in_progress`; a succeeded payment is fully refunded.                                                                                                                                                                                                                                           |
| DISP-03 | At or after the scheduled start, or after service start, a customer must use the dispute flow instead of cancellation.                                                                                                                                                                                                                                                                                             |
| DISP-04 | A customer may open a dispute for: provider no-show while still `scheduled` when `now >= scheduledStart + 30 minutes`; an `in_progress` or `awaiting_confirmation` booking; or a `completed` booking while `now < completedAt + 24 hours`.                                                                                                                                                                         |
| DISP-05 | A booking may have only one active dispute (`open` or `under_review`). Opening one freezes automatic completion and any unreleased transfer. A dispute opened after transfer release freezes further financial action until resolution.                                                                                                                                                                            |
| DISP-06 | Reasons are `service_not_done`, `poor_quality`, `provider_no_show`, `overcharged`, and `other`; a description is mandatory.                                                                                                                                                                                                                                                                                        |
| DISP-07 | Dispute statuses are `open`, `under_review`, `resolved_customer`, `resolved_provider`, and `withdrawn`.                                                                                                                                                                                                                                                                                                            |
| DISP-08 | The administrator may resolve for the customer with a full or partial test refund, or for the provider with no refund. A pre-completion booking becomes `cancelled` only when the administrator records that the service was not delivered and grants a full refund; otherwise it becomes or remains `completed`. Provider resolution makes the booking become or remain `completed` and permits transfer release. |
| DISP-09 | Resolution must store administrator, timestamp, note, refund amount, and resulting payment/transfer references.                                                                                                                                                                                                                                                                                                    |
| DISP-10 | The customer may withdraw a dispute only while it is `open`. An administrator may move `open` to `under_review`; only an administrator may resolve it. Withdrawal resumes the existing lifecycle deadlines, and an already elapsed deadline is processed on the next worker run.                                                                                                                                   |
| DISP-11 | A customer-favouring resolution after a transfer was released must queue the proportional transfer reversal defined by PAY-13. The booking remains `completed`; dispute, refund, transfer, and audit records show the adjustment.                                                                                                                                                                                  |

### 5.9 Reviews and Ratings

| ID     | Requirement                                                                                                                                         |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| REV-01 | Only the booking customer may review a `completed` booking that has no active dispute.                                                              |
| REV-02 | Only one review is allowed per booking. Rating is an integer from 1–5; comment length is 1–1,000 characters.                                        |
| REV-03 | Reviews must be labelled as verified because they reference a completed booking.                                                                    |
| REV-04 | Provider rating average and count must be recomputed safely when a visible review is created, hidden, or restored.                                  |
| REV-05 | A provider may submit one response of up to 500 characters and may later edit it.                                                                   |
| REV-06 | Administrators soft-hide abusive reviews with a recorded reason. Financial and audit records must never be physically deleted through the admin UI. |

### 5.10 Notifications

| ID       | Requirement                                                                                                                                                                                                                                 |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| NOTIF-01 | MVP email events are registration verification, password reset, provider-profile approval/rejection, booking request, acceptance, rejection, payment success, cancellation, work completion, dispute updates, refund, and transfer release. |
| NOTIF-02 | Booking/payment success must not depend on successful email delivery. Email work is queued after the domain transaction commits.                                                                                                            |
| NOTIF-03 | Retried events must not send duplicate emails for the same event and recipient.                                                                                                                                                             |
| NOTIF-04 | In-app notification centre and real-time delivery are post-MVP.                                                                                                                                                                             |

### 5.11 Administration

| ID       | Requirement                                                                                                                                                                                                                                                                                                    |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ADMIN-01 | Administrators must be able to list and inspect users, provider profiles, services, bookings, payments, transfers, disputes, reviews, and categories.                                                                                                                                                          |
| ADMIN-02 | Administrators may suspend/reactivate users, moderate services/reviews, approve/reject profiles, force-cancel nonterminal bookings with a reason, and resolve disputes. Refunds outside ordinary cancellation must be produced only by a documented dispute resolution, not by an unrestricted refund control. |
| ADMIN-03 | Category and subcategory records may be created, renamed, ordered, activated, and deactivated. Historical booking snapshots remain unchanged.                                                                                                                                                                  |
| ADMIN-04 | Every privileged mutation must create an immutable audit entry containing actor, action, target, timestamp, and safe before/after metadata.                                                                                                                                                                    |
| ADMIN-05 | The dashboard must distinguish demo gross volume, 10% commission, refunds, pending transfers, and released transfers. It must not label test values as real revenue.                                                                                                                                           |

---

## 6. Privacy and Visibility Rules

| Information                                            | Before payment                                                 | After successful payment        | Administrator                           |
| ------------------------------------------------------ | -------------------------------------------------------------- | ------------------------------- | --------------------------------------- |
| Provider general area                                  | Public                                                         | Visible                         | Visible                                 |
| Provider exact coordinates/private address             | Hidden                                                         | Hidden                          | Visible only when needed for moderation |
| Customer approximate service area                      | Provider sees general area on request                          | Visible                         | Visible                                 |
| Customer exact service address and access instructions | Hidden from provider                                           | Visible to assigned provider    | Visible for support/disputes            |
| User email and phone                                   | Hidden from public and other party                             | Visible only to booking parties | Visible for support                     |
| Payment method details                                 | Stripe-hosted/Stripe Elements only; never stored by LocalServe | Same                            | Masked Stripe metadata only             |

Seeded and public demo profiles must use fictional identity, location, and contact data. A reviewer may use a real email address solely to exercise verification. Repository seed data must not contain real personal information or real card details.

---

## 7. Non-Functional Requirements

### 7.1 Security

- Passwords must use an adaptive password-hashing algorithm.
- Refresh credentials must be HttpOnly, Secure in deployed environments, rotated, revocable, and stored only as hashes server-side.
- Authorization must be checked for every resource and action; possession of an object ID is never authorization.
- Request bodies, parameters, files, pagination, and geo coordinates must have explicit allowlists and size limits.
- Stripe webhook signatures must be verified against the untouched request body.
- Secrets and test keys must never be committed.
- The project should target OWASP ASVS 5.0 Level 1 controls applicable to this architecture.

### 7.2 Reliability and Consistency

- Booking transitions use atomic expected-state writes.
- Scheduling reservations, booking updates, and financial-ledger writes use transactions when multiple documents must change together.
- External side effects use idempotency keys, durable records, retries with bounded backoff, and reconciliation jobs.
- Duplicate and out-of-order webhooks must not corrupt state or duplicate refunds/transfers.
- A process restart must not lose accepted domain events or queued notifications.

### 7.3 Performance

- On a warm demo deployment, ordinary read APIs should achieve p95 latency below 500 ms under the documented demo workload.
- Paginated discovery should achieve p95 below 1 second for up to 10,000 provider profiles within the dataset.
- The primary page content should target a Largest Contentful Paint below 2.5 seconds on a typical mobile broadband connection, excluding free-host cold starts.
- Routes must be code-split so the initial production JavaScript bundle does not include customer, provider, and admin dashboards together.

### 7.4 Accessibility and Responsiveness

- Customer, provider, authentication, checkout, and admin flows must target WCAG 2.2 AA.
- All functionality must be keyboard operable with visible focus, labelled inputs, accessible error messages, sufficient contrast, and non-colour status indicators.
- Supported layouts are 360 px mobile width through desktop screens.

### 7.5 Compatibility

- The application supports the browser baseline documented for the chosen Vite version.
- JavaScript and cookies are required for authenticated flows.
- A clear fallback must be shown when geolocation is unavailable or denied.

### 7.6 Observability and Audit

- Server logs must be structured and include request/correlation ID, route, status, duration, and safe error metadata.
- Secrets, raw tokens, full addresses, and payment data must not be logged.
- Payment, transfer, refund, webhook, scheduled-job, and email failures must be discoverable from logs and admin/demo status views.

### 7.7 Testing and Release Gates

The MVP is not complete unless:

- TypeScript builds succeed for client and server.
- Lint completes with zero errors.
- Unit tests cover validation, money calculation, permissions, state transitions, time rules, and distance rules.
- Integration tests cover authentication, provider discovery, booking conflicts, Stripe webhooks, idempotency, refunds, disputes, and review eligibility.
- At least one automated browser test covers the successful customer-to-provider journey.
- CI runs build, lint, and test checks for every pull request.

---

## 8. MVP Acceptance Scenarios

### Scenario A — Dual-role onboarding

1. User registers and verifies email.
2. User can immediately browse and request services as a customer.
3. The same user creates a provider profile and fixed-price service.
4. Administrator rejects it with a reason.
5. User edits and resubmits it.
6. Administrator approves it; provider capability becomes available.

### Scenario B — Discovery and booking

1. Visitor denies browser geolocation and manually selects a location.
2. Discovery returns only providers covering that location.
3. Customer chooses a fixed service and address inside the provider radius.
4. Provider accepts; an overlapping acceptance attempt is rejected.
5. Customer completes a Stripe test payment.
6. Verified webhook moves the booking to `scheduled`.

### Scenario C — Completion and transfer

1. Provider starts and completes the service.
2. Customer confirms within 72 hours.
3. Booking becomes `completed`.
4. One idempotent Stripe Connect test transfer for 90% is recorded as released.
5. Customer submits one verified review.

### Scenario D — Cancellation and refund

1. A paid scheduled booking is cancelled before the scheduled start.
2. Booking becomes `cancelled`, the reservation is released, and one full test refund is recorded.
3. Repeating the command or webhook does not create a second refund.

### Scenario E — Dispute

1. Customer opens a dispute after work starts.
2. Transfer release is frozen.
3. Administrator issues a partial test refund and records a resolution.
4. Booking, payment, dispute, and audit histories remain internally consistent.

### Scenario F — Post-transfer reversal

1. A booking completes and its 90% provider test transfer is released.
2. The customer opens a dispute within 24 hours of completion.
3. The administrator resolves for the customer with a partial test refund.
4. The booking remains `completed`; the system records the refund, proportional commission reduction, and proportional transfer reversal exactly once.
5. Payment, transfer, dispute, and audit histories remain internally consistent.

---

## 9. Delivery Phases

| Phase                                        | Scope                                                                                                                |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **0 — Source-of-truth alignment**            | Adopt v2.0 documents; align account model, contracts, status names, amounts, and project metadata.                   |
| **1 — Authentication hardening**             | Dual-capability account, refresh sessions/rotation, logout revocation, authorization policies, tests.                |
| **2 — Provider and discovery completion**    | Approval enum/resubmission, fixed-price duration, manual location search, privacy-safe DTOs, filters and pagination. |
| **3 — Booking and scheduling**               | Immutable snapshots, reservations, conflict prevention, lifecycle commands, expiration and emails.                   |
| **4 — Stripe test-mode marketplace flow**    | Connect test onboarding, PaymentIntent, webhooks, 10% ledger, transfers, refunds, reversals and reconciliation.      |
| **5 — Reviews, disputes and administration** | Verified reviews, dispute resolution, audit log, category management and demo dashboards.                            |
| **6 — Quality and portfolio release**        | Automated tests, CI, accessibility, route splitting, observability, seeded demo, deployment and README walkthrough.  |

---

## 10. Final MVP Definition

LocalServe v1.0 MVP is complete when all mandatory requirements and acceptance scenarios in this document pass in a deployed or locally reproducible portfolio demonstration using fictional data and Stripe test mode.

Features must not be described as complete merely because their files, models, routes, or placeholder screens exist.

---

_End of Product Specification v2.0_
