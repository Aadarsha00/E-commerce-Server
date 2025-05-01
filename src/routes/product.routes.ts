import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../controllers/product.controller";
import { authenticate } from "../middleware/authentication.middleware";
const router = express.Router();

// multer configuration
import multer from "multer";
import { onlyAdmin } from "../@types/global.types";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Posting the Product
router.post(
  "/",
  authenticate(onlyAdmin),
  upload.fields([
    {
      name: "coverImage",
      maxCount: 1,
    },
    {
      name: "images",
      maxCount: 6,
    },
  ]),
  createProduct
);

// Get all Products
router.get("/", getAllProducts);

// Update products - ADDED MULTER MIDDLEWARE
router.patch(
  "/:id",
  authenticate(onlyAdmin),
  upload.fields([
    {
      name: "coverImage",
      maxCount: 1,
    },
    {
      name: "images",
      maxCount: 6,
    },
  ]),
  updateProduct
);

// Delete products
router.delete("/:id", authenticate(onlyAdmin), deleteProduct);

// Get by id
router.get("/:id", getProductById);

export default router;
