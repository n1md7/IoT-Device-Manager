import Timer from "timer";
import { ConsoleLogger } from "./logger";
import { Server } from "http";

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
  return query.split("&").reduce((params, param) => {
    const [key, value] = param.split("=");
    params[key] = value;
    return params;
  }, {});
};

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
  return function (message, value) {
    switch (message) {
      case Server.status:
        const [route, query] = value.split("?");
        this.path = value;
        this.query = query;
        this.route = route;
        this.params = getQueryParams(this.query);
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
