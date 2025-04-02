"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFiles = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const deleteFiles = (filesPath) => {
    filesPath.forEach((filePath) => {
        const fileToDelete = path_1.default.join(__dirname, filePath);
        fs_1.default.unlink(fileToDelete, (err) => {
            console.log("There was a error ", err);
        });
    });
};
exports.deleteFiles = deleteFiles;
