import { defineConfig, loadEnv } from "vite";
import { cwd } from "node:process";
import { createHtmlPlugin } from "vite-plugin-html";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, cwd(), "IOT_");
  const deviceUrl = env.IOT_DEVICE_URL || "http://192.168.116.127";

  return {
    publicDir: "public",
    envPrefix: "IOT_",
    envDir: cwd(),
    server: {
      port: 4096,
      host: "0.0.0.0",
      open: "/index.html",
      proxy: {
        // Dev-only fallback: hit when no device URL is configured and the app
        // falls back to relative /api paths. Targets the .env default.
        "/api": deviceUrl,
      },
    },
    resolve: {
      alias: {
        "@src": `${cwd()}/src`,
      },
    },
    base: "./",
    esbuild: {
      supported: {
        "top-level-await": true,
      },
    },
    build: {
      cssMinify: true,
      sourcemap: false,
      emptyOutDir: true,
      rollupOptions: {
        input: {
          index: "index.html",
          config: "config.html",
          scheduler: "scheduler.html",
        },
      },
    },
    plugins: [
      createHtmlPlugin({
        minify: true,
      }),
    ],
    test: {
      setupFiles: [],
      globals: true,
      environment: "jsdom",
      coverage: {
        all: true,
        provider: "v8",
        reporter: ["cobertura", "text", "html"],
        exclude: ["*.cjs", "*.config.*", "dist/**", "src/**.d.ts", "tests"],
      },
    },
  };
});
