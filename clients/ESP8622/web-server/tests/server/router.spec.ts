import { describe, expect, it } from "vitest";
import { Context, Path, Router } from "express/router";

type MethodNames<T> = {
  [K in keyof T]-?: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];
type Methods = MethodNames<Router>;

describe("Router", () => {
  describe("getRoutes", () => {
    it("should verify many routes", () => {
      const router = new Router("/users");

      router.get("/", (ctx) => ctx.apiSend(200));
      router.put("/", (ctx) => ctx.apiSend(200));
      router.post("/", (ctx) => ctx.apiSend(201));
      router.delete("/", (ctx) => ctx.apiSend(204));

      router.get("/one", (ctx) => ctx.apiSend(200));
      router.get("/two", (ctx) => ctx.apiSend(200));
      router.post("/create/many", (ctx) => ctx.apiSend(201));
      router.delete("/bulk", (ctx) => ctx.apiSend(204));

      expect(router.getRoutes()).toEqual(
        expect.objectContaining({
          "/users": expect.any(Object),
          "/users/one": expect.any(Object),
          "/users/two": expect.any(Object),
          "/users/bulk": expect.any(Object),
          "/users/create/many": expect.any(Object),
        }),
      );
      expect(router.getRoutes()).toMatchSnapshot();
    });
  });

  describe("getNamespace", () => {
    it("should verify '/' namespace", () => {
      const router = new Router("/");

      expect(router.getNamespace()).toBe("/");
    });

    it("should verify non-'/' namespace", () => {
      const router = new Router("/users");

      expect(router.getNamespace()).toBe("/users");
    });

    it("should verify namespace with prefix", () => {
      const router = new Router("/users");
      const prefix: Path = "/api/v1";

      // No slash in the end, very important 😬
      expect(router.getNamespace(prefix)).toBe("/api/v1/users");
    });
  });

  describe.each([
    [
      {
        method: "get" as Methods,
        path: "/users" as Path,
        namespace: "/api/v1" as Path,
      },
    ],
    [
      {
        method: "post" as Methods,
        path: "/users" as Path,
        namespace: "/api/v1" as Path,
      },
    ],
    [
      {
        method: "put" as Methods,
        path: "/users" as Path,
        namespace: "/api/v1" as Path,
      },
    ],
    [
      {
        method: "patch" as Methods,
        path: "/users" as Path,
        namespace: "/api/v1" as Path,
      },
    ],
    [
      {
        method: "delete" as Methods,
        path: "/users" as Path,
        namespace: "/api/v1" as Path,
      },
    ],
    [
      {
        method: "options" as Methods,
        path: "/users" as Path,
        namespace: "/api/v1" as Path,
      },
    ],
  ])("methods", ({ method, path, namespace }) => {
    it(`${method}(path, handler) with status`, () => {
      const handler = (ctx: Context) => ctx.apiSend(200);
      const router = new Router(namespace);

      expect(router[method](path, handler)).toMatchSnapshot();
    });

    it(`${method}(path, handler) with status and response`, () => {
      const handler = (ctx: Context) =>
        ctx.apiSend(200, {
          message: "OK",
        });
      const router = new Router(namespace);

      expect(router[method](path, handler)).toMatchSnapshot();
    });

    it(`${method}(handler)`, () => {
      const handler = (ctx: Context) => ctx.apiSend(200);
      const router = new Router(namespace);

      // @ts-ignore
      expect(router[method](handler)).toMatchSnapshot();
    });
  });
});
