import { z } from "zod";

export const rejectProviderSchema = z.object({
  reason: z.string().min(5).max(500),
});

export const providerProfileSchema = z.object({
  bio: z.string().max(1000).optional(),
  serviceRadius: z.number().positive().min(1),
  location: z.object({
    type: z.literal("Point"),
    coordinates: z.tuple([z.number(), z.number()]), // [lng, lat]
  }),
});

export const serviceSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(1000),
  categoryId: z.string().regex(/^[0-9a-fA-F]{24}$/),
  subcategory: z.string().optional(),
  pricingType: z.enum(["fixed", "hourly", "custom"]),
  price: z.number().nonnegative().optional().nullable(),
});
