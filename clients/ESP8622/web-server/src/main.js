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
  SystemTime,
  jsonResponse,
  plainResponse,
  htmlResource,
  jsResource,
  cssResource,
  icoResource,
} from "./utils";
import { Server } from "http";
import { System } from "file";
import Switch from "./switch";
import Ticker from "./ticker";
import Net from "net";
import config from "mc/config";
import Storage from "./storage";
import Counter from "./counter";
import Scheduler from "./schedule.manager";

const code = config["code"];
const version = config["version"];

const defaultName = config["defaultName"];
const defaultDescription = config["defaultDescription"];
const defaultStartTime = +config["defaultStartTime"];
const defaultManagerUrl = config["defaultManagerUrl"];

const info = System.info();

DiskInformation.output();
SystemTime.adjust();

const isEveryMinute = every(60);

const remainingTime = new Counter("time");

const name = new Storage("device", "name", defaultName);
const description = new Storage("device", "description", defaultDescription);
const isRunning = new Storage("ticker", "isRunning", false);
const startTime = new Storage("ticker", "startTime", defaultStartTime);
const managerUrl = new Storage("manager", "address", defaultManagerUrl);

const status = new Switch({ pin: 2, signal: LOW });
const relay = new Switch({ pin: 4, signal: HIGH });
const server = new Server({ port: 80 });

const timer = new Ticker({
  isRunning,
  remainingTime,
  startTime: startTime.getValue(),
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
  "/": htmlResource("index.html"), // Alias for index.html
  "/index.html": htmlResource("index.html"),
  "/config.html": htmlResource("config.html"),
  "/script.mjs": jsResource("script.mjs"),
  "/device.mjs": jsResource("device.mjs"),
  "/config.mjs": jsResource("config.mjs"),
  "/style.css": cssResource("style.css"),
  "/config.css": cssResource("config.css"),
  "/favicon.ico": icoResource("favicon.ico"),
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
      const occupiedInPercent = (info.used / info.total) * 100;
      const time = new Date();

      return jsonResponse({
        code,
        version,
        current: {
          name: name.getValue(),
          description: description.getValue(),
          startTime: startTime.getValue(),
          managerUrl: managerUrl.getValue(),
        },
        defaults: {
          name: defaultName,
          description: defaultDescription,
          startTime: defaultStartTime,
          managerUrl: defaultManagerUrl,
        },
        disk: {
          used: info.used,
          total: info.total,
          occupied: `${occupiedInPercent.toFixed(2)}%`,
        },
        time: {
          now: time * 1,
          str: time.toString(),
          iso: time.toISOString(),
        },
      });
    },
    "/config-reset": () => {
      description.setValue(defaultDescription);
      name.setValue(defaultName);
      startTime.setValue(defaultStartTime);
      managerUrl.setValue(defaultManagerUrl);
    },
    "/config-update": (ctx) => {
      if (ctx.params.managerUrl) {
        if (!ctx.params.managerUrl.startsWith("http")) {
          return apiError(
            `Invalid managerUrl. It must start with 'http://' or 'https://'`,
          );
        }
        managerUrl.setValue(ctx.params.managerUrl);
      }
      if (ctx.params.startTime) {
        if (+ctx.params.startTime < 10) {
          return apiError(`Invalid startTime. It must be at least 10 seconds`);
        }
        startTime.setValue(+ctx.params.startTime);
      }
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
        case "POST":
          switch (ctx.params.action) {
            case "ON":
              scheduler.turnOn();
              return { status: 200 };
            case "OFF":
              scheduler.turnOff();
              return { status: 200 };
            default:
              return apiError(`Invalid action: ${ctx.params.action}`);
          }
        case "PUT":
          const { index, week, hour, minute, active, runForSeconds } =
            ctx.params;

          try {
            scheduler.updateScheduleByIndex(
              parseInt(index),
              String(week),
              parseInt(hour),
              parseInt(minute),
              Boolean(active),
              parseInt(runForSeconds),
            );
          } catch (e) {
            return apiError(e.message);
          }

          return { status: 204 };

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
