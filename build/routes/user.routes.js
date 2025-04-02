"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const authentication_middleware_1 = require("../middleware/authentication.middleware");
const global_types_1 = require("../@types/global.types");
const router = express_1.default.Router();
//Registering the User
router.post("/", user_controller_1.registerUser);
//Update User Profile
router.patch("/:id", (0, authentication_middleware_1.authenticate)(), user_controller_1.updateUser);
//Update and make password
// router.patch("/update-password/:id", updatePassword);
//Login
router.post("/login", user_controller_1.userLogin);
//Get all Users
router.get("/", (0, authentication_middleware_1.authenticate)(global_types_1.onlyAdmin), user_controller_1.getAllUser);
exports.default = router;
