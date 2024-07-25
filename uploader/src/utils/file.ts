import * as fs from "fs";
import path from "path";

export function getAllFiles(folderPath: string): string[] {
  let response: string[] = [];

  const allFilesAndFolders = fs.readdirSync(folderPath);
  allFilesAndFolders.forEach((fileOrFolder) => {
    const fullFilePath = path.join(folderPath, fileOrFolder);
    if (fs.statSync(fullFilePath).isDirectory()) {
      response = response.concat(getAllFiles(fullFilePath));
    } else {
      response.push(fullFilePath);
    }
  });
  return response;
}
