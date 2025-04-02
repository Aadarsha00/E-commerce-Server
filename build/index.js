"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const dbConnect_1 = require("./config/dbConnect");
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const review_routes_1 = __importDefault(require("./routes/review.routes"));
const cart_routes_1 = __importDefault(require("./routes/cart.routes"));
const wishList_routes_1 = __importDefault(require("./routes/wishList.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const errorhandler_middleware_1 = require("./middleware/errorhandler.middleware");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8000;
//middleware
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
//serving static file
app.use("/api/upload", express_1.default.static(path_1.default.join(__dirname, "../", "uploads")));
//connecting mongoose
(0, dbConnect_1.connectDatabase)();
//routes user
app.use("/api/user", user_routes_1.default);
//routes product
app.use("/api/product", product_routes_1.default);
//routes category
app.use("/api/category", category_routes_1.default);
//routes review
app.use("/api/review", review_routes_1.default);
//routes cart
app.use("/api/cart", cart_routes_1.default);
//routes wishList
app.use("/api/wishlist", wishList_routes_1.default);
//routes order
app.use("/api/order", order_routes_1.default);
//? root api
app.use("/", (req, res) => {
    res.status(200).json({ message: "Server is up and running" });
});
//handler not found path
app.all("*", (req, res, next) => {
    const message = `can not ${req.method} on ${req.originalUrl}`;
    const error = new errorhandler_middleware_1.CustomError(message, 404);
    next(error);
});
//error handler
app.use((error, req, res, next) => {
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
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
