import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: [true, "Product name is Required."],
      trim: true,
    },
    productPrice: {
      type: Number,
      required: true,
      min: [0, "Product price must be greater than 0."],
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
    productCategory: {
      type: mongoose.Types.ObjectId,
      ref: "category",
      required: [true, "Category is required!"],
    },
    productDescription: {
      type: String,
      required: false,
      min: [20, "Description must be at least 20 chars."],
      trim: true,
    },
    coverImage: {
      type: String,
      required: false,
    },
    images: [
      {
        type: String,
        required: false,
      },
    ],
    productReviews: [
      {
        type: mongoose.Types.ObjectId,
        ref: "review",
        required: false,
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const product = mongoose.model("product", productSchema);
export default product;
