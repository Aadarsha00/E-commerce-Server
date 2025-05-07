import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  getSummerSale,
  getTrendingProduct,
  updateProduct,
} from "../controllers/product.controller";
import { authenticate } from "../middleware/authentication.middleware";
const router = express.Router();

// multer configuration
import multer from "multer";
import { onlyAdmin } from "../@types/global.types";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.config";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // async code using `req` and `file`
    // ...
    return {
      folder: "e-com/products",
      allowed_format: ["jpeg", "png", "svg", "jpg", "webp"],
    };
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

//get trending
router.get("/trendingproducts", getTrendingProduct);

//get summersale
router.get("/summersale", getSummerSale);

export default router;
