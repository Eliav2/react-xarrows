// import { readdirSync } from "fs";
// import { resolve } from "path";
// import fs from "fs";
//
// // find all files in the current directory including subdirectories
// const listAllFilesInDir = (dir) => {
//   const files = readdirSync(dir);
//   console.log("files",files);
//   return files.reduce((acc, file) => {
//     const name = resolve(dir, file);
//     const isDirectory = fs.statSync(name).isDirectory();
//     return isDirectory ? [...acc, ...listAllFilesInDir(name)] : [...acc, name];
//   }, []);
// };
//
// const removeExtension = (filename) => {
//   const lastDotPosition = filename.lastIndexOf(".");
//   if (lastDotPosition === -1) {
//     return filename;
//   }
//   return filename.substring(0, lastDotPosition);
// };
//
// // find all files in the current directory including subdirectories
// const mapAllFilesInDir = (baseDir,output) => {
//   const files = readdirSync(baseDir);
//   console.log("files",files);
//   return files.reduce((acc, dir) => {
//     // const name = resolve(dir, file);
//     const name = `${baseDir}\\${dir}`;
//     const outputName = removeExtension(`${output}\\${dir}`);
//     const isDirectory = fs.statSync(name).isDirectory();
//     return isDirectory ? {...acc, ...mapAllFilesInDir(name,`${outputName}`)} : {...acc, [outputName]:removeExtension(name)};
//   }, {});
// };
//
// const getAbsolutePath = (dir) => {
//   return resolve(dir);
// };
// console.log(mapAllFilesInDir("src\\redesign",'dist'));
//
//
import { Vector } from "./src/redesign/path/vector";

const v1 = new Vector(1, 2);
const v2 = new Vector(3, 4);
console.log(v1.add(v2));
