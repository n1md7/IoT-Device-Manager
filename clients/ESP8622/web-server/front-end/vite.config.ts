import { defineConfig } from "vite";
import { env, cwd } from "node:process";
import { createHtmlPlugin } from "vite-plugin-html";

export default defineConfig((env) => {
  return {
    publicDir: "public",
    envPrefix: "IOT_",
    envDir: cwd(),
    server: {
      port: 4096,
      host: "0.0.0.0",
      open: "/index.html",
      proxy: {
        "/api": "http://localhost:1234",
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
      reportCompressedSize: true,
      modulePreload: false,
      cssMinify: true,
      cssCodeSplit: true,
      chunkSizeWarningLimit: 2.75,
      sourcemap: false,
      emptyOutDir: true,
      assetsDir: ".",
      rollupOptions: {
        treeshake: false,
        input: {
          index: "index.html",
          config: "config.html",
          scheduler: "scheduler.html",
        },
        output: {
          manualChunks: (path, { getModuleIds }) => {
            if (path.endsWith(".ts")) {
              if (path.endsWith(".ts") && path.includes("schedules")) {
                const [, file] = path.split("/schedules/");
                const [name] = file.split(".");

                return name;
              }

              if (path.endsWith("footer.ts")) return "footer";
              if (path.endsWith("nav.ts")) return "nav";
              if (path.endsWith("dom.utils.ts")) return "dom.utils";
              if (path.endsWith("dom.text.ts")) return "dom.text";
            }
          },
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
