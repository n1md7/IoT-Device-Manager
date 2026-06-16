import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

export default defineConfig({
  plugins: [preact()],
  base: "./",
  server: {
    proxy: {
      "/api": "http://node-mcu.local",
    },
  },
  build: {
    // Emit a flat dist/ — no assets/ subfolder or hashed sub-dirs.
    assetsDir: "",
    rollupOptions: {
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        assetFileNames: "[name][extname]",
      },
    },
  },
});
