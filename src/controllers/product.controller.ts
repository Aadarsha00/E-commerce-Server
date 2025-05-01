import { Request, Response } from "express";
import { catchAsyncHandler } from "../utils/asyncHandler.utils";
import { CustomError } from "../middleware/errorhandler.middleware";
import product from "../models/product.model";
import { deleteFiles } from "../utils/deleteFiles.utils";
import category from "../models/category.model";
import { getPagination } from "../utils/pagination.utils";

//?Create Product
export const createProduct = catchAsyncHandler(
  async (req: Request, res: Response) => {
    const {
      productName,
      productDescription,
      productPrice,
      category: categoryId,
    } = req.body;
    const admin = req.User;
    const files = req.files as {
      coverImage?: Express.Multer.File[];
      images?: Express.Multer.File[];
    };
    if (!files || !files.coverImage) {
      throw new CustomError("Cover image is required", 400);
    }
    const coverImage = files.coverImage;
    const images = files.images;

    //get Category
    const Category = await category.findById(categoryId);
    console.log(Category);
    if (!Category) {
      throw new CustomError("Category not found", 404);
    }
    const Product = new product({
      productName,
      productPrice,
      productDescription,
      createdBy: admin._id,
      productCategory: Category._id,
    });
    Product.coverImage = coverImage[0]?.path;
    if (images && images.length > 0) {
      const imagePath: string[] = images.map(
        (image: any, index: number) => image.path
      );
      Product.images = imagePath;
    }
    await Product.save();
    res.status(200).json({
      status: "success",
      success: true,
      data: Product,
      message: "Product created successfully",
    });
  }
);

//?Get All Products
export const getAllProducts = catchAsyncHandler(
  async (req: Request, res: Response) => {
    const { limit, page, query, category, minPrice, maxPrice } = req.query;
    const queryLimit = parseInt(limit as string) || 10;
    const currentPage = parseInt(page as string) || 1;
    const skip = (currentPage - 1) * queryLimit;
    let filter: Record<string, any> = {};
    if (category) {
      filter.category = category;
    }
    if (minPrice && maxPrice) {
      filter.productPrice = {
        $lte: parseFloat(maxPrice as string),
        $gte: parseFloat(minPrice as string),
      };
    }
    if (query) {
      filter.$or = [
        {
          productName: { $regex: query, $options: "i" },
        },
        {
          productDescription: {
            $regex: query,
            $options: "i",
          },
        },
      ];
    }
    const Product = await product
      .find(filter)
      .limit(queryLimit)
      .skip(skip)
      .populate("createdBy", "-password")
      .sort({ createdAt: -1 });
    const totalCount = await product.countDocuments(filter);
    const pagination = getPagination(currentPage, queryLimit, totalCount);
    res.status(200).json({
      status: "success",
      success: true,
      data: {
        data: Product,
        pagination,
      },
      message: "Product fetched successfully.",
    });
  }
);

//?Update Product
export const updateProduct = catchAsyncHandler(
  async (req: Request, res: Response) => {
    const {
      deletedImages,
      productName,
      productPrice,
      category: categoryId,
      productDescription,
    } = req.body;

    const id = req.params.id;

    // Find the product to update
    const productToUpdate = await product.findById(id);
    if (!productToUpdate) {
      throw new CustomError("Product not found", 404);
    }

    // Update basic product details
    productToUpdate.productName = productName || productToUpdate.productName;
    productToUpdate.productPrice = productPrice || productToUpdate.productPrice;
    productToUpdate.productDescription =
      productDescription || productToUpdate.productDescription;

    // Update category if provided
    if (categoryId) {
      const Category = await category.findById(categoryId);
      if (!Category) {
        throw new CustomError("Category not found", 404);
      }
      productToUpdate.productCategory = categoryId;
    }

    // Handle files if they exist
    if (req.files) {
      const files = req.files as {
        coverImage?: Express.Multer.File[];
        images?: Express.Multer.File[];
      };

      // Handle new cover image if uploaded
      if (files.coverImage && files.coverImage.length > 0) {
        // Delete old cover image if it exists
        if (productToUpdate.coverImage) {
          await deleteFiles([productToUpdate.coverImage as string]);
        }
        productToUpdate.coverImage = files.coverImage[0].path;
      }

      // Handle new images if uploaded
      if (files.images && files.images.length > 0) {
        const newImagePaths: string[] = files.images.map((image) => image.path);

        // Combine with existing images
        if (productToUpdate.images && productToUpdate.images.length > 0) {
          productToUpdate.images = [
            ...productToUpdate.images,
            ...newImagePaths,
          ];
        } else {
          productToUpdate.images = newImagePaths;
        }
      }
    }

    // Handle deleted images if specified
    if (deletedImages && deletedImages.length > 0) {
      try {
        // Parse if it's a string (from FormData)
        const imagesToDelete =
          typeof deletedImages === "string"
            ? JSON.parse(deletedImages)
            : deletedImages;

        await deleteFiles(imagesToDelete as string[]);
        productToUpdate.images = productToUpdate.images.filter(
          (image) => !imagesToDelete.includes(image)
        );
      } catch (error) {
        console.error("Error processing deleted images:", error);
      }
    }

    await productToUpdate.save();

    res.status(200).json({
      status: "success",
      success: true,
      data: productToUpdate,
      message: "Product updated successfully",
    });
  }
);

//?Delete Product
export const deleteProduct = catchAsyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const Product = await product.findById(id);

    if (!Product) {
      throw new CustomError("Product not found", 404);
    }
    if (Product.images && Product.images.length > 0) {
      await deleteFiles(Product.images as string[]);
    }
    await product.findByIdAndDelete(Product._id);
    res.status(200).json({
      status: "Success",
      success: true,
      message: "The product have been deleted.",
    });
  }
);

//get product by id
export const getProductById = catchAsyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const Product = await product.findById(id).populate("createdBy");

    res.status(200).json({
      status: "Success",
      success: true,
      message: "Product fetched.",
      data: Product,
    });
  }
);
