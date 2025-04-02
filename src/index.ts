import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import { connectDatabase } from "./config/dbConnect";
import userRoutes from "./routes/user.routes";
import productRoutes from "./routes/product.routes";
import categoryRoutes from "./routes/category.routes";
import reviewRoutes from "./routes/review.routes";
import cartRoutes from "./routes/cart.routes";
import wishListRoutes from "./routes/wishList.routes";
import orderRoutes from "./routes/order.routes";
import { CustomError } from "./middleware/errorhandler.middleware";
import path from "path";
const app = express();
const PORT = process.env.PORT || 8000;

//middleware
app.use(express.urlencoded({ extended: false }));

//serving static file
app.use("/api/upload", express.static(path.join(__dirname, "../", "uploads")));

//connecting mongoose
connectDatabase();

//?
app.use("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Server is up and running" });
});

//routes user
app.use("/api/user", userRoutes);

//routes product
app.use("/api/product", productRoutes);

//routes category
app.use("/api/category", categoryRoutes);

//routes review
app.use("/api/review", reviewRoutes);

//routes cart
app.use("/api/cart", cartRoutes);

//routes wishList
app.use("/api/wishlist", wishListRoutes);

//routes order
app.use("/api/order", orderRoutes);

//handler not found path
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const message = `can not ${req.method} on ${req.originalUrl}`;
  const error = new CustomError(message, 404);
  next(error);
});

//error handler
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = error.statusCode || 500;
  const status = error.status || "error";
  const message = error.message || "Something went wrong";
  res.status(statusCode).json({
    status,
    success: false,
    message,
  });
});
//Port
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
