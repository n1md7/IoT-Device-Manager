import { Router } from "express/router";
import { code, domain as name, version, description } from "utils/config";

export const routeDevice = new Router("/device").get((ctx) => {
  return ctx.apiSend(200, {
    name,
    code,
    version,
    description,
    timestamp: Date.now(),
  });
});
