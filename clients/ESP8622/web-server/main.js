import { HIGH, LOW, console, logger } from "./utils";
import { Server } from "http";
import { System, Iterator, File } from "file";
import Switch from "./switch";
import Ticker from "./ticker";
import Net from "net";
import Resource from "Resource";
import config from "mc/config";
import Storage from "./storage";
import Counter from "./counter";

const name = config["name"];
const version = config["version"];
const description = config["description"];
const info = System.info();

for (const item of new Iterator(config.file.root)) {
  if (item.length) {
    console.log(`Existing file on disk: ${item.name}, ${item.length} bytes`);
  }
}

console.log(`Device ${name} v${version} (${description}) is ready!`);
console.log(`Disk total: ${info.total}; used: ${info.used}`);

const files = {
  index: new Resource("index.html"),
  script: new Resource("script.mjs"),
  vanLib: new Resource("van-1.5.3.min.mjs"),
  style: new Resource("style.css"),
  favicon: new Resource("favicon.ico"),
};

const responses = {
  index: {
    headers: ["Content-type", "text/html"],
    body: files.index,
  },
  script: {
    headers: ["Content-type", "application/javascript"],
    body: files.script,
  },
  vanLib: {
    headers: ["Content-type", "application/javascript"],
    body: files.vanLib,
  },
  style: {
    headers: ["Content-type", "text/css"],
    body: files.style,
  },
  favicon: {
    headers: ["Content-type", "image/x-icon"],
    body: files.favicon,
  },
  apiError: (message) => {
    return {
      headers: ["Content-type", "application/json"],
      body: `{"message": "${message}"}`,
      status: 400,
    };
  },
};
const API = "/api";

const remainingTime = new Counter("time");
const isRunning = new Storage("ticker", "isRunning", false);
const status = new Switch({ pin: 2, signal: LOW });
const relay = new Switch({ pin: 4, signal: HIGH });
const server = new Server({ port: 80 });
const timer = new Ticker({
  remainingTime,
  isRunning,
  startTime: 1200, // 20m
  onTick: (time, logger) => {
    logger.log(`Time is remaining: ${time} seconds`);
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
const toSeconds = (min, sec) => min * 60 + +sec;

const routes = {
  "/": () => responses.index,
  "/script.mjs": () => responses.script,
  "/van-1.5.3.min.mjs": () => responses.vanLib,
  "/style.css": () => responses.style,
  "/favicon.ico": () => responses.favicon,
  [API]: {
    "/on": (ctx) => {
      const { min = 0, sec = 0 } = ctx.params;
      if (!min || !sec) {
        return responses.apiError(
          `Invalid query parameters. 'min' and 'sec' are required!`,
        );
      }
      const seconds = toSeconds(min, sec || 10);
      if (seconds < 10)
        return responses.apiError(
          `You must set a duration of at least 10 seconds!`,
        );

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
};

server.callback = function (message, value) {
  switch (message) {
    case Server.status:
      const [route, query] = value.split("?");
      this.path = value;
      this.query = query;
      this.route = route;
      if (this.query) {
        this.params = this.query.split("&").reduce((params, param) => {
          const [key, value] = param.split("=");
          params[key] = value;
          return params;
        }, {});
      }
      break;
    case Server.prepareResponse:
      if (routes[this.route]) return routes[this.route](this);

      if (this.path.startsWith(API)) {
        const [, second] = this.path.split(API);
        const [method] = second.split("?"); // Remove query string

        if (routes[API][method]) return routes[API][method](this);
      }

      return routes["404"](this);
  }
};

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
