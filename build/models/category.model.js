"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const categorySchema = new mongoose_1.default.Schema({
    categoryName: {
        type: String,
        required: [true, "Category name is Required."],
        trim: true,
    },
    categoryDescription: {
        type: String,
        required: [true, "Category description is Required."],
        trim: true,
    },
}, { timestamps: true });
const category = mongoose_1.default.model("category", categorySchema);
exports.default = category;
