import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import ProviderProfile from "../models/ProviderProfile";
import * as geoService from "../services/geo.service";
import { Request, Response } from "express";

export const getMyProfile = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, "Unauthorized");
    const profile = await ProviderProfile.findOne({ userId: req.user._id });
    if (!profile) throw new ApiError(404, "Profile not found");
    res.status(200).json(new ApiResponse({ statusCode: 200, data: profile }));
  },
);

export const createOrUpdateProfile = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, "Unauthorized");
    const profile = await ProviderProfile.findOneAndUpdate(
      { userId: req.user._id },
      { ...req.body, userId: req.user._id },
      { new: true, upsert: true },
    );
    res.status(200).json(new ApiResponse({ statusCode: 200, data: profile }));
  },
);

export const toggleAvailability = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, "Unauthorized");
    const profile = await ProviderProfile.findOne({ userId: req.user._id });
    if (!profile) throw new ApiError(404, "Profile not found");
    profile.isAvailable = !profile.isAvailable;
    await profile.save();
    res.status(200).json(new ApiResponse({ statusCode: 200, data: profile }));
  },
);

export const getNearby = asyncHandler(async (req: Request, res: Response) => {
  const { lat, lng, radius, categoryId, minRating } = req.query;
  if (!lat || !lng) throw new ApiError(400, "Latitude and longitude required");

  const providers = await geoService.findNearbyProviders({
    lat: Number(lat),
    lng: Number(lng),
    radiusKm: Number(radius) || 10,
    categoryId: categoryId as string,
    minRating: minRating ? Number(minRating) : undefined,
  });

  res.status(200).json(new ApiResponse({ statusCode: 200, data: providers }));
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const profile = await ProviderProfile.findById(req.params.id).populate(
    "userId",
    "name avatar",
  );
  if (!profile) throw new ApiError(404, "Provider not found");
  res.status(200).json(new ApiResponse({ statusCode: 200, data: profile }));
});
