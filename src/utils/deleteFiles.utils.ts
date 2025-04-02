import fs from "fs";
import path from "path";
export const deleteFiles = (filesPath: string[]) => {
  filesPath.forEach((filePath) => {
    const fileToDelete = path.join(__dirname, filePath);
    fs.unlink(fileToDelete, (err) => {
      console.log("There was a error ", err);
    });
  });
};
