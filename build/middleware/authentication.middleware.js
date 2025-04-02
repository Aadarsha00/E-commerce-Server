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
exports.authenticate = void 0;
const errorhandler_middleware_1 = require("./errorhandler.middleware");
const jwt_utils_1 = require("../utils/jwt.utils");
const user_model_1 = __importDefault(require("../models/user.model"));
const authenticate = (roles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const authHeader = req.headers["authorization"];
            console.log("👊 ~ authentication.middleware.ts:15 ~ return ~ token:", req.headers["authorization"]);
            if (!authHeader || !authHeader.startsWith("BEARER")) {
                throw new errorhandler_middleware_1.CustomError("Unauthorized, Authorization header is missing", 401);
            }
            const accessToken = authHeader.split(" ")[1];
            if (!accessToken) {
                throw new errorhandler_middleware_1.CustomError("Unauthorized, token is missing", 401);
            }
            const decoded = (0, jwt_utils_1.verifyToken)(accessToken);
            console.log("🚀 ~ return ~ decoded:", decoded);
            if (decoded.exp && decoded.exp * 1000 < Date.now()) {
                console.log(decoded.exp);
                console.log(decoded.exp * 1000, Date.now());
                throw new errorhandler_middleware_1.CustomError("Unauthorized, token expired", 401);
            }
            if (!decoded) {
                throw new errorhandler_middleware_1.CustomError("Unauthorized, Invalid token", 401);
            }
            const User = yield user_model_1.default.findById(decoded._id);
            if (!User) {
                throw new errorhandler_middleware_1.CustomError("User not found", 404);
            }
            if (roles && !roles.includes(User.role)) {
                throw new errorhandler_middleware_1.CustomError(`Forbidden, ${User.role} can not access this resource`, 401);
            }
            req.User = {
                _id: decoded._id,
                firstName: decoded.firstName,
                lastName: decoded.lastName,
                role: decoded.role,
                email: decoded.email,
            };
            next();
        }
        catch (err) {
            // throw new CustomError(err?.message ?? "Something wend wrong", 500);
            next(err);
        }
    });
};
exports.authenticate = authenticate;
