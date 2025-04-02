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
exports.deleteOrder = exports.updateOrderStatus = exports.getOrderByUserId = exports.getAllOrder = exports.placeOrder = void 0;
const asyncHandler_utils_1 = require("../utils/asyncHandler.utils");
const cart_model_1 = require("../models/cart.model");
const errorhandler_middleware_1 = require("../middleware/errorhandler.middleware");
const orderConformationEmail_utils_1 = require("../utils/orderConformationEmail.utils");
const product_model_1 = __importDefault(require("../models/product.model"));
const order_model_1 = __importDefault(require("../models/order.model"));
const pagination_utils_1 = require("../utils/pagination.utils");
exports.placeOrder = (0, asyncHandler_utils_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.User._id;
    const Cart = yield cart_model_1.cart.findOne({ user: userId });
    if (!Cart) {
        throw new errorhandler_middleware_1.CustomError("Cart not found", 404);
    }
    const products = yield Promise.all(Cart.items.map((item) => __awaiter(void 0, void 0, void 0, function* () {
        const Product = yield product_model_1.default.findById(item.product);
        if (!Product) {
            throw new errorhandler_middleware_1.CustomError("Product not found", 404);
        }
        return {
            product: Product._id,
            quantity: item.quantity,
            totalPrice: Number(Product.productPrice) * item.quantity,
        };
    })));
    const totalAmount = products.reduce((acc, item) => acc + item.totalPrice, 0);
    const Order = new order_model_1.default({
        user: userId,
        items: products,
        totalAmount,
    });
    const newOrder = yield Order.save();
    const populatedOrder = yield order_model_1.default
        .findById(newOrder._id)
        .populate("items.product");
    if (!populatedOrder) {
        throw new errorhandler_middleware_1.CustomError("Order not created", 404);
    }
    yield (0, orderConformationEmail_utils_1.sendOrderConfirmationEmail)({
        to: req.User.email,
        orderDetails: populatedOrder,
    });
    yield cart_model_1.cart.findByIdAndDelete(Cart._id);
    res.status(201).json({
        status: "Success",
        success: true,
        data: Order,
        message: "Order placed successfully!",
    });
}));
//?Get all order
exports.getAllOrder = (0, asyncHandler_utils_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, query, status, minTotal, maxTotal, toDate, fromDate } = req.query;
    const queryLimit = parseInt(limit) || 10;
    const currentPage = parseInt(page) || 1;
    const skip = (currentPage - 1) * queryLimit;
    let filter = {};
    if (status) {
        filter.status = status;
    }
    if (minTotal || maxTotal) {
        if (minTotal && maxTotal) {
            filter.totalAmount = {
                $lte: parseFloat(maxTotal),
                $gte: parseFloat(minTotal),
            };
        }
        if (minTotal) {
            filter.totalAmount = { $gte: parseFloat(minTotal) };
        }
        if (maxTotal) {
            filter.totalAmount = { $lte: parseFloat(maxTotal) };
        }
    }
    if (query) {
        filter.$or = [
            {
                orderId: { $regex: query, $options: "i" },
            },
        ];
    }
    //Date Filter
    if (toDate || fromDate) {
        if (toDate && fromDate) {
            filter.totalAmount = {
                $lte: new Date(toDate),
                $gte: new Date(fromDate),
            };
        }
        if (fromDate) {
            filter.totalAmount = { $gte: new Date(fromDate) };
        }
        if (toDate) {
            filter.totalAmount = { $lte: new Date(toDate) };
        }
    }
    const allOrder = yield order_model_1.default
        .find(filter)
        .limit(queryLimit)
        .skip(skip)
        .populate("items.product")
        .populate("user")
        .sort({ createdAt: -1 });
    const totalCount = yield order_model_1.default.countDocuments(filter);
    const pagination = (0, pagination_utils_1.getPagination)(currentPage, queryLimit, totalCount);
    res.status(200).json({
        status: "success",
        success: true,
        data: {
            data: allOrder,
            pagination,
        },
        message: "Orders fetched successfully!",
    });
}));
//?Get by userID
exports.getOrderByUserId = (0, asyncHandler_utils_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.User._id;
    const Order = yield order_model_1.default
        .findOne({ user: userId })
        .populate("items.product")
        .populate("user", "-password");
    res.status(201).json({
        success: true,
        status: "Success",
        data: Order,
        message: "Order fetched successfully!",
    });
}));
//? Update Order  status
exports.updateOrderStatus = (0, asyncHandler_utils_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    const { status } = req.body;
    if (!status) {
        throw new errorhandler_middleware_1.CustomError("status is required", 404);
    }
    if (!orderId) {
        throw new errorhandler_middleware_1.CustomError("orderId is required", 404);
    }
    const updateOrder = yield order_model_1.default.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!updateOrder) {
        throw new errorhandler_middleware_1.CustomError("updateOrder is required", 404);
    }
    res.status(200).json({
        success: true,
        status: "Success",
        data: updateOrder,
        message: "Order status updated successfully!",
    });
}));
//?Delete Order
exports.deleteOrder = (0, asyncHandler_utils_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    if (!orderId) {
        throw new errorhandler_middleware_1.CustomError("orderId is required", 404);
    }
    const deleteOrder = yield order_model_1.default.findByIdAndDelete(orderId);
    if (!deleteOrder) {
        throw new errorhandler_middleware_1.CustomError("updateOrder is required", 404);
    }
    res.status(200).json({
        success: true,
        status: "Success",
        data: deleteOrder,
        message: "Order deleted successfully!",
    });
}));
//?Cancel order status
