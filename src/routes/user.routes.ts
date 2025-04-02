import express from "express";
import {
  getAllUser,
  registerUser,
  updateUser,
  userLogin,
} from "../controllers/user.controller";
import { authenticate } from "../middleware/authentication.middleware";
import { onlyAdmin } from "../@types/global.types";
const router = express.Router();

//Registering the User
router.post("/", registerUser);

//Update User Profile
router.patch("/:id", authenticate(), updateUser);

//Update and make password
// router.patch("/update-password/:id", updatePassword);

//Login
router.post("/login", userLogin);

//Get all Users
router.get("/", authenticate(onlyAdmin), getAllUser);

export default router;
