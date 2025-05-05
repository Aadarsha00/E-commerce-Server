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
      minLength: [20, "Description must be at least 20 chars."],
      trim: true,
    },
    coverImage: {
      public_id: {
        type: String,
        required: true,
      },
      path: {
        type: String,
        required: true,
      },
    },
    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        path: {
          type: String,
          required: true,
        },
      },
    ],
    productReviews: [
      {
        type: mongoose.Types.ObjectId,
        ref: "review",
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const product = mongoose.model("Product", productSchema);
export default Product;
