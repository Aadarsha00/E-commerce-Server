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
      productPrice,
      productDescription,
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

    // get category
    const Category = await category.findById(categoryId);

    if (!Category) {
      throw new CustomError("Category not found", 404);
    }

    const Product = new product({
      productName,
      productPrice,
      productDescription,
      createdBy: admin._id,
      category: Category._id,
    });

    Product.coverImage = {
      path: coverImage[0]?.path,
      public_id: coverImage[0]?.fieldname,
    };

    if (images && images.length > 0) {
      const imagePath = images.map((image: any, index: number) => {
        return {
          path: image.path,
          public_id: image.fieldname,
        };
      });
      Product.images = imagePath;
    }

    await Product.save();

    res.status(201).json({
      status: "success",
      success: true,
      data: product,
      message: "Product created successfully!",
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
      productDescription,
      productPrice,
      categoryId,
    } = req.body;
    const id = req.params.id;
    const { coverImage, images } = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const Product = await product.findByIdAndUpdate(
      id,
      { productName, productDescription, productPrice },
      { new: true }
    );

    if (!Product) {
      throw new CustomError("Product not found", 404);
    }

    if (categoryId) {
      const Category = await category.findById(categoryId);
      if (!Category) {
        throw new CustomError("Category not found", 404);
      }

      Product.productCategory = categoryId;
    }

    if (coverImage) {
      await deleteFiles([Product.coverImage as string]);
      Product.coverImage = {
        path: coverImage[0].path,
        public_id: coverImage[0].fieldname,
      };
    }

    if (deletedImages && deletedImages.length > 0) {
      await deleteFiles(deletedImages as string[]);
      Product.images = Product.images.filter(
        (image) => !deletedImages.includes(image.public_id)
      );
    }

    if (images && images.length > 0) {
      const imagePath = images.map((image: any, index: number) => {
        return {
          path: image.path,
          public_id: image.fieldname,
        };
      });
      Product.images = [...Product.images, ...imagePath];
    }

    await Product.save();

    res.status(201).json({
      status: "success",
      success: true,
      data: Product,
      message: "Product updated successfully!",
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

    if (Product.coverImage) {
      //@ts-expect-error
      await deleteFiles([Product.coverImage.public_id] as string[]);
    }

    if (Product.images && Product.images.length > 0) {
      await deleteFiles(
        Product.images.map((image) => image.public_id) as string[]
      );
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
