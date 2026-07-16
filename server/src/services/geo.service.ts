import ProviderProfile from "../models/ProviderProfile";

export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number => {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371; // Earth's radius in km
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
  sort,
  minRating,
  page = 1,
  limit = 20,
}: {
  lat: number;
  lng: number;
  radiusKm: number;
  categoryId?: string;
  sort?: string;
  minRating?: number;
  page?: number;
  limit?: number;
}) => {
  const radiusMeters = radiusKm * 1000;

  const query: {
    location: {
      $near: {
        $geometry: { type: "Point"; coordinates: [number, number] };
        $maxDistance: number;
      };
    };
    isApproved: boolean;
    isAvailable: boolean;
    avgRating?: { $gte: number };
  } = {
    location: {
      $near: {
        $geometry: { type: "Point", coordinates: [lng, lat] },
        $maxDistance: radiusMeters,
      },
    },
    isApproved: true,
    isAvailable: true,
  };

  if (minRating) query.avgRating = { $gte: minRating };

  const providers = await ProviderProfile.find(query)
    .populate("userId", "name avatar")
    .skip((page - 1) * limit)
    .limit(limit);

  return providers.map((p) => ({
    ...p.toObject(),
    distanceKm: calculateDistance(
      lat,
      lng,
      p.location.coordinates[1],
      p.location.coordinates[0],
    ),
  }));
};
