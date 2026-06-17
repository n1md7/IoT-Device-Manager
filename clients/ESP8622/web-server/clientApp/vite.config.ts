import { join } from "node:path";
import { cwd } from "node:process";
import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

export default defineConfig({
  resolve: {
    alias: {
      "@src": join(cwd(), "./src"),
    },
  },
  plugins: [preact()],
  base: "./",
  server: {
    proxy: {
      "/api": "http://192.168.116.127",
      // "/api": "http://node-mcu.local",
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
