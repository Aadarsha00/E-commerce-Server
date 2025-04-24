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
exports.getAllUser = exports.userLogin = exports.updateUser = exports.registerUser = void 0;
const bcrypt_utils_1 = require("./../utils/bcrypt.utils");
const user_model_1 = __importDefault(require("../models/user.model"));
const bcrypt_utils_2 = require("../utils/bcrypt.utils");
const jwt_utils_1 = require("../utils/jwt.utils");
const asyncHandler_utils_1 = require("../utils/asyncHandler.utils");
const errorhandler_middleware_1 = require("../middleware/errorhandler.middleware");
const global_types_1 = require("../@types/global.types");
const pagination_utils_1 = require("../utils/pagination.utils");
//Sign-up User
exports.registerUser = (0, asyncHandler_utils_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    if (!body.password) {
        throw new errorhandler_middleware_1.CustomError("Password is required.", 404);
    }
    const hashedPassword = yield (0, bcrypt_utils_2.hash)(body.password);
    console.log("🚀 ~ registerUser ~ hashedPassword:", hashedPassword);
    body.password = hashedPassword;
    const User = yield user_model_1.default.create(body);
    res.status(201).json({
        status: "success",
        success: true,
        message: "User registered successfully",
        data: User,
    });
}));
//Updating the User
exports.updateUser = (0, asyncHandler_utils_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { firstName, lastName, gender, phoneNumber } = req.body;
    yield user_model_1.default.findByIdAndUpdate(id, {
        firstName,
        lastName,
        gender,
        phoneNumber,
    }, { new: true });
    if (!user_model_1.default) {
        throw new errorhandler_middleware_1.CustomError("User not found", 404);
    }
    res.status(201).json({
        status: "success",
        success: true,
        message: "User registered successfully",
    });
}));
//?Updating user password
// export const updatePassword = async (req: Request, res: Response) => {
//   try {
//     const id = req.params.id;
//     const { currentPassword, newPassword } = req.body;
//     // Find the user
//     const existingUser = await user.findById(id);
//     if (!existingUser) {
//       res.status(404).json({
//         status: "fail",
//         success: false,
//         message: "User not found",
//       });
//     }
//     // Check if current password matches
//     if (existingUser?.password !== currentPassword) {
//       res.status(401).json({
//         status: "fail",
//         success: false,
//         message: "Current password is incorrect",
//       });
//     }
//     // Validate new password length
//     if (newPassword.length < 6) {
//       res.status(400).json({
//         status: "fail",
//         success: false,
//         message: "Password must be more than 6 characters",
//       });
//     }
//     // Update password
//     await user.findByIdAndUpdate(id, { password: newPassword }, { new: true });
//     res.status(200).json({
//       status: "success",
//       success: true,
//       message: "Password updated successfully",
//     });
//   } catch (error: any) {
//     res.status(500).json({
//       status: "fail",
//       success: false,
//       message: error.message,
//     });
//   }
// };
//?login
const userLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email) {
        throw new errorhandler_middleware_1.CustomError("Email is required", 400);
    }
    if (!password) {
        throw new errorhandler_middleware_1.CustomError("Password is required.", 404);
    }
    const User = yield user_model_1.default.findOne({ email });
    if (!User) {
        throw new errorhandler_middleware_1.CustomError("User not found", 404);
    }
    const isMatch = yield (0, bcrypt_utils_1.comparePassword)(password, User.password);
    if (!isMatch) {
        throw new errorhandler_middleware_1.CustomError("Incorrect Password.", 404);
    }
    const payload = {
        _id: User._id,
        email: User.email,
        firstName: User.firstName,
        lastName: User.lastName,
        role: User.role,
    };
    const token = (0, jwt_utils_1.generateToken)(payload);
    res
        .status(200)
        .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    })
        .json({
        status: "success",
        user: User,
        success: true,
        message: "Login successfully",
        token,
    });
});
exports.userLogin = userLogin;
//?Find all user
exports.getAllUser = (0, asyncHandler_utils_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, query } = req.query;
    const queryLimit = parseInt(limit);
    const currentPage = parseInt(page);
    const skip = (currentPage - 1) * queryLimit;
    let filter = {};
    if (query) {
        filter.$or = [
            {
                firstName: { $regex: query, $options: "i" },
            },
            {
                lastName: { $regex: query, $options: "i" },
            },
            {
                email: { $regex: query, $options: "i" },
            },
            {
                phoneNumber: { $regex: query, $options: "i" },
            },
        ];
    }
    filter.role = global_types_1.Role.user;
    const totalCount = yield user_model_1.default.countDocuments(filter);
    const pagination = (0, pagination_utils_1.getPagination)(currentPage, queryLimit, totalCount);
    const User = yield user_model_1.default
        .find(filter)
        .skip(skip)
        .limit(queryLimit)
        .sort({ createdAt: -1 })
        .select("-password");
    res.status(200).json({
        status: "Success",
        success: true,
        data: { data: User, pagination },
        message: "User fetched successfully.",
    });
}));
