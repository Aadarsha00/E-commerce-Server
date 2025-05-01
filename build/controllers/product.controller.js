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
exports.getProductById = exports.deleteProduct = exports.updateProduct = exports.getAllProducts = exports.createProduct = void 0;
const asyncHandler_utils_1 = require("../utils/asyncHandler.utils");
const errorhandler_middleware_1 = require("../middleware/errorhandler.middleware");
const product_model_1 = __importDefault(require("../models/product.model"));
const deleteFiles_utils_1 = require("../utils/deleteFiles.utils");
const category_model_1 = __importDefault(require("../models/category.model"));
const pagination_utils_1 = require("../utils/pagination.utils");
//?Create Product
exports.createProduct = (0, asyncHandler_utils_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { productName, productDescription, productPrice, category: categoryId, } = req.body;
    const admin = req.User;
    const files = req.files;
    if (!files || !files.coverImage) {
        throw new errorhandler_middleware_1.CustomError("Cover image is required", 400);
    }
    const coverImage = files.coverImage;
    const images = files.images;
    //get Category
    const Category = yield category_model_1.default.findById(categoryId);
    console.log(Category);
    if (!Category) {
        throw new errorhandler_middleware_1.CustomError("Category not found", 404);
    }
    const Product = new product_model_1.default({
        productName,
        productPrice,
        productDescription,
        createdBy: admin._id,
        productCategory: Category._id,
    });
    Product.coverImage = (_a = coverImage[0]) === null || _a === void 0 ? void 0 : _a.path;
    if (images && images.length > 0) {
        const imagePath = images.map((image, index) => image.path);
        Product.images = imagePath;
    }
    yield Product.save();
    res.status(200).json({
        status: "success",
        success: true,
        data: Product,
        message: "Product created successfully",
    });
}));
//?Get All Products
exports.getAllProducts = (0, asyncHandler_utils_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, query, category, minPrice, maxPrice } = req.query;
    const queryLimit = parseInt(limit) || 10;
    const currentPage = parseInt(page) || 1;
    const skip = (currentPage - 1) * queryLimit;
    let filter = {};
    if (category) {
        filter.category = category;
    }
    if (minPrice && maxPrice) {
        filter.productPrice = {
            $lte: parseFloat(maxPrice),
            $gte: parseFloat(minPrice),
        };
    }
    if (query) {
        filter.$or = [
            {
                productName: { $regex: query, $options: "i" },
            },
            {
                productDescription: {
                    $regex: query,
                    $options: "i",
                },
            },
        ];
    }
    const Product = yield product_model_1.default
        .find(filter)
        .limit(queryLimit)
        .skip(skip)
        .populate("createdBy", "-password")
        .sort({ createdAt: -1 });
    const totalCount = yield product_model_1.default.countDocuments(filter);
    const pagination = (0, pagination_utils_1.getPagination)(currentPage, queryLimit, totalCount);
    res.status(200).json({
        status: "success",
        success: true,
        data: {
            data: Product,
            pagination,
        },
        message: "Product fetched successfully.",
    });
}));
//?Update Product
exports.updateProduct = (0, asyncHandler_utils_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { deletedImages, productName, productPrice, productCategoryId, productDescription, } = req.body;
    const id = req.params.id;
    // Make files optional
    const files = req.files;
    const updatedProduct = yield product_model_1.default.findByIdAndUpdate(id, {
        productName,
        productPrice,
        productDescription,
    }, { new: true });
    if (!updatedProduct) {
        throw new errorhandler_middleware_1.CustomError("Product not found", 404);
    }
    if (productCategoryId) {
        const Category = yield category_model_1.default.findById(productCategoryId);
        if (!Category) {
            throw new errorhandler_middleware_1.CustomError("Category not found", 404);
        }
        updatedProduct.productCategory = productCategoryId;
    }
    // Only update cover image if new one was uploaded
    if (files === null || files === void 0 ? void 0 : files.coverImage) {
        yield (0, deleteFiles_utils_1.deleteFiles)([updatedProduct.coverImage]);
        updatedProduct.coverImage = files.coverImage[0].path;
    }
    if (deletedImages && deletedImages.length > 0) {
        yield (0, deleteFiles_utils_1.deleteFiles)(deletedImages);
        updatedProduct.images = updatedProduct.images.filter((image) => !deletedImages.includes(image));
    }
    // Only add new images if any were uploaded
    if ((files === null || files === void 0 ? void 0 : files.images) && files.images.length > 0) {
        const imagePath = files.images.map((image) => image.path);
        updatedProduct.images = [...updatedProduct.images, ...imagePath];
    }
    yield updatedProduct.save();
    res.status(200).json({
        status: "success",
        success: true,
        data: updatedProduct,
        message: "Product updated successfully",
    });
}));
//?Delete Product
exports.deleteProduct = (0, asyncHandler_utils_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const Product = yield product_model_1.default.findById(id);
    if (!Product) {
        throw new errorhandler_middleware_1.CustomError("Product not found", 404);
    }
    if (Product.images && Product.images.length > 0) {
        yield (0, deleteFiles_utils_1.deleteFiles)(Product.images);
    }
    yield product_model_1.default.findByIdAndDelete(Product._id);
    res.status(200).json({
        status: "Success",
        success: true,
        message: "The product have been deleted.",
    });
}));
//get product by id
exports.getProductById = (0, asyncHandler_utils_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const Product = yield product_model_1.default.findById(id).populate("createdBy");
    res.status(200).json({
        status: "Success",
        success: true,
        message: "Product fetched.",
        data: Product,
    });
}));
