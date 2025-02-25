import {
  console,
  HIGH,
  LOW,
  API,
  every,
  toSeconds,
  apiError,
  requestHandler,
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

const name = config["name"];
const code = config["code"];
const version = config["version"];
const description = config["description"];
const startTime = config["buttonClickTime"];
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

console.log(`Device ${name}(${code}) v${version} (${description}) is ready!`);
console.log(`Disk total: ${info.total}; used: ${info.used}`);

const isTenthSecond = every(10);
const remainingTime = new Counter("time");
const isRunning = new Storage("ticker", "isRunning", false);
const status = new Switch({ pin: 2, signal: LOW });
const relay = new Switch({ pin: 4, signal: HIGH });
const server = new Server({ port: 80 });
const timer = new Ticker({
  isRunning,
  startTime,
  remainingTime,
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

      return {
        headers: ["Content-type", "application/json"],
        body: `{"name": "${name}", "version": "${version}", "description": "${description}", "disk": ${disk}}`,
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
