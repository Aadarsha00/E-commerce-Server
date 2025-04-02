"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cart_controller_1 = require("../controllers/cart.controller");
const authentication_middleware_1 = require("../middleware/authentication.middleware");
const global_types_1 = require("../@types/global.types");
const router = express_1.default.Router();
//Creating Cart
router.post("/add", (0, authentication_middleware_1.authenticate)(global_types_1.onlyUser), cart_controller_1.createCart);
//Clear Cart
router.delete("/clear", (0, authentication_middleware_1.authenticate)(global_types_1.onlyUser), cart_controller_1.clearCart);
//Get Cart by user Id
router.get("/:userId", (0, authentication_middleware_1.authenticate)(global_types_1.onlyUser), cart_controller_1.getCartByUserId);
//Remove items from Cart
router.delete("/remove/:productId", (0, authentication_middleware_1.authenticate)(global_types_1.onlyUser), cart_controller_1.removeItemFromCart);
exports.default = router;
