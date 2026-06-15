import { routeDevice } from "routes/device";
import { routeSchedules } from "routes/schedules";
import { routeSwitches } from "routes/switches";
import { Express } from "server/express";
import { console } from "utils/console";
import { name, code, version, port } from "utils/config";

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
console.info(`Name: ${name}, Code: ${code}, Version: ${version}`);
