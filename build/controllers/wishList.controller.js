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
exports.clearWishList = exports.removeProductFromWishLIst = exports.getWishlistByUserId = exports.createWishList = void 0;
const asyncHandler_utils_1 = require("../utils/asyncHandler.utils");
const errorhandler_middleware_1 = require("../middleware/errorhandler.middleware");
const product_model_1 = __importDefault(require("../models/product.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
//?Add product to wishList
exports.createWishList = (0, asyncHandler_utils_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.body;
    const userId = req.User._id;
    if (!productId) {
        throw new errorhandler_middleware_1.CustomError("ProductId is required.", 404);
    }
    if (!userId) {
        throw new errorhandler_middleware_1.CustomError("UserId is required", 400);
    }
    //Find if the product exist
    const Product = yield product_model_1.default.findById(productId);
    if (!Product) {
        throw new errorhandler_middleware_1.CustomError("Product doesn't exist.", 404);
    }
    //Find if the user exist
    const User = yield user_model_1.default.findById(userId);
    if (!User) {
        throw new errorhandler_middleware_1.CustomError("User doesn't exist", 404);
    }
    //Check if the item already exist in wishlist
    const existingWishList = User.wishList.some((item) => {
        return item.toString() === productId;
    });
    if (!existingWishList) {
        User.wishList.push(productId);
        yield User.save();
    }
    res.status(201).json({
        status: "Success",
        success: true,
        data: User.wishList,
        message: "Product added to wishlist successfully!",
    });
}));
//?Get users wishlist using id
exports.getWishlistByUserId = (0, asyncHandler_utils_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.User._id;
    const User = yield user_model_1.default.findById(userId).populate("wishList");
    if (!User) {
        throw new errorhandler_middleware_1.CustomError("User not found", 404);
    }
    res.status(200).json({
        status: "Success",
        success: true,
        data: User.wishList,
        message: "WishList fetched successfully",
    });
}));
//?Remove product from wishList
exports.removeProductFromWishLIst = (0, asyncHandler_utils_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.productId;
    const userId = req.User._id;
    if (!productId) {
        throw new errorhandler_middleware_1.CustomError("ProductId is required.", 404);
    }
    if (!userId) {
        throw new errorhandler_middleware_1.CustomError("UserId is required", 400);
    }
    const User = yield user_model_1.default.findById(userId);
    if (!User) {
        throw new errorhandler_middleware_1.CustomError("User not found", 404);
    }
    //checking if the product is in wishList
    const productExist = User.wishList.some((item) => {
        item.toString() === productId;
    });
    if (!productExist) {
        throw new errorhandler_middleware_1.CustomError("Product doesn't exist", 404);
    }
    //removing the product
    User.wishList.filter((item) => {
        item.toString() !== productId;
    });
    yield User.save();
    res.status(200).json({
        status: "Success",
        success: true,
        data: User.wishList,
        message: "The product have been removed from the wishlist",
    });
}));
//? Clear wishList
exports.clearWishList = (0, asyncHandler_utils_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.User._id;
    const User = yield user_model_1.default.findById(userId).populate("wishList");
    if (!User) {
        throw new errorhandler_middleware_1.CustomError("User not found", 404);
    }
    User.wishList = [];
    yield User.save();
    res.status(200).json({
        status: "Success",
        success: true,
        data: User.wishList,
        message: "WishList cleared successfully",
    });
}));
