import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { readdirSync } from "fs";
import { resolve } from "path";

// find all files in the current directory(no folders)
const listAllFilesInDir = (dir: string) => {
  return readdirSync(dir, { withFileTypes: true })
    .filter((dirnet) => dirnet.isFile())
    .map((dirnet) => resolve(dir, dirnet.name));
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
      entry: listAllFilesInDir("src/redesign"),
      name: "react-xarrows",
      formats: ["cjs", "es"],
    },
    rollupOptions: { external: ["react", "react-dom", "lodash", "prop-types", "@types/prop-types"] },
  },
  plugins: [dts({ entryRoot: "src", outputDir: "dist/types" })],
});
