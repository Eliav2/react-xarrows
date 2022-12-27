import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import fs, { readdirSync } from "fs";
import { resolve } from "path";

// // find all files in the current directory(no folders)
// const listAllFilesInDir = (dir: string) => {
//   return readdirSync(dir, { withFileTypes: true })
//     .filter((dirnet) => dirnet.isFile())
//     .map((dirnet) => resolve(dir, dirnet.name));
// };

// // find all files in the current directory including subdirectories
// const listAllFilesInDir = (dir) => {
//   const files = readdirSync(dir);
//   console.log("files", files);
//   return files.reduce((acc, file) => {
//     const name = resolve(dir, file);
//     const isDirectory = fs.statSync(name).isDirectory();
//     return isDirectory ? [...acc, ...listAllFilesInDir(name)] : [...acc, name];
//   }, []);
// };

const removeExtension = (filename) => {
  const lastDotPosition = filename.lastIndexOf(".");
  if (lastDotPosition === -1) {
    return filename;
  }
  return filename.substring(0, lastDotPosition);
};

// find all files in the current directory including subdirectories
const mapAllFilesInDir = (baseDir, output) => {
  const files = readdirSync(baseDir);
  console.log("files", files);
  return files.reduce((acc, dir) => {
    // const name = resolve(dir, file);
    const name = `${baseDir}\\${dir}`;
    const outputName = removeExtension(`${output}\\${dir}`);
    const isDirectory = fs.statSync(name).isDirectory();
    return isDirectory ? { ...acc, ...mapAllFilesInDir(name, `${outputName}`) } : { ...acc, [outputName]: removeExtension(name) };
  }, {});
};

// https://vitejs.dev/config/
export default defineConfig({
  // plugins: [react()]
  build: {
    minify: false,
    outDir: "dist",
    emptyOutDir: true,
    lib: {
      // entry: ["src/index.ts"],
      // entry: listAllFilesInDir("src/redesign"),
      // entry: { "build/internal/hooks": "src/redesign/internal/hooks" },
      entry: mapAllFilesInDir("src/redesign", "build"),
      name: "react-xarrows",
      formats: ["cjs", "es"],
    },
    rollupOptions: { external: ["react", "react-dom", "lodash", "prop-types", "@types/prop-types"] },
    // todo: to this only in prod mode
    sourcemap: true,
  },
  plugins: [dts({ entryRoot: "src", outputDir: "dist/types", tsConfigFilePath: "tsconfig.json" })],
});
