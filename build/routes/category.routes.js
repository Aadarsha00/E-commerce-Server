"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const category_controller_1 = require("../controllers/category.controller");
const authentication_middleware_1 = require("../middleware/authentication.middleware");
const global_types_1 = require("../@types/global.types");
const router = express_1.default.Router();
//Posting Category
router.post("/", (0, authentication_middleware_1.authenticate)(global_types_1.onlyAdmin), category_controller_1.createCategory);
//Get all category
router.get("/", (0, authentication_middleware_1.authenticate)(global_types_1.onlyAdmin), category_controller_1.getAllCategory);
//update category
router.patch("/:id", (0, authentication_middleware_1.authenticate)(global_types_1.onlyAdmin), category_controller_1.updateCategory);
//get category by id
router.get("/:id", category_controller_1.getCategoryById);
//delete category
router.delete("/:id", (0, authentication_middleware_1.authenticate)(global_types_1.onlyAdmin), category_controller_1.deleteCategory);
exports.default = router;
