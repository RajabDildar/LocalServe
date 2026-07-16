import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import Category from "../models/Category";
import { Request, Response } from "express";

export const listCategories = asyncHandler(
  async (req: Request, res: Response) => {
    const categories = await Category.find({ isActive: true }).sort({
      name: 1,
    });
    res
      .status(200)
      .json(new ApiResponse({ statusCode: 200, data: categories }));
  },
);
