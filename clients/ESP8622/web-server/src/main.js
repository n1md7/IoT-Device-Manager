import {
  API,
  apiError,
  console,
  every,
  HIGH,
  LOW,
  requestHandler,
  toSeconds,
} from "./utils";
import { Server } from "http";
import { Iterator, System } from "file";
import Switch from "./switch";
import Ticker from "./ticker";
import Net from "net";
import Resource from "Resource";
import config from "mc/config";
import Storage from "./storage";
import Counter from "./counter";

const code = config["device"]["code"];
const version = config["device"]["version"];

const defaultName = config["default"]["name"];
const defaultDescription = config["default"]["description"];
const defaultStartTime = config["default"]["startTime"];
const defaultManagerAddress = config["default"]["managerUrl"];

const info = System.info();
const cached = [
  "Cache-Control",
  //
  "public, max-age=31536000",
];

for (const item of new Iterator(config.file.root)) {
  if (item.length) {
    console.log(`Existing file on disk: ${item.name}, ${item.length} bytes`);
  }
}

const isTenthSecond = every(10);

const remainingTime = new Counter("time");

const name = new Storage("device", "name", defaultName);
const description = new Storage("device", "description", defaultDescription);
const isRunning = new Storage("ticker", "isRunning", false);
const startTime = new Storage("ticker", "startTime", defaultStartTime);
const managerUrl = new Storage("manager", "address", defaultManagerAddress);

const status = new Switch({ pin: 2, signal: LOW });
const relay = new Switch({ pin: 4, signal: HIGH });
const server = new Server({ port: 80 });
const timer = new Ticker({
  isRunning,
  remainingTime,
  startTime: startTime.getValue(),
  onTick: (value, logger) => {
    if (isTenthSecond(value)) {
      logger.info(`Remaining time: ${value}`);
    }
  },
  onStart: () => {
    status.start();
    relay.start();
  },
  onStop: () => {
    status.stop();
    relay.stop();
  },
});

server.callback = requestHandler({
  "/": () => ({
    headers: ["Content-type", "text/html"],
    body: new Resource("index.html"),
  }),
  "/script.mjs": () => ({
    headers: ["Content-type", "application/javascript", ...cached],
    body: new Resource("script.mjs"),
  }),
  "/device.mjs": () => ({
    headers: ["Content-type", "application/javascript", ...cached],
    body: new Resource("device.mjs"),
  }),
  "/style.css": () => ({
    headers: ["Content-type", "text/css", ...cached],
    body: new Resource("style.css"),
  }),
  "/favicon.ico": () => ({
    headers: ["Content-type", "image/x-icon", ...cached],
    body: new Resource("favicon.ico"),
  }),
  "config.html": () => ({
    headers: ["Content-type", "text/html"],
    body: new Resource("config.html"),
  }),
  "/config.mjs": () => ({
    headers: ["Content-type", "application/javascript", ...cached],
    body: new Resource("config.mjs"),
  }),
  "/config.css": () => ({
    headers: ["Content-type", "text/css", ...cached],
    body: new Resource("config.css"),
  }),
  [API]: {
    "/on": (ctx) => {
      const { min = 0, sec = 0 } = ctx.params;
      if (min < 0 || sec < 0) {
        return apiError(
          `Invalid query parameters. 'min' and 'sec' are required! And need to be positive!`,
        );
      }
      const seconds = toSeconds(min, sec || 10);
      if (seconds < 10) {
        return apiError(`You must set a duration of at least 10 seconds!`);
      }

      timer.start(seconds);

      return {
        headers: ["Content-type", "application/json"],
        body: `{"active": true, "time": ${seconds}}`,
      };
    },
    "/off": () => {
      timer.stop();

      return {
        headers: ["Content-type", "application/json"],
        body: `{"active": false}`,
      };
    },
    "/status": () => {
      return {
        headers: ["Content-type", "application/json"],
        body: `{"active": ${timer.getStatus()}, "time": ${timer.getCurrentTime()}}`,
      };
    },
    "/info": () => {
      const occupiedInPercent = (info.used / info.total) * 100;
      const disk = `{"used": ${info.used}, "total": ${info.total}, "occupied": "${occupiedInPercent.toFixed(2)}%"}`;
      const defaults = `{"startTime": "${defaultStartTime}", "managerUrl": "${defaultManagerAddress}"}`;
      const current = `{"startTime": ${startTime.getValue()}, "managerUrl": "${managerUrl.getValue()}"}`;

      return {
        headers: ["Content-type", "application/json"],
        body: `{"name": "${name}", "version": "${version}", "description": "${description}", "disk": ${disk}, "defaults": ${defaults}, "current": ${current}}`,
      };
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
        if (ctx.params.startTime < 10) {
          return apiError(`Invalid startTime. It must be at least 10 seconds`);
        }
        startTime.setValue(ctx.params.startTime);
      }
      if (ctx.params.name) name.setValue(ctx.params.name.substring(0, 32));
      if (ctx.params.description) {
        description.setValue(ctx.params.description.substring(0, 64));
      }

      return {
        body: "",
        status: 204,
      };
    },
  },
  404: (ctx) => {
    return {
      headers: ["Content-type", "text/plain"],
      body: `Route not found: ${ctx.path}`,
    };
  },
});

console.log(`Device ${name}(${code}) v${version} (${description}) is ready!`);
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
