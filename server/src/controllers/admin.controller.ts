import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import ProviderProfile from "../models/ProviderProfile";
import { Request, Response } from "express";
import { ApiResponse } from "../utils/ApiResponse";

export const getPendingProviders = asyncHandler(
  async (req: Request, res: Response) => {
    const providers = await ProviderProfile.find({
      isApproved: false,
      isRejected: false, // don't keep showing rejected ones as "pending"
    }).populate("userId", "name email");
    res.status(200).json(new ApiResponse({ statusCode: 200, data: providers }));
  },
);

export const approveProvider = asyncHandler(
  async (req: Request, res: Response) => {
    const provider = await ProviderProfile.findByIdAndUpdate(
      req.params.id,
      { isApproved: true, isRejected: false, rejectionReason: undefined },
      { new: true },
    );
    if (!provider) throw new ApiError(404, "Provider not found");
    res.status(200).json(new ApiResponse({ statusCode: 200, data: provider }));
  },
);

export const rejectProvider = asyncHandler(
  async (req: Request, res: Response) => {
    const { reason } = req.body;
    const provider = await ProviderProfile.findByIdAndUpdate(
      req.params.id,
      { isApproved: false, isRejected: true, rejectionReason: reason },
      { new: true },
    );
    if (!provider) throw new ApiError(404, "Provider not found");
    res.status(200).json(new ApiResponse({ statusCode: 200, data: provider }));
  },
);
