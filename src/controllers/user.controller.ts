import { comparePassword } from "./../utils/bcrypt.utils";
import { Request, Response } from "express";
import user from "../models/user.model";
import { hash } from "../utils/bcrypt.utils";
import { generateToken } from "../utils/jwt.utils";
import { IPayload } from "../@types/jwt.interface";
import { catchAsyncHandler } from "../utils/asyncHandler.utils";
import { CustomError } from "../middleware/errorhandler.middleware";
import { Role } from "../@types/global.types";
import { getPagination } from "../utils/pagination.utils";

//Sign-up User
export const registerUser = catchAsyncHandler(
  async (req: Request, res: Response) => {
    const body = req.body;
    if (!body.password) {
      throw new CustomError("Password is required.", 404);
    }
    const hashedPassword = await hash(body.password);
    console.log("🚀 ~ registerUser ~ hashedPassword:", hashedPassword);
    body.password = hashedPassword;
    const User = await user.create(body);

    res.status(201).json({
      status: "success",
      success: true,
      message: "User registered successfully",
      data: User,
    });
  }
);

//Updating the User

export const updateUser = catchAsyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const { firstName, lastName, gender, phoneNumber } = req.body;
    await user.findByIdAndUpdate(
      id,
      {
        firstName,
        lastName,
        gender,
        phoneNumber,
      },
      { new: true }
    );
    if (!user) {
      throw new CustomError("User not found", 404);
    }
    res.status(201).json({
      status: "success",
      success: true,
      message: "User registered successfully",
    });
  }
);

//?Updating user password
// export const updatePassword = async (req: Request, res: Response) => {
//   try {
//     const id = req.params.id;
//     const { currentPassword, newPassword } = req.body;

//     // Find the user
//     const existingUser = await user.findById(id);
//     if (!existingUser) {
//       res.status(404).json({
//         status: "fail",
//         success: false,
//         message: "User not found",
//       });
//     }

//     // Check if current password matches
//     if (existingUser?.password !== currentPassword) {
//       res.status(401).json({
//         status: "fail",
//         success: false,
//         message: "Current password is incorrect",
//       });
//     }

//     // Validate new password length
//     if (newPassword.length < 6) {
//       res.status(400).json({
//         status: "fail",
//         success: false,
//         message: "Password must be more than 6 characters",
//       });
//     }

//     // Update password
//     await user.findByIdAndUpdate(id, { password: newPassword }, { new: true });

//     res.status(200).json({
//       status: "success",
//       success: true,
//       message: "Password updated successfully",
//     });
//   } catch (error: any) {
//     res.status(500).json({
//       status: "fail",
//       success: false,
//       message: error.message,
//     });
//   }
// };

//?login
export const userLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email) {
    throw new CustomError("Email is required", 400);
  }
  if (!password) {
    throw new CustomError("Password is required.", 404);
  }

  const User = await user.findOne({ email });
  if (!User) {
    throw new CustomError("User not found", 404);
  }

  const isMatch = await comparePassword(password, User.password);
  if (!isMatch) {
    throw new CustomError("Password is required.", 404);
  }
  const payload: IPayload = {
    _id: User._id,
    email: User.email,
    firstName: User.firstName,
    lastName: User.lastName,
    role: User.role,
  };
  const token = generateToken(payload);

  res
    .status(200)
    .cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    })
    .json({
      status: "success",
      success: true,
      message: "Login successfully",
      token,
    });
};

//?Find all user
export const getAllUser = catchAsyncHandler(
  async (req: Request, res: Response) => {
    const { limit, page, query } = req.query;
    const queryLimit = parseInt(limit as string);
    const currentPage = parseInt(page as string);
    const skip = (currentPage - 1) * queryLimit;
    let filter: Record<string, any> = {};
    if (query) {
      filter.$or = [
        {
          firstName: { $regex: query, $options: "i" },
        },
        {
          lastName: { $regex: query, $options: "i" },
        },
        {
          email: { $regex: query, $options: "i" },
        },
        {
          phoneNumber: { $regex: query, $options: "i" },
        },
      ];
    }
    filter.role = Role.user;
    const totalCount = await user.countDocuments(filter);
    const pagination = getPagination(currentPage, queryLimit, totalCount);
    const User = await user
      .find(filter)
      .skip(skip)
      .limit(queryLimit)
      .sort({ createdAt: -1 })
      .select("-password");

    res.status(200).json({
      status: "Success",
      success: true,
      data: { data: User, pagination },
      message: "User fetched successfully.",
    });
  }
);
