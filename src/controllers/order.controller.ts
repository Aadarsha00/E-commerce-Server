import { Request, Response } from "express";
import { catchAsyncHandler } from "../utils/asyncHandler.utils";
import { cart } from "../models/cart.model";
import { CustomError } from "../middleware/errorhandler.middleware";
import { sendOrderConfirmationEmail } from "../utils/orderConformationEmail.utils";
import product from "../models/product.model";
import order from "../models/order.model";
import { getPagination } from "../utils/pagination.utils";

export const placeOrder = catchAsyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.User._id;

    const Cart = await cart.findOne({ user: userId });
    if (!Cart) {
      throw new CustomError("Cart not found", 404);
    }
    const products = await Promise.all(
      Cart.items.map(async (item) => {
        const Product = await product.findById(item.product);
        if (!Product) {
          throw new CustomError("Product not found", 404);
        }
        return {
          product: Product._id,
          quantity: item.quantity,
          totalPrice: Number(Product.productPrice) * item.quantity,
        };
      })
    );
    const totalAmount = products.reduce(
      (acc, item) => acc + item.totalPrice,
      0
    );

    const Order = new order({
      user: userId,
      items: products,
      totalAmount,
    });
    const newOrder = await Order.save();
    const populatedOrder = await order
      .findById(newOrder._id)
      .populate("items.product");
    if (!populatedOrder) {
      throw new CustomError("Order not created", 404);
    }
    await sendOrderConfirmationEmail({
      to: req.User.email,
      orderDetails: populatedOrder,
    });
    await cart.findByIdAndDelete(Cart._id);

    res.status(201).json({
      status: "Success",
      success: true,
      data: Order,
      message: "Order placed successfully!",
    });
  }
);

//?Get all order
export const getAllOrder = catchAsyncHandler(
  async (req: Request, res: Response) => {
    const { limit, page, query, status, minTotal, maxTotal, toDate, fromDate } =
      req.query;
    const queryLimit = parseInt(limit as string) || 10;
    const currentPage = parseInt(page as string) || 1;
    const skip = (currentPage - 1) * queryLimit;

    let filter: Record<string, any> = {};
    if (status) {
      filter.status = status;
    }
    if (minTotal || maxTotal) {
      if (minTotal && maxTotal) {
        filter.totalAmount = {
          $lte: parseFloat(maxTotal as string),
          $gte: parseFloat(minTotal as string),
        };
      }
      if (minTotal) {
        filter.totalAmount = { $gte: parseFloat(minTotal as string) };
      }
      if (maxTotal) {
        filter.totalAmount = { $lte: parseFloat(maxTotal as string) };
      }
    }
    if (query) {
      filter.$or = [
        {
          orderId: { $regex: query, $options: "i" },
        },
      ];
    }

    //Date Filter
    if (toDate || fromDate) {
      if (toDate && fromDate) {
        filter.totalAmount = {
          $lte: new Date(toDate as string),
          $gte: new Date(fromDate as string),
        };
      }
      if (fromDate) {
        filter.totalAmount = { $gte: new Date(fromDate as string) };
      }
      if (toDate) {
        filter.totalAmount = { $lte: new Date(toDate as string) };
      }
    }

    const allOrder = await order
      .find(filter)
      .limit(queryLimit)
      .skip(skip)
      .populate("items.product")
      .populate("user")
      .sort({ createdAt: -1 });

    const totalCount = await order.countDocuments(filter);
    const pagination = getPagination(currentPage, queryLimit, totalCount);

    res.status(200).json({
      status: "success",
      success: true,
      data: {
        data: allOrder,
        pagination,
      },
      message: "Orders fetched successfully!",
    });
  }
);

//?Get by userID
export const getOrderByUserId = catchAsyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.User._id;
    const Order = await order
      .findOne({ user: userId })
      .populate("items.product")
      .populate("user", "-password");

    res.status(201).json({
      success: true,
      status: "Success",
      data: Order,
      message: "Order fetched successfully!",
    });
  }
);

//? Update Order  status
export const updateOrderStatus = catchAsyncHandler(
  async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const { status } = req.body;
    if (!status) {
      throw new CustomError("status is required", 404);
    }
    if (!orderId) {
      throw new CustomError("orderId is required", 404);
    }
    const updateOrder = await order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    if (!updateOrder) {
      throw new CustomError("updateOrder is required", 404);
    }
    res.status(200).json({
      success: true,
      status: "Success",
      data: updateOrder,
      message: "Order status updated successfully!",
    });
  }
);

//?Delete Order
export const deleteOrder = catchAsyncHandler(
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    if (!orderId) {
      throw new CustomError("orderId is required", 404);
    }
    const deleteOrder = await order.findByIdAndDelete(orderId);
    if (!deleteOrder) {
      throw new CustomError("updateOrder is required", 404);
    }
    res.status(200).json({
      success: true,
      status: "Success",
      data: deleteOrder,
      message: "Order deleted successfully!",
    });
  }
);

//?Cancel order status
