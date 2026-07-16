import ProviderProfile from "../models/ProviderProfile";
import Service from "../models/Service";
import { Types } from "mongoose";

export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number => {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const findNearbyProviders = async ({
  lat,
  lng,
  radiusKm,
  categoryId,
  minRating,
  page = 1,
  limit = 20,
}: {
  lat: number;
  lng: number;
  radiusKm: number;
  categoryId?: string;
  minRating?: number;
  page?: number;
  limit?: number;
}) => {
  const radiusMeters = radiusKm * 1000;

  // ProviderProfile has no categoryId field — category lives on Service.
  // So a category filter means "providers who have an active service in that category".
  let providerIdFilter: Types.ObjectId[] | undefined;
  if (categoryId) {
    providerIdFilter = await Service.distinct("providerId", {
      categoryId,
      isActive: true,
    });
    if (providerIdFilter.length === 0) return [];
  }

  const providers = await ProviderProfile.aggregate([
    {
      $geoNear: {
        near: { type: "Point", coordinates: [lng, lat] },
        distanceField: "distanceMeters",
        maxDistance: radiusMeters,
        spherical: true,
        query: {
          isApproved: true,
          isAvailable: true,
          ...(minRating && { avgRating: { $gte: minRating } }),
          ...(providerIdFilter && { _id: { $in: providerIdFilter } }),
        },
      },
    },
    // A provider only counts if the customer is inside THAT provider's
    // own serviceRadius, not just inside whatever radius the customer searched.
    {
      $match: {
        $expr: {
          $lte: ["$distanceMeters", { $multiply: ["$serviceRadius", 1000] }],
        },
      },
    },
    { $sort: { distanceMeters: 1 } },
    { $skip: (page - 1) * limit },
    { $limit: limit },
  ]);

  await ProviderProfile.populate(providers, {
    path: "userId",
    select: "name avatar",
  });

  return providers.map((p) => ({
    ...p,
    distanceKm: p.distanceMeters / 1000,
  }));
};
