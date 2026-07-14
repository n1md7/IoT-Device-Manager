import { routeDevice } from "routes/device";
import { routeSchedules } from "routes/schedules";
import { routeSwitches } from "routes/switches";
import { Express } from "express";
import { console } from "utils/console";
import { domain, code, version, port, timezone } from "utils/config";
import { env } from "utils/env";

import { claimLocalDomain } from "services/mdns";
import { adjustSystemTime, applyTimezone } from "services/time";

applyTimezone(timezone);
adjustSystemTime();
claimLocalDomain();

const server = new Express(port, {
  apiPrefix: "/api",
  isProduction: env.is.production,
  spaRoutes: ["/schedules", "/switches"],
});

server.route(routeSwitches);
server.route(routeSchedules);
server.route(routeDevice);

server.start();

console.info(`Server started successfully.`);
console.info(`Name: ${domain}, Code: ${code}, Version: ${version}`);
