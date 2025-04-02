"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const productSchema = new mongoose_1.default.Schema({
    productName: {
        type: String,
        required: [true, "Product name is Required."],
        trim: true,
    },
    productPrice: {
        type: Number,
        required: true,
        min: [0, "Product price must be greater than 0."],
    },
    createdBy: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "user",
        required: true,
    },
    productCategory: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "category",
        required: [true, "Category is required!"],
    },
    productDescription: {
        type: String,
        required: false,
        min: [20, "Description must be at least 20 chars."],
        trim: true,
    },
    coverImage: {
        type: String,
        required: false,
    },
    images: [
        {
            type: String,
            required: false,
        },
    ],
    productReviews: [
        {
            type: mongoose_1.default.Types.ObjectId,
            ref: "review",
            required: false,
        },
    ],
    averageRating: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });
const product = mongoose_1.default.model("product", productSchema);
exports.default = product;
