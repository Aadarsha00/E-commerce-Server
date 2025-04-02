import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
    orderId: {
      type: String,
      required: true,
      default: () => `ORD-${uuidv4().split("-")[0]}`,
    },
    status: {
      type: String,
      enum: ["pending", "shipped", " cancelled", "delivered", "processing"],
      default: "pending",
    },
    items: [
      {
        product: {
          type: mongoose.Types.ObjectId,
          ref: "product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        totalPrice: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const order = mongoose.model("order", orderSchema);
export default order;
