import { readdirSync } from "fs";
import { resolve } from "path";

// find all files in the current directory(no folders)
const listAllFilesInDir = (dir) => {
  return readdirSync(dir, { withFileTypes: true }).filter(dirnet => dirnet.isFile()).map(dirnet => dirnet.name);

};

const getAbsolutePath = (dir) => {
  return resolve(dir);
};
console.log(resolve("."));


