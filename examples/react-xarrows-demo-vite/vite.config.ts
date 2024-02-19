import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig((conf) => {
  const { mode } = conf;
  console.log(path.resolve("../../src/index.ts"));
  return {
    build: {
      minify: false,
    },
    resolve:
      mode === "development"
        ? {
            alias: [
              {
                find: "react-xarrows",
                replacement: path.resolve("../../src/index.ts"),
              },
            ],
          }
        : {},
    plugins: [react()],
  };
});
