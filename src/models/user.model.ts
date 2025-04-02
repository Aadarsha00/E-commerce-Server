import mongoose from "mongoose";
import { Role } from "../@types/global.types";
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      max: [50, "First name cannot exceed 50 chars."],
      min: [2, "First name must be more than 2 chars"],
    },
    lastName: {
      type: String,
      required: [true, "Last Name is required"],
      max: [50, "Last name cannot exceed 50 chars."],
      min: [2, "Last name must be more than 2 chars"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "User with the provided email already exist"],
      match: [emailRegex, "Please enter a valid email"],
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.user,
    },
    phoneNumber: {
      type: String,
      min: [10, "Phone number must be at least 10 digits."],
    },
    password: {
      type: String,
      required: true,
      min: [6, "Password must be more than 6 chars."],
    },
    gender: {
      type: String,
    },
    wishList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "product",
      },
    ],
  },
  { timestamps: true }
);

const user = mongoose.model("user", userSchema);
export default user;
