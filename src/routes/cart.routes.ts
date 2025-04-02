import express from "express";
import {
  clearCart,
  createCart,
  getCartByUserId,
  removeItemFromCart,
} from "../controllers/cart.controller";
import { authenticate } from "../middleware/authentication.middleware";
import { onlyUser } from "../@types/global.types";
const router = express.Router();

//Creating Cart
router.post("/add", authenticate(onlyUser), createCart);

//Clear Cart
router.delete("/clear", authenticate(onlyUser), clearCart);

//Get Cart by user Id
router.get("/:userId", authenticate(onlyUser), getCartByUserId);

//Remove items from Cart
router.delete("/remove/:productId", authenticate(onlyUser), removeItemFromCart);
export default router;
