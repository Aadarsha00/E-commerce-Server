"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const global_types_1 = require("../@types/global.types");
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const userSchema = new mongoose_1.default.Schema({
    firstName: {
        type: String,
        required: [true, "First name is required"],
        max: [50, "First name cannot exceed 50 chars."],
        min: [2, "First name must be more than 2 chars"],
    },
    lastName: {
        type: String,
        required: [true, "Last Name is required"],
        max: [50, "Last name cannot exceed 50 chars."],
        min: [2, "Last name must be more than 2 chars"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "User with the provided email already exist"],
        match: [emailRegex, "Please enter a valid email"],
    },
    role: {
        type: String,
        enum: Object.values(global_types_1.Role),
        default: global_types_1.Role.user,
    },
    phoneNumber: {
        type: String,
        min: [10, "Phone number must be at least 10 digits."],
    },
    password: {
        type: String,
        required: true,
        min: [6, "Password must be more than 6 chars."],
    },
    gender: {
        type: String,
    },
    wishList: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            required: true,
            ref: "product",
        },
    ],
}, { timestamps: true });
const user = mongoose_1.default.model("user", userSchema);
exports.default = user;
