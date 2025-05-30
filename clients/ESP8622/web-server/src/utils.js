import Timer from "timer";
import SNTP from "sntp";
import Time from "time";
import { ConsoleLogger } from "./logger";
import { Server } from "http";
import { Iterator } from "file";
import Resource from "Resource";
import config from "mc/config";

export const every = (value) => (current) => current % value === 0;
export const setInterval = (callback, delay) => Timer.repeat(callback, delay);
export const clearInterval = (timer) => Timer.clear(timer);
export const toSeconds = (min, sec) => min * 60 + +sec;

export const console = new ConsoleLogger();

export const HIGH = 1;
export const LOW = 0;
export const API = "/api";

/**
 * @typedef {'json' | 'html' | 'text' | 'css' | 'js' | 'ico' | 'png' | 'jpg'} ContentType
 */

/**
 * @type {Object.<ContentType, string>}
 */
const contentType = {
  json: "application/json",
  html: "text/html",
  text: "text/plain",
  css: "text/css",
  js: "application/javascript",
  ico: "image/x-icon",
  png: "image/png",
  jpg: "image/jpeg",
};
const extensions = Object.keys(contentType);

/**
 * @typedef {Object} ResourceOptions
 * @property {string} path - Path to the resource file
 * @property {ContentType} [type] - Resource content type
 * @property {[string, string][]} [headers] - Additional headers
 */

/**
 * @param {ResourceOptions} options
 * @returns {function(): {headers, body: module:Resource.Resource}}
 */
export const staticResource = (options) => () => {
  options.headers ||= [];

  if (options.type) {
    options.headers.push(
      "Content-type",
      contentType[options.type] || "text/plain",
    );
  }

  if (options.type !== "html") {
    options.headers.push("Cache-Control", "public, max-age=31536000");
  }

  return {
    headers: options.headers,
    body: new Resource(options.path),
  };
};

/**
 * @param {Object} data
 * @param {number} [status]
 * @returns {{headers: string[], body: string}}
 */
export const jsonResponse = (data, status = 200) => ({
  headers: ["Content-type", "application/json"],
  body: JSON.stringify(data),
  status,
});

export const plainResponse = (data, status = 200) => ({
  headers: ["Content-type", "text/plain"],
  body: data,
  status,
});

export const apiError = (message, status = 400) => ({
  headers: ["Content-type", "application/json"],
  body: JSON.stringify({ message }),
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

/**
 * @description Custom parser for key-value pais concatenated by '='
 * @param headerValue
 * @returns {{}}
 * @example a=1;c='d';my-var=123
 */
export const getBodyVars = (headerValue = "") => {
  return headerValue.split(";").reduce((acc, item) => {
    const [key, value] = item.split("=");

    acc[key] = value;

    return acc;
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
      case Server.status: {
        const [route, query] = value.split("?");
        this.path = value;
        this.query = query;
        this.route = route;
        this.method = etc;
        this.is = methodType(etc);
        this.params = getQueryParams(this.query);
        break;
      }
      case Server.header: {
        this.headers[value] = etc;
        if (value.toLowerCase() === "x-body-vars") {
          this.body = getBodyVars(etc);
        }
        break;
      }
      case Server.prepareResponse: {
        if (routes[this.route]) return routes[this.route](this);

        if (this.path.startsWith(API)) {
          const [, second] = this.path.split(API);
          const [method] = second.split("?"); // Remove query string

          if (routes[API][method]) return routes[API][method](this);
        }

        const [path] = this.path.split("?"); // Remove query string
        const type = path.split(".").pop();
        if (extensions.includes(type)) {
          // Remove leading slash
          const name = path.substring(1, path.length);
          return staticResource({ path: name, type })();
        }

        return routes["404"](this);
      }
    }
  };
};

export class DiskInformation {
  static output(path = config.file.root) {
    for (const item of new Iterator(path)) {
      if (item.length) {
        console.log(
          `Existing file on disk: ${item.name}, ${item.length} bytes`,
        );
      }
    }
  }
}

export class SystemTime {
  static #hosts = [
    "3.pool.ntp.org",
    "2.pool.ntp.org",
    "1.pool.ntp.org",
    "0.pool.ntp.org",
  ];

  static adjust() {
    new SNTP({ host: this.#hosts.pop() }, (message, value) => {
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
          if (this.#hosts.length) SystemTime.adjust();
          break;
      }
    });
  }
}
