"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const uuid_1 = require("uuid");
const orderSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "user",
        required: true,
    },
    orderId: {
        type: String,
        required: true,
        default: () => `ORD-${(0, uuid_1.v4)().split("-")[0]}`,
    },
    status: {
        type: String,
        enum: ["pending", "shipped", " cancelled", "delivered", "processing"],
        default: "pending",
    },
    items: [
        {
            product: {
                type: mongoose_1.default.Types.ObjectId,
                ref: "product",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            totalPrice: {
                type: Number,
                required: true,
            },
        },
    ],
    totalAmount: {
        type: Number,
        required: true,
    },
}, { timestamps: true });
const order = mongoose_1.default.model("order", orderSchema);
exports.default = order;
