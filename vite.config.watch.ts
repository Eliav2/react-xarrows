import { defineConfig } from "vite";

import defaultViteConfig from "./vite.config";

// https://vitejs.dev/config/
export default defineConfig({
  ...defaultViteConfig,
  build: {
    ...(defaultViteConfig as any).build,
    emptyOutDir: false,
    watch: {
      // include: path.join(__dirname, "src/**/*"),
      include: ["src/**/*"],
      clearScreen: false,
    },
  },
});