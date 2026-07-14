import { defineConfig } from "vitest/config";
import { resolve } from "node:path";
import { cwd } from "node:process";

const src = (path: string) => resolve(cwd(), "src", path);
const mock = (file: string) => resolve(cwd(), "tests/mocks", file);

export default defineConfig({
  resolve: {
    alias: [
      // The extracted express library (mirrors tsconfig.json "express" paths)
      { find: /^express$/, replacement: resolve(cwd(), "../moddable-kit/express/src/express.ts") },
      { find: /^express\/(.*)$/, replacement: resolve(cwd(), "../moddable-kit/express/src/$1") },
      // TS path aliases (mirror tsconfig.json "paths")
      { find: /^routes\/(.*)$/, replacement: src("routes/$1") },
      { find: /^services\/(.*)$/, replacement: src("services/$1") },
      { find: /^utils\/(.*)$/, replacement: src("utils/$1") },
      { find: /^controllers\/(.*)$/, replacement: src("controllers/$1") },
      { find: /^managers\/(.*)$/, replacement: src("managers/$1") },
      { find: /^database\/(.*)$/, replacement: src("database/$1") },
      { find: /^storages\/(.*)$/, replacement: src("storages/$1") },
      { find: /^server\/(.*)$/, replacement: src("server/$1") },
      // Moddable / XS platform built-ins -> Node-runnable stubs
      { find: "preference", replacement: mock("preference.ts") },
      { find: "timer", replacement: mock("timer.ts") },
      { find: "pins/digital", replacement: mock("pins-digital.ts") },
      { find: "net", replacement: mock("net.ts") },
      { find: "http", replacement: mock("http.ts") },
      { find: "file", replacement: mock("file.ts") },
      { find: "mdns", replacement: mock("mdns.ts") },
      { find: "sntp", replacement: mock("sntp.ts") },
      { find: "time", replacement: mock("time.ts") },
      { find: "Resource", replacement: mock("resource.ts") },
      { find: "mc/config", replacement: mock("mc-config.ts") },
    ],
  },
  test: {
    globals: true,
    coverage: {
      provider: "istanbul",
      reporter: ["text", "html"],
    },
  },
});
