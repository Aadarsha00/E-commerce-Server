import express from "express";
import {
  deleteOrder,
  getAllOrder,
  getOrderByUserId,
  placeOrder,
} from "../controllers/order.controller";
import { authenticate } from "../middleware/authentication.middleware";
import { onlyAdmin, onlyUser } from "../@types/global.types";
const router = express.Router();

//?Create Order
router.post("/", authenticate(onlyUser), placeOrder);

//?Get all order
router.get("/", authenticate(onlyAdmin), getAllOrder);

//?Get order by userId
router.get("/:userId", authenticate(onlyUser), getOrderByUserId);

//?Delete Order
router.delete("/:id", authenticate(onlyUser), deleteOrder);
export default router;
