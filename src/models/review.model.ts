import mongoose from "mongoose";
const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: [true, "Rating is required!"],
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      required: [true, "Review is required!"],
      trim: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      required: [true, "User is required!"],
      ref: "user",
    },
    product: {
      type: mongoose.Types.ObjectId,
      required: [true, "Product is required!"],
      ref: "product",
    },
  },
  { timestamps: true }
);
export const review = mongoose.model("review", reviewSchema);
