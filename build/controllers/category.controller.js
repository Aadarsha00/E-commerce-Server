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
exports.getCategoryById = exports.deleteCategory = exports.updateCategory = exports.getAllCategory = exports.createCategory = void 0;
const asyncHandler_utils_1 = require("../utils/asyncHandler.utils");
const errorhandler_middleware_1 = require("../middleware/errorhandler.middleware");
const category_model_1 = __importDefault(require("../models/category.model"));
const pagination_utils_1 = require("../utils/pagination.utils");
//Create category
exports.createCategory = (0, asyncHandler_utils_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const created = yield category_model_1.default.create(body);
    res.status(200).json({
        status: "success",
        success: true,
        data: created,
        message: "Category created successfully",
    });
}));
// get all category
exports.getAllCategory = (0, asyncHandler_utils_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, query } = req.query;
    const queryLimit = parseInt(limit) || 10;
    const currentPage = parseInt(page) || 1;
    const skip = (currentPage - 1) * queryLimit;
    let filter = {};
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
    const Category = yield category_model_1.default
        .find(filter)
        .sort({ createdAt: -1 })
        .limit(queryLimit)
        .skip(skip);
    const totalCount = yield category_model_1.default.countDocuments(filter);
    const pagination = (0, pagination_utils_1.getPagination)(currentPage, queryLimit, totalCount);
    res.status(200).json({
        status: "success",
        success: true,
        data: {
            data: Category,
            pagination,
        },
        message: "Category fetched successfully.",
    });
}));
//Update category
exports.updateCategory = (0, asyncHandler_utils_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const id = req.params.id;
    if (!id) {
        throw new errorhandler_middleware_1.CustomError("id is required", 404);
    }
    const Category = yield category_model_1.default.findByIdAndUpdate(id, body, { new: true });
    if (!Category) {
        throw new errorhandler_middleware_1.CustomError("Category not found", 404);
    }
    res.status(200).json({
        status: "success",
        success: true,
        data: Category,
        message: "Category updated successfully",
    });
}));
//Delete Category
exports.deleteCategory = (0, asyncHandler_utils_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!id) {
        throw new errorhandler_middleware_1.CustomError("id is required", 404);
    }
    const Category = yield category_model_1.default.findById(id);
    if (!Category) {
        throw new errorhandler_middleware_1.CustomError("Category not found", 404);
    }
    yield category_model_1.default.findByIdAndDelete(Category._id);
    res.status(200).json({
        status: "success",
        success: true,
        data: Category,
        message: "Category deleted successfully",
    });
}));
//Find by id
exports.getCategoryById = (0, asyncHandler_utils_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!id) {
        throw new errorhandler_middleware_1.CustomError("id is required", 404);
    }
    const Category = yield category_model_1.default.findById(id);
    if (!Category) {
        throw new errorhandler_middleware_1.CustomError("Category not found", 404);
    }
    res.status(200).json({
        status: "success",
        success: true,
        data: Category,
        message: "Category deleted successfully",
    });
}));
