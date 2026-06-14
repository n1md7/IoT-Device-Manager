import {
  API,
  apiError,
  console,
  every,
  HIGH,
  LOW,
  requestHandler,
  toSeconds,
  DiskInformation,
  jsonResponse,
  plainResponse,
  streamResource,
} from "utils/http";
import systemTime from "services/time";
import { Server } from "http";
import { System } from "file";
import Switch from "services/switch";
import Ticker from "services/ticker";
import Net from "net";
import config from "mc/config";
import Storage from "./database/storage";
import Counter from "services/counter";
import Scheduler from "./schedule";

const code = config["code"];
const version = config["version"];

const defaultName = config["defaultName"];
const defaultDescription = config["defaultDescription"];

const info = System.info();

DiskInformation.output();
systemTime.adjustAutomatically();

const isEveryMinute = every(60);

const remainingTime = new Counter();

const name = new Storage("device", "name", defaultName);
const description = new Storage("device", "description", defaultDescription);

const status = new Switch({ pin: 2, signal: LOW });
const D0 = new Switch({ pin: 0, signal: HIGH });
const D1 = new Switch({ pin: 1, signal: HIGH });
const D3 = new Switch({ pin: 3, signal: HIGH });
const D4 = new Switch({ pin: 4, signal: HIGH });
const server = new Server({ port: 80 });

const timer = new Ticker({
  isRunning: false,
  remainingTime,
  startTime: 10,
  onTick: (value, logger) => {
    if (isEveryMinute(value)) {
      logger.info(`Remaining time: ${value}`);
    }
  },
  onStart: (timestamp, logger) => {
    status.start();
    relay.start();
  },
  onStop: () => {
    status.stop();
    relay.stop();
  },
});

const scheduler = new Scheduler();

scheduler
  .setOnExecute((timeInSeconds, logger) => {
    logger.info(`Scheduler execution requested for ${timeInSeconds} seconds`);

    // When the timer is already running, we don't need to start it again
    if (!timer.isActive()) {
      timer.start(timeInSeconds);
      logger.info(`Timer started for ${timeInSeconds} seconds`);
    }
  })
  .initialize();

server.callback = requestHandler({
  "/": streamResource({ path: "index.html", type: "html" }), // Alias for index.html (streamed)
  [API]: {
    "/on": (ctx) => {
      if (!ctx.is.post) return apiError("Only POST is allowed");

      const { min = 0, sec = 0 } = ctx.params;
      if (min < 0 || sec < 0) {
        return apiError(
          `Invalid query parameters. 'min' and 'sec' are required! And need to be positive!`,
        );
      }
      const time = toSeconds(min, sec || 10);
      if (time < 10) {
        return apiError(`You must set a duration of at least 10 seconds!`);
      }

      timer.start(time);

      return jsonResponse({ active: true, time });
    },
    "/off": (ctx) => {
      if (!ctx.is.post) return apiError("Only POST is allowed");

      timer.stop();

      return jsonResponse({ active: false });
    },
    "/status": () => {
      return jsonResponse({
        active: timer.isActive(),
        time: timer.getCurrentTime(),
      });
    },
    "/info": (ctx) => {
      return jsonResponse({
        code,
        version,
        name: name.getValue(),
        time: new Date().toISOString(),
        description: description.getValue(),
      });
    },
    "/config-update": (ctx) => {
      if (ctx.params.name) name.setValue(ctx.params.name.substring(0, 32));
      if (ctx.params.description) {
        description.setValue(ctx.params.description.substring(0, 64));
      }

      return { status: 204 };
    },
    "/schedules": (ctx) => {
      switch (ctx.method) {
        case "GET":
          return jsonResponse(scheduler.toJson());
        case "POST": {
          switch (ctx.params.action) {
            case "ON":
              scheduler.turnOn();
              return { status: 200 };
            case "OFF":
              scheduler.turnOff();
              return { status: 200 };
            case "CREATE": {
              const created = scheduler.create();
              if (created instanceof Error) return apiError(created.message);
              return jsonResponse(created, 201);
            }
            case "REMOVE": {
              const error = scheduler.remove(parseInt(ctx.params.id));
              if (error) return apiError(error.message);
              return { status: 204 };
            }
            default:
              return apiError(`Invalid action: ${ctx.params.action}`);
          }
        }
        case "PUT": {
          const { id, weekdays, hour, minute } = ctx.body;
          const { active, activateForSeconds } = ctx.body;

          const error = scheduler.updateScheduleById(
            parseInt(id),
            String(weekdays),
            parseInt(hour),
            parseInt(minute),
            active.toLowerCase() === "true",
            parseInt(activateForSeconds),
          );

          if (error) {
            return apiError(error.message);
          }

          return { status: 204 };
        }

        default:
          return apiError(`Method not allowed: ${ctx.method}`);
      }
    },
  },
  404: (ctx) => {
    return plainResponse(`Route not found: ${ctx.path}`);
  },
});

console.log(
  `Device ${name.getValue()}(${code}) v${version} (${description.getValue()}) is ready!`,
);
console.log(`Disk total: ${info.total}; used: ${info.used}`);
console.log(`[http] server ready at ${Net.get("IP")}`);

const wasRunning = isRunning.getValue();
const prevTime = timer.getCurrentTime();

console.log(`[db] remaining time: ${prevTime}`);
console.log(`[db] timer is running: ${wasRunning}`);

if (wasRunning && prevTime > 0) {
  console.log(`Timer was running before. Restoring state...`);
  timer.start(prevTime);
  console.log(`Timer restored`);
}
