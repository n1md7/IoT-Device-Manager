import Timer from "timer";
import SNTP from "sntp";
import Time from "time";
import { ConsoleLogger } from "./logger";
import { Server } from "http";
import { Iterator } from "file";

export const every = (value) => (current) => current % value === 0;
export const setInterval = (callback, delay) => Timer.repeat(callback, delay);
export const clearInterval = (timer) => Timer.clear(timer);
export const toSeconds = (min, sec) => min * 60 + +sec;

export const console = new ConsoleLogger();

export const HIGH = 1;
export const LOW = 0;
export const API = "/api";

export const apiError = (message, status = 400) => ({
  headers: ["Content-type", "application/json"],
  body: `{"message": "${message}"}`,
  status,
});

export const getQueryParams = (query = "") => {
  return decodeURIComponent(query)
    .replaceAll("+", " ")
    .split("&")
    .reduce((params, param) => {
      const [key, value] = param.split("=");
      params[key] = value;
      return params;
    }, {});
};

const methodType = (method = "") => ({
  get: method === "GET",
  post: method === "POST",
  put: method === "PUT",
  delete: method === "DELETE",
  patch: method === "PATCH",
  options: method === "OPTIONS",
});

/**
 * @typedef {Object} Context - Client request context
 * @property {string} path - Client request path. For example: `/api/on?min=1&sec=10`
 * @property {string} query - Client request query. For example: `min=1&sec=10`
 * @property {string} route - Client request route. For example: `/api/on`
 * @property {Object.<string, string>} params - Parsed client request query parameters. For example: `{ min: "1", sec: "10" }`
 */

/**
 * @callback RouteHandler
 * @param {Context} ctx - The client request context
 * @returns {Object} - The response object
 */

/**
 * @typedef {Object.<string, RouteHandler|Routes>} Routes - Server routes
 */

/**
 * @param {Routes} routes - Server routes
 * @returns {(function(*, *): (*))|*}
 */
export const requestHandler = (routes = {}) => {
  return function (message, value, etc) {
    this.headers ||= {};
    this.body ||= {};

    switch (message) {
      case Server.status:
        const [route, query] = value.split("?");
        this.path = value;
        this.query = query;
        this.route = route;
        this.method = etc;
        this.is = methodType(etc);
        this.params = getQueryParams(this.query);
        break;
      case Server.header:
        this.headers[value] = etc;
        if (value === "x-body-json") {
          try {
            this.body = JSON.parse(etc);
          } catch (error) {
            return apiError(`Unable to parse JSON body: "etc"`, 400);
          }
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
};

export const logDiskInformation = (path) => {
  for (const item of new Iterator(path)) {
    if (item.length) {
      console.log(`Existing file on disk: ${item.name}, ${item.length} bytes`);
    }
  }
};

const hosts = [
  "3.pool.ntp.org",
  "2.pool.ntp.org",
  "1.pool.ntp.org",
  "0.pool.ntp.org",
];

export const setSystemTimeFromNetwork = () =>
  new SNTP({ host: hosts.pop() }, (message, value) => {
    switch (message) {
      case SNTP.time:
        console.log("[SNTP] Received time from net", value);
        Time.set(value);
        break;

      case SNTP.retry:
        console.log("[SNTP] Retrying...");
        break;

      case SNTP.error:
        console.log("[SNTP] Failed: ", value);
        if (hosts.length) setSystemTime();
        break;
    }
  });
