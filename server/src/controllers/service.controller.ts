import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import Service from "../models/Service";
import ProviderProfile from "../models/ProviderProfile";
import { Request, Response } from "express";

export const listByProvider = asyncHandler(
  async (req: Request, res: Response) => {
    const services = await Service.find({
      providerId: req.params.providerId,
      isActive: true,
    });
    res.status(200).json(new ApiResponse({ statusCode: 200, data: services }));
  },
);

export const create = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, "Unauthorized");
  const profile = await ProviderProfile.findOne({ userId: req.user._id });
  if (!profile) throw new ApiError(404, "Provider profile not found");

  const service = await Service.create({
    ...req.body,
    providerId: profile._id,
  });
  res.status(201).json(new ApiResponse({ statusCode: 201, data: service }));
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, "Unauthorized");
  const profile = await ProviderProfile.findOne({ userId: req.user._id });
  if (!profile) throw new ApiError(404, "Provider profile not found");

  const service = await Service.findOneAndUpdate(
    { _id: req.params.id, providerId: profile._id },
    req.body,
    { new: true },
  );
  if (!service) throw new ApiError(404, "Service not found");
  res.status(200).json(new ApiResponse({ statusCode: 200, data: service }));
});

export const deactivate = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, "Unauthorized");
  const profile = await ProviderProfile.findOne({ userId: req.user._id });
  if (!profile) throw new ApiError(404, "Provider profile not found");

  const service = await Service.findOneAndUpdate(
    { _id: req.params.id, providerId: profile._id },
    { isActive: false },
    { new: true },
  );
  if (!service) throw new ApiError(404, "Service not found");
  res.status(200).json(new ApiResponse({ statusCode: 200, data: service }));
});
