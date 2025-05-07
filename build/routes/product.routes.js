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
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("../controllers/product.controller");
const authentication_middleware_1 = require("../middleware/authentication.middleware");
const router = express_1.default.Router();
// multer configuration
const multer_1 = __importDefault(require("multer"));
const global_types_1 = require("../@types/global.types");
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_config_1 = __importDefault(require("../config/cloudinary.config"));
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_config_1.default,
    params: (req, file) => __awaiter(void 0, void 0, void 0, function* () {
        // async code using `req` and `file`
        // ...
        return {
            folder: "e-com/products",
            allowed_format: ["jpeg", "png", "svg", "jpg", "webp"],
        };
    }),
});
const upload = (0, multer_1.default)({ storage: storage });
// Posting the Product
router.post("/", (0, authentication_middleware_1.authenticate)(global_types_1.onlyAdmin), upload.fields([
    {
        name: "coverImage",
        maxCount: 1,
    },
    {
        name: "images",
        maxCount: 6,
    },
]), product_controller_1.createProduct);
// Get all Products
router.get("/", product_controller_1.getAllProducts);
//get trending
router.get("/trending", product_controller_1.getTrendingProduct);
//get summersale
router.get("/summersale", product_controller_1.getSummerSale);
// Update products - ADDED MULTER MIDDLEWARE
router.patch("/:id", (0, authentication_middleware_1.authenticate)(global_types_1.onlyAdmin), upload.fields([
    {
        name: "coverImage",
        maxCount: 1,
    },
    {
        name: "images",
        maxCount: 6,
    },
]), product_controller_1.updateProduct);
// Delete products
router.delete("/:id", (0, authentication_middleware_1.authenticate)(global_types_1.onlyAdmin), product_controller_1.deleteProduct);
// Get by id
router.get("/:id", product_controller_1.getProductById);
exports.default = router;
