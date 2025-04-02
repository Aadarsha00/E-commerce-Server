"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = void 0;
const DB_URL = process.env.DB_URL || "";
const mongoose_1 = __importDefault(require("mongoose"));
const connectDatabase = () => {
    mongoose_1.default
        .connect(DB_URL)
        .then(() => {
        console.log("Database Connected");
    })
        .catch((err) => {
        console.log("Error", err);
    });
};
exports.connectDatabase = connectDatabase;
