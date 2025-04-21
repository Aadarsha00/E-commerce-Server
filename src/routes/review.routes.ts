import { authenticate } from "./../middleware/authentication.middleware";
import express from "express";
import {
  createReview,
  deleteReview,
  getAllReview,
  getReviewByProductId,
  updateReview,
} from "../controllers/review.controller";
import { onlyAdmin, onlyUser } from "../@types/global.types";
const router = express.Router();

//Posting review
router.post("/", authenticate(onlyUser), createReview);

//Get all review
router.get("/", authenticate(onlyAdmin), getAllReview);

//Update review
router.patch("/:id", authenticate(onlyUser), updateReview);

//delete review
router.delete("/:id", authenticate(onlyUser), deleteReview);

//get review by productId
router.get("/:id", getReviewByProductId);

export default router;
