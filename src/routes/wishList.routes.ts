import express from "express";
import {
  clearWishList,
  createWishList,
  getWishlistByUserId,
  removeProductFromWishLIst,
} from "../controllers/wishList.controller";
import { onlyUser } from "../@types/global.types";
import { authenticate } from "../middleware/authentication.middleware";
const router = express.Router();

//?Create a wishLIst
router.post("/", authenticate(onlyUser), createWishList);

//?Get wishList by userID
router.get("/", authenticate(onlyUser), getWishlistByUserId);

//?clear wishlist
router.delete("/", authenticate(onlyUser), clearWishList);

//?Remove product from wishList
router.delete("/remove/:id", authenticate(onlyUser), removeProductFromWishLIst);
export default router;
