import { routeSchedules } from "routes/schedules";
import { routeSwitches } from "routes/switches";
import { Express } from "server/express";

import { claimLocalDomain } from "services/mdns";
import { adjustSystemTime } from "services/time";

adjustSystemTime();
claimLocalDomain();

const server = new Express("/api", 80);

server.use(routeSwitches);
server.use(routeSchedules);

server.start();
