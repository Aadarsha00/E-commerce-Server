"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReviewByProductId = exports.deleteReview = exports.updateReview = exports.getAllReview = exports.createReview = void 0;
const review_model_1 = require("./../models/review.model");
const asyncHandler_utils_1 = require("../utils/asyncHandler.utils");
const errorhandler_middleware_1 = require("../middleware/errorhandler.middleware");
const product_model_1 = __importDefault(require("../models/product.model"));
const pagination_utils_1 = require("../utils/pagination.utils");
//?Create review
exports.createReview = (0, asyncHandler_utils_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { productId, rating } = body;
    // Validate required fields
    if (!productId) {
        throw new errorhandler_middleware_1.CustomError("Product ID are required.", 404);
    }
    const user = req.User;
    // Find the product
    const Product = yield product_model_1.default.findById(productId);
    if (!Product) {
        throw new errorhandler_middleware_1.CustomError("Product not found", 404);
    }
    // Create the review
    const reviewed = yield review_model_1.review.create(Object.assign(Object.assign({}, body), { product: productId, user: user._id }));
    Product.productReviews.push(reviewed._id);
    let totalRating;
    if (Product.productReviews.length === 1) {
        totalRating = rating;
    }
    else {
        totalRating =
            Product.averageRating *
                (Product.productReviews.length - 1) +
                Number(rating);
    }
    Product.averageRating = totalRating / Product.productReviews.length;
    yield Product.save();
    res.status(200).json({
        status: "success",
        success: true,
        data: reviewed,
        message: "Review created successfully",
    });
}));
//?get all review
exports.getAllReview = (0, asyncHandler_utils_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, product, minRating, maxRating } = req.query;
    const queryLimit = parseInt(limit) || 10;
    const currentPage = parseInt(page) || 1;
    const skip = (currentPage - 1) * queryLimit;
    let filter = {};
    if (product) {
        filter.product = product;
    }
    if (minRating && maxRating) {
        filter.rating = {
            $lte: parseFloat(maxRating),
            $gte: parseFloat(minRating),
        };
    }
    const Review = yield review_model_1.review
        .find(filter)
        .limit(queryLimit)
        .skip(skip)
        .populate("user")
        .populate("product")
        .sort({ createdAt: -1 });
    const totalCount = yield review_model_1.review.countDocuments(filter);
    const pagination = (0, pagination_utils_1.getPagination)(currentPage, queryLimit, totalCount);
    res.status(200).json({
        status: "success",
        success: true,
        data: {
            data: Review,
            pagination,
        },
        message: "Reviews fetched successfully.",
    });
}));
//?Update review
exports.updateReview = (0, asyncHandler_utils_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { rating } = req.body;
    const id = req.params.id;
    // Find the existing review
    const existingReview = yield review_model_1.review.findById(id);
    if (!existingReview) {
        throw new errorhandler_middleware_1.CustomError("Review not found", 404);
    }
    // If rating is updated recalculate the average rating
    let oldRating = existingReview.rating;
    // Update the review
    const updatedReview = yield review_model_1.review.findByIdAndUpdate(id, req.body, {
        new: true,
    });
    if (!updatedReview) {
        throw new errorhandler_middleware_1.CustomError("Failed to update review", 500);
    }
    // Find the product associated with this review
    const Product = yield product_model_1.default.findById(updatedReview.product);
    if (!Product) {
        throw new errorhandler_middleware_1.CustomError("Associated product not found", 404);
    }
    // Recalculate the average rating
    if (rating !== undefined && rating !== oldRating) {
        let totalRating = Product.averageRating * Product.productReviews.length -
            oldRating +
            rating;
        Product.averageRating = totalRating / Product.productReviews.length;
        yield Product.save();
    }
    res.status(200).json({
        status: "success",
        success: true,
        data: updatedReview,
        message: "Review updated successfully",
    });
}));
//?Delete review
exports.deleteReview = (0, asyncHandler_utils_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    // Find and delete the review
    const Review = yield review_model_1.review.findByIdAndDelete(id);
    if (!Review) {
        throw new errorhandler_middleware_1.CustomError("Review not found", 404);
    }
    // Remove review from the  product's review list (only if Review exists)
    if (Review.product) {
        yield product_model_1.default.findByIdAndUpdate(Review.product, {
            $pull: { productReviews: Review._id },
        });
    }
    res.status(200).json({
        status: "success",
        success: true,
        data: Review,
        message: "Review deleted successfully",
    });
}));
//? Get review by productId
exports.getReviewByProductId = (0, asyncHandler_utils_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.id;
    const Reviews = yield review_model_1.review.find({ product: productId }).populate("user");
    res.status(200).json({
        success: true,
        status: "Success",
        data: Reviews,
    });
}));
