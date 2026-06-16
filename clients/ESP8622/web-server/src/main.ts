import { routeDevice } from "routes/device";
import { routeSchedules } from "routes/schedules";
import { routeSwitches } from "routes/switches";
import { Express } from "server/express";
import { console } from "utils/console";
import { domain, code, version, port } from "utils/config";

import { claimLocalDomain } from "services/mdns";
import { adjustSystemTime } from "services/time";

adjustSystemTime();
claimLocalDomain();

const server = new Express("/api", port);

server.use(routeSwitches);
server.use(routeSchedules);
server.use(routeDevice);

server.start();

console.info(`Server started successfully.`);
console.info(`Name: ${domain}, Code: ${code}, Version: ${version}`);

/**
 * TODO: Think of remedy for manual control and scheduler. perhaps manual control can be inmemory schedule that runs once?
 */
