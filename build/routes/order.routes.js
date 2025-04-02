"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("../controllers/order.controller");
const authentication_middleware_1 = require("../middleware/authentication.middleware");
const global_types_1 = require("../@types/global.types");
const router = express_1.default.Router();
//?Create Order
router.post("/", (0, authentication_middleware_1.authenticate)(global_types_1.onlyUser), order_controller_1.placeOrder);
//?Get all order
router.get("/", (0, authentication_middleware_1.authenticate)(global_types_1.onlyAdmin), order_controller_1.getAllOrder);
//?Get order by userId
router.get("/:userId", (0, authentication_middleware_1.authenticate)(global_types_1.onlyUser), order_controller_1.getOrderByUserId);
//?Delete Order
router.delete("/:id", (0, authentication_middleware_1.authenticate)(global_types_1.onlyUser), order_controller_1.deleteOrder);
exports.default = router;
