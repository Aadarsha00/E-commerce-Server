"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authentication_middleware_1 = require("./../middleware/authentication.middleware");
const express_1 = __importDefault(require("express"));
const review_controller_1 = require("../controllers/review.controller");
const global_types_1 = require("../@types/global.types");
const router = express_1.default.Router();
//Posting review
router.post("/", (0, authentication_middleware_1.authenticate)(global_types_1.onlyUser), review_controller_1.createReview);
//Get all review
router.get("/", (0, authentication_middleware_1.authenticate)(global_types_1.onlyAdmin), review_controller_1.getAllReview);
//Update review
router.patch("/:id", (0, authentication_middleware_1.authenticate)(global_types_1.onlyUser), review_controller_1.updateReview);
//delete review
router.delete("/:id", (0, authentication_middleware_1.authenticate)(global_types_1.onlyUser), review_controller_1.deleteReview);
//get review by productId
router.get("/:id", review_controller_1.getReviewByProductId);
exports.default = router;
