import { review } from "./../models/review.model";
import { Request, Response } from "express";
import { catchAsyncHandler } from "../utils/asyncHandler.utils";
import { CustomError } from "../middleware/errorhandler.middleware";
import product from "../models/product.model";
import { getPagination } from "../utils/pagination.utils";

//?Create review
export const createReview = catchAsyncHandler(
  async (req: Request, res: Response) => {
    const body = req.body;
    const { productId, rating } = body;

    // Validate required fields
    if (!productId) {
      throw new CustomError("Product ID are required.", 404);
    }
    const user = req.User;
    // Find the product
    const Product = await product.findById(productId);
    if (!Product) {
      throw new CustomError("Product not found", 404);
    }

    // Create the review
    const reviewed = await review.create({
      ...body,
      product: productId,
      user: user._id,
    });
    Product.productReviews.push(reviewed._id);
    let totalRating;
    if (Product.productReviews.length === 1) {
      totalRating = rating;
    } else {
      totalRating =
        (Product.averageRating as number) *
          (Product.productReviews.length - 1) +
        Number(rating);
    }
    Product.averageRating = totalRating / Product.productReviews.length;
    await Product.save();

    res.status(200).json({
      status: "success",
      success: true,
      data: reviewed,
      message: "Review created successfully",
    });
  }
);

//?get all review
export const getAllReview = catchAsyncHandler(
  async (req: Request, res: Response) => {
    const { limit, page, product, minRating, maxRating } = req.query;
    const queryLimit = parseInt(limit as string) || 10;
    const currentPage = parseInt(page as string) || 1;
    const skip = (currentPage - 1) * queryLimit;
    let filter: Record<string, any> = {};
    if (product) {
      filter.product = product;
    }

    if (minRating && maxRating) {
      filter.rating = {
        $lte: parseFloat(maxRating as string),
        $gte: parseFloat(minRating as string),
      };
    }

    const Review = await review
      .find(filter)
      .limit(queryLimit)
      .skip(skip)
      .populate("user")
      .populate("product")
      .sort({ createdAt: -1 });
    const totalCount = await review.countDocuments(filter);
    const pagination = getPagination(currentPage, queryLimit, totalCount);

    res.status(200).json({
      status: "success",
      success: true,
      data: {
        data: Review,
        pagination,
      },
      message: "Reviews fetched successfully.",
    });
  }
);

//?Update review
export const updateReview = catchAsyncHandler(
  async (req: Request, res: Response) => {
    const { rating } = req.body;
    const id = req.params.id;

    // Find the existing review
    const existingReview = await review.findById(id);
    if (!existingReview) {
      throw new CustomError("Review not found", 404);
    }

    // If rating is updated recalculate the average rating
    let oldRating = existingReview.rating;

    // Update the review
    const updatedReview = await review.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedReview) {
      throw new CustomError("Failed to update review", 500);
    }

    // Find the product associated with this review
    const Product = await product.findById(updatedReview.product);
    if (!Product) {
      throw new CustomError("Associated product not found", 404);
    }

    // Recalculate the average rating
    if (rating !== undefined && rating !== oldRating) {
      let totalRating =
        (Product.averageRating as number) * Product.productReviews.length -
        oldRating +
        rating;
      Product.averageRating = totalRating / Product.productReviews.length;
      await Product.save();
    }

    res.status(200).json({
      status: "success",
      success: true,
      data: updatedReview,
      message: "Review updated successfully",
    });
  }
);

//?Delete review
export const deleteReview = catchAsyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    // Find and delete the review
    const Review = await review.findByIdAndDelete(id);
    if (!Review) {
      throw new CustomError("Review not found", 404);
    }

    // Remove review from the  product's review list (only if Review exists)
    if (Review.product) {
      await product.findByIdAndUpdate(Review.product, {
        $pull: { productReviews: Review._id },
      });
    }

    res.status(200).json({
      status: "success",
      success: true,
      data: Review,
      message: "Review deleted successfully",
    });
  }
);

//? Get review by productId
export const getReviewByProductId = catchAsyncHandler(
  async (req: Request, res: Response) => {
    const productId = req.params.id;
    const Reviews = await review.find({ product: productId }).populate("user");

    res.status(200).json({
      success: true,
      status: "Success",
      data: Reviews,
    });
  }
);
