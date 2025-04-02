"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchAsyncHandler = void 0;
const catchAsyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch((err) => next(err));
    };
};
exports.catchAsyncHandler = catchAsyncHandler;
