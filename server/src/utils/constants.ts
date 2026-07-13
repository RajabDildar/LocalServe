export const BOOKING_STATUSES = [
  "pending",
  "accepted",
  "paid",
  "rejected",
  "cancelled",
  "in_progress",
  "completed",
  "confirmed",
  "disputed",
  "refunded",
];

export const DISPUTE_STATUSES = [
  "open",
  "under_review",
  "resolved_refund",
  "resolved_no_action",
];
export const DISPUTE_REASONS = [
  "service_not_done",
  "poor_quality",
  "no_show",
  "overcharged",
  "other",
];

export const PLATFORM_COMMISSION_PERCENT = Number(
  process.env.PLATFORM_COMMISSION_PERCENT || 10,
);
export const AUTO_RELEASE_DAYS = Number(process.env.AUTO_RELEASE_DAYS || 4);

export const AVAILABLE_ROLES = ["customer", "provider", "admin"];

// only these two roles can be chosen via public registration. Admin accounts are only ever created via the seed script.
export const PUBLIC_REGISTRATION_ROLES = ["customer", "provider"];
