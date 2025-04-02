import { Request, Response } from "express";
import { catchAsyncHandler } from "../utils/asyncHandler.utils";
import { CustomError } from "../middleware/errorhandler.middleware";
import category from "../models/category.model";
import { getPagination } from "../utils/pagination.utils";

//Create category
export const createCategory = catchAsyncHandler(
  async (req: Request, res: Response) => {
    const body = req.body;
    const created = await category.create(body);
    res.status(200).json({
      status: "success",
      success: true,
      data: created,
      message: "Category created successfully",
    });
  }
);

// get all category
export const getAllCategory = catchAsyncHandler(
  async (req: Request, res: Response) => {
    const { limit, page, query } = req.query;
    const queryLimit = parseInt(limit as string) || 10;
    const currentPage = parseInt(page as string) || 1;
    const skip = (currentPage - 1) * queryLimit;

    let filter: Record<string, any> = {};
    if (query) {
      filter.$or = [
        {
          categoryName: { $regex: query, $options: "i" },
        },
        {
          categoryDescription: { $regex: query, $options: "i" },
        },
      ];
    }

    const Category = await category
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(queryLimit)
      .skip(skip);

    const totalCount = await category.countDocuments(filter);
    const pagination = getPagination(currentPage, queryLimit, totalCount);

    res.status(200).json({
      status: "success",
      success: true,
      data: {
        data: Category,
        pagination,
      },
      message: "Category fetched successfully.",
    });
  }
);

//Update category
export const updateCategory = catchAsyncHandler(
  async (req: Request, res: Response) => {
    const body = req.body;
    const id = req.params.id;
    if (!id) {
      throw new CustomError("id is required", 404);
    }
    const Category = await category.findByIdAndUpdate(id, body, { new: true });
    if (!Category) {
      throw new CustomError("Category not found", 404);
    }
    res.status(200).json({
      status: "success",
      success: true,
      data: Category,
      message: "Category updated successfully",
    });
  }
);

//Delete Category
export const deleteCategory = catchAsyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    if (!id) {
      throw new CustomError("id is required", 404);
    }
    const Category = await category.findById(id);
    if (!Category) {
      throw new CustomError("Category not found", 404);
    }
    await category.findByIdAndDelete(Category._id);
    res.status(200).json({
      status: "success",
      success: true,
      data: Category,
      message: "Category deleted successfully",
    });
  }
);

//Find by id

export const getCategoryById = catchAsyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    if (!id) {
      throw new CustomError("id is required", 404);
    }
    const Category = await category.findById(id);
    if (!Category) {
      throw new CustomError("Category not found", 404);
    }
    res.status(200).json({
      status: "success",
      success: true,
      data: Category,
      message: "Category deleted successfully",
    });
  }
);
