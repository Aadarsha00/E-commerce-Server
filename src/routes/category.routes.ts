import express from "express";
import {
  getCategoryById,
  createCategory,
  deleteCategory,
  getAllCategory,
  updateCategory,
} from "../controllers/category.controller";
import { authenticate } from "../middleware/authentication.middleware";
import { onlyAdmin } from "../@types/global.types";
const router = express.Router();

//Posting Category
router.post("/", authenticate(onlyAdmin), createCategory);

//Get all category
router.get("/", authenticate(onlyAdmin), getAllCategory);

//update category
router.patch("/:id", authenticate(onlyAdmin), updateCategory);

//get category by id
router.get("/:id", getCategoryById);

//delete category
router.delete("/:id", authenticate(onlyAdmin), deleteCategory);

export default router;
