import { describe, expect, it } from "vitest";
import { routeSchedules } from "../../src/routes/schedules";
import { routeSwitches } from "../../src/routes/switches";
import { Express } from "express";
import { Router } from "express/router";

describe("Express", () => {
  it("should verify multiple namespaces", () => {
    const users = new Router("/users")
      .get((ctx) => ctx.apiSend(200))
      .post((ctx) => ctx.apiSend(200))
      .put((ctx) => ctx.apiSend(200))
      .delete((ctx) => ctx.apiSend(200));
    const schedules = new Router("/schedules")
      .get((ctx) => ctx.apiSend(200))
      .get((ctx) => ctx.apiSend(200))
      .post((ctx) => ctx.apiSend(200))
      .delete((ctx) => ctx.apiSend(200));
    const schedulesControl = new Router("/schedules/control").post((ctx) =>
      ctx.apiSend(200),
    );
    const switches = new Router("/switches")
      .get((ctx) => ctx.apiSend(200))
      .post((ctx) => ctx.apiSend(200))
      .delete((ctx) => ctx.apiSend(200));

    const express = new Express(80, { apiPrefix: "/api" })
      .route(users)
      .route(schedules)
      .route(schedulesControl)
      .route(switches);

    expect(express.getRoutes()).toEqual({
      "/api/users": expect.any(Object),
      "/api/schedules": expect.any(Object),
      "/api/switches": expect.any(Object),
      "/api/schedules/control": expect.any(Object),
    });
    expect(express.getRoutes()).toMatchSnapshot();
  });

  it("should verify existing routes", () => {
    const server = new Express(80, { apiPrefix: "/api" });

    server.route(routeSwitches);
    server.route(routeSchedules);

    const routes = server.getRoutes();

    // Each entry is now `{ handlers, plugins }` (routers can carry plugins).
    expect(routes).toEqual(
      expect.objectContaining({
        "/api/schedules": {
          handlers: {
            GET: expect.any(Function),
            POST: expect.any(Function),
            PATCH: expect.any(Function),
            DELETE: expect.any(Function),
          },
          plugins: [],
        },
        "/api/switches": {
          handlers: {
            GET: expect.any(Function),
            POST: expect.any(Function),
            PATCH: expect.any(Function),
            DELETE: expect.any(Function),
          },
          plugins: [],
        },
      }),
    );
    expect(routes).toMatchSnapshot();
  });

  it("should verify start", () => {
    const express = new Express(80, { apiPrefix: "/api" });
    const server = express.start();

    expect(server).toEqual(
      expect.objectContaining({
        callback: expect.any(Function),
      }),
    );
  });
});
