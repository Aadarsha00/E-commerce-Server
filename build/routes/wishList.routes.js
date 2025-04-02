"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const wishList_controller_1 = require("../controllers/wishList.controller");
const global_types_1 = require("../@types/global.types");
const authentication_middleware_1 = require("../middleware/authentication.middleware");
const router = express_1.default.Router();
//?Create a wishLIst
router.post("/", (0, authentication_middleware_1.authenticate)(global_types_1.onlyUser), wishList_controller_1.createWishList);
//?Get wishList by userID
router.get("/", (0, authentication_middleware_1.authenticate)(global_types_1.onlyUser), wishList_controller_1.getWishlistByUserId);
//?clear wishlist
router.delete("/", (0, authentication_middleware_1.authenticate)(global_types_1.onlyUser), wishList_controller_1.clearWishList);
//?Remove product from wishList
router.delete("/remove/:id", (0, authentication_middleware_1.authenticate)(global_types_1.onlyUser), wishList_controller_1.removeProductFromWishLIst);
exports.default = router;
