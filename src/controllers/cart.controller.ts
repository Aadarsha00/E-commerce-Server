import { Request, Response } from "express";
import { cart } from "../models/cart.model";
import { catchAsyncHandler } from "../utils/asyncHandler.utils";
import { CustomError } from "../middleware/errorhandler.middleware";
import product from "../models/product.model";

//? Create cart

export const createCart = catchAsyncHandler(
  async (req: Request, res: Response) => {
    const { productId, quantity } = req.body;

    const userId = req.User._id;
    let Cart;
    if (!userId) {
      throw new CustomError("UserId  required", 400);
    }
    if (!productId) {
      throw new CustomError("ProductId is required", 400);
    }
    Cart = await cart.findOne({ user: userId });
    console.log(Cart);
    if (!Cart) {
      Cart = new cart({ user: userId, items: [] });
    }
    const Product = await product.findById(productId);

    if (!Product) {
      throw new CustomError("Product not found", 404);
    }
    const existingProduct = Cart.items.filter(
      (item) => item.product.toString() === productId
    );
    console.log("🚀 ~ existingProduct:", existingProduct);
    if (existingProduct && existingProduct.length > 0) {
      existingProduct[0].quantity += parseInt(quantity);
      // Cart.items.push(existingProduct);
    } else {
      Cart.items.push({ product: productId, quantity: parseInt(quantity) });
    }
    await Cart.save();
    res.status(201).json({
      status: "Success",
      success: true,
      message: "Product added to cart successfully!",
      data: Cart,
    });
  }
);

//?Get cart by userID
export const getCartByUserId = catchAsyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.User._id;
    const Cart = await cart.findOne({ user: userId });
    res.status(200).json({
      status: "Success",
      success: true,
      data: Cart,
      message: "Cart fetched successfully",
    });
  }
);

//? Clear Cart
export const clearCart = catchAsyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const Cart = await cart.findOne({ user: userId });
    if (!Cart) {
      throw new CustomError("Cart doesn't exist", 404);
    }
    await cart.findOneAndDelete({ user: userId });

    res.status(200).json({
      status: "Success",
      success: true,
      message: "Cart cleared successfully",
      data: null,
    });
  }
);

//?DElete one product from cart
export const removeItemFromCart = catchAsyncHandler(
  async (req: Request, res: Response) => {
    const productId = req.params.productId;
    const userId = req.User._id;

    const updatedCart = await cart.findOneAndUpdate(
      { user: userId },
      { $pull: { items: { product: productId } } },
      { new: true }
    );

    if (!updatedCart) {
      throw new CustomError("Cart doesn't exist", 404);
    }

    res.status(200).json({
      status: "Success",
      success: true,
      message: "Removed selected Item from Cart successfully",
      data: updatedCart,
    });
  }
);
