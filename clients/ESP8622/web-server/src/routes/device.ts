import { Router } from "server/router";
import { code, name, version, description } from "utils/config";

export const routeDevice = new Router("/device").get((ctx) => {
  return ctx.apiSend(200, {
    name,
    code,
    version,
    description,
    timestamp: Date.now(),
  });
});
