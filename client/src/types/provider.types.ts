export interface IProvider {
  _id: string;
  userId: {
    _id: string;
    name: string;
    avatar?: string;
  };
  bio?: string;
  location: {
    type: "Point";
    coordinates: [number, number]; // [lng, lat]
  };
  serviceRadius: number; // in km
  isApproved: boolean;
  isAvailable: boolean;
  avgRating: number;
  reviewCount: number;
  distanceKm?: number;
}
