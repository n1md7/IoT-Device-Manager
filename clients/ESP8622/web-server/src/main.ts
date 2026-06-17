import { routeDevice } from "routes/device";
import { routeSchedules } from "routes/schedules";
import { routeSwitches } from "routes/switches";
import { Express } from "server/express";
import { console } from "utils/console";
import { domain, code, version, port, timezone } from "utils/config";

import { claimLocalDomain } from "services/mdns";
import { adjustSystemTime, applyTimezone } from "services/time";

applyTimezone(timezone);
adjustSystemTime();
claimLocalDomain();

const server = new Express("/api", port, ["/schedules", "/switches"]);

server.use(routeSwitches);
server.use(routeSchedules);
server.use(routeDevice);

server.start();

console.info(`Server started successfully.`);
console.info(`Name: ${domain}, Code: ${code}, Version: ${version}`);
