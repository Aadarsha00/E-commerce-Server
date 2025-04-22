import { Request, Response } from "express";
import { catchAsyncHandler } from "../utils/asyncHandler.utils";
import { CustomError } from "../middleware/errorhandler.middleware";
import product from "../models/product.model";
import user from "../models/user.model";

//?Add product to wishList
export const createWishList = catchAsyncHandler(
  async (req: Request, res: Response) => {
    const { productId } = req.body;
    const userId = req.User._id;
    if (!productId) {
      throw new CustomError("ProductId is required.", 404);
    }
    if (!userId) {
      throw new CustomError("UserId is required", 400);
    }

    //Find if the product exist
    const Product = await product.findById(productId);
    if (!Product) {
      throw new CustomError("Product doesn't exist.", 404);
    }

    //Find if the user exist
    const User = await user.findById(userId);
    if (!User) {
      throw new CustomError("User doesn't exist", 404);
    }

    //Check if the item already exist in wishlist
    const existingWishList = User.wishList.some((item) => {
      return item.toString() === productId;
    });
    if (!existingWishList) {
      User.wishList.push(productId);
      await User.save();
    }
    res.status(201).json({
      status: "Success",
      success: true,
      data: User.wishList,
      message: "Product added to wishlist successfully!",
    });
  }
);

//?Get users wishlist using id
export const getWishlistByUserId = catchAsyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.User._id;
    const User = await user.findById(userId).populate("wishList");
    if (!User) {
      throw new CustomError("User not found", 404);
    }
    res.status(200).json({
      status: "Success",
      success: true,
      data: User.wishList,
      message: "WishList fetched successfully",
    });
  }
);

//?Remove product from wishList

export const removeProductFromWishLIst = catchAsyncHandler(
  async (req: Request, res: Response) => {
    const productId = req.params.productId;
    const userId = req.User._id;
    if (!productId) {
      throw new CustomError("ProductId is required.", 404);
    }
    if (!userId) {
      throw new CustomError("UserId is required", 400);
    }
    const User = await user.findById(userId);
    if (!User) {
      throw new CustomError("User not found", 404);
    }
    //checking if the product is in wishList
    const productExist = User.wishList.some((item) => {
      item.toString() === productId;
    });
    if (!productExist) {
      throw new CustomError("Product doesn't exist", 404);
    }
    //removing the product
    User.wishList.filter((item) => {
      item.toString() !== productId;
    });
    await User.save();
    res.status(200).json({
      status: "Success",
      success: true,
      data: User.wishList,
      message: "The product have been removed from the wishlist",
    });
  }
);

//? Clear wishList
export const clearWishList = catchAsyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.User._id;
    const User = await user.findById(userId).populate("wishList");
    if (!User) {
      throw new CustomError("User not found", 404);
    }
    User.wishList = [];
    await User.save();
    res.status(200).json({
      status: "Success",
      success: true,
      data: User.wishList,
      message: "WishList cleared successfully",
    });
  }
);
