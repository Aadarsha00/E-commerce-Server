import mongoose from "mongoose";
const categorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: [true, "Category name is Required."],
      trim: true,
    },
    categoryDescription: {
      type: String,
      required: [true, "Category description is Required."],
      trim: true,
    },
  },
  { timestamps: true }
);
const category = mongoose.model("category", categorySchema);
export default category;
