import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  // plugins: [react()]
  build: {
    minify: false,
    outDir: "dist",
    emptyOutDir: true,
    lib: {
      entry: ["src/index.ts", "src/redesign/XArrow.tsx"],
      name: "react-xarrows",
      formats: ["cjs", "es"],
    },
    rollupOptions: { external: ["react", "react-dom", "lodash", "prop-types", "@types/prop-types"] },
  },
  plugins: [dts({ entryRoot: "src", outputDir: "dist/types" })],
});
