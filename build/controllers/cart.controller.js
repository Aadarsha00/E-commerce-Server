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
exports.removeItemFromCart = exports.clearCart = exports.getCartByUserId = exports.createCart = void 0;
const cart_model_1 = require("../models/cart.model");
const asyncHandler_utils_1 = require("../utils/asyncHandler.utils");
const errorhandler_middleware_1 = require("../middleware/errorhandler.middleware");
const product_model_1 = __importDefault(require("../models/product.model"));
//? Create cart
exports.createCart = (0, asyncHandler_utils_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId, quantity } = req.body;
    const userId = req.User._id;
    let Cart;
    if (!userId) {
        throw new errorhandler_middleware_1.CustomError("UserId  required", 400);
    }
    if (!productId) {
        throw new errorhandler_middleware_1.CustomError("ProductId is required", 400);
    }
    Cart = yield cart_model_1.cart.findOne({ user: userId });
    if (!Cart) {
        Cart = new cart_model_1.cart({ user: userId, items: [] });
    }
    const Product = yield product_model_1.default.findById(productId);
    if (!Product) {
        throw new errorhandler_middleware_1.CustomError("Product not found", 404);
    }
    const existingProduct = Cart.items.filter((item) => item.product.toString() === productId);
    if (existingProduct && existingProduct.length > 0) {
        existingProduct[0].quantity += quantity;
        Cart.items.push(existingProduct);
    }
    else {
        Cart.items.push({ product: productId, quantity });
    }
    yield Cart.save();
    res.status(201).json({
        status: "Success",
        success: true,
        message: "Product added to cart successfully!",
        data: Cart,
    });
}));
//?Get cart by userID
exports.getCartByUserId = (0, asyncHandler_utils_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const Cart = yield cart_model_1.cart.findOne({ user: userId });
    res.status(200).json({
        status: "Success",
        success: true,
        data: Cart,
        message: "Cart fetched successfully",
    });
}));
//? Clear Cart
exports.clearCart = (0, asyncHandler_utils_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const Cart = yield cart_model_1.cart.findOne({ user: userId });
    if (!Cart) {
        throw new errorhandler_middleware_1.CustomError("Cart doesn't exist", 404);
    }
    yield cart_model_1.cart.findOneAndDelete({ user: userId });
    res.status(200).json({
        status: "Success",
        success: true,
        message: "Cart cleared successfully",
        data: null,
    });
}));
//?DElete one product from cart
exports.removeItemFromCart = (0, asyncHandler_utils_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.productId;
    const userId = req.User._id;
    if (!productId) {
        throw new errorhandler_middleware_1.CustomError("ProductId is required", 400);
    }
    const Cart = yield cart_model_1.cart.findOne({ user: userId });
    if (!Cart) {
        throw new errorhandler_middleware_1.CustomError("Cart doesn't exist", 404);
    }
    // const newCart = Cart.items.filter((item) => {
    //    item.product.toString() !== productId;
    // });
    Cart.items.pull({ product: productId });
    const updatedCart = yield Cart.save();
    res.status(200).json({
        status: "Success",
        success: true,
        message: "Removed selected Item from Cart successfully",
        data: updatedCart,
    });
}));
