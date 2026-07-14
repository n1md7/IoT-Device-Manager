import type { Request } from "http";
import Resource from "Resource";
import { isDefined, isString } from "express/assertion";

export type Path = `/${string}`;
// `Resource` is exported as a value (a constructor) by Moddable's own typings,
// so it can't be used as a type directly. `InstanceType<typeof Resource>` names
// the instance type and works under both Moddable's typings and @moddable/typings.
export type Stream = {
  resource: InstanceType<typeof Resource>;
  position: number;
};
export type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS";
export type HeaderKey =
  | "Content-Type"
  | "Accept"
  | "Authorization"
  | "Content-Length";
export type RequestHeaders = Record<string, string>;
export type ResponseHeaders = (HeaderKey | string)[];
export type ResponseStatus =
  | 200
  | 201
  | 202
  | 204
  | 400
  | 401
  | 403
  | 404
  | 405
  | 413
  | 500;
export type ResponseBody = string;
export type RequestBody = Record<string, any>;

export type Context = Request & {
  headers: RequestHeaders;

  /**
   * JSON parsed request body
   * @example `{acton: "ON"}`
   */
  body: RequestBody | null;
  /**
   * @example `/api/schedules?min=1&sec=10`
   */
  path: Path;

  /**
   * It is a raw query string part, use `params` for parsed data
   * @example `min=1&sec=10`
   */
  query: string;

  /**
   * @example `/api/schedules`
   */
  route: string;

  /**
   * HTTP method
   * @example GET, POST, etc
   */
  method: Method;

  /**
   * Parsed query string params
   * @example `{ min: "1", sec: "10" }`
   * @note Everything is string in query string, number will require to convert
   */
  params: Record<string, string>;

  /**
   * Static file streaming to save memory
   */
  stream?: Stream;

  /**
   * Declared request body size, captured from the `Content-Length` header
   * during the header phase.
   */
  contentLength?: number;

  /**
   * Set when `contentLength` exceeds the server's body limit. The body is
   * discarded as it arrives and the request is answered with a 413.
   */
  tooLarge?: boolean;

  /**
   * The unparsed request body string, kept regardless of `jsonBody`. Useful
   * for plugins doing signature checks or non-JSON payloads.
   */
  rawBody?: string;

  /**
   * A request-phase failure (invalid query string, invalid JSON body) deferred
   * to the response phase. The Moddable server ignores return values from the
   * `status`/`requestComplete` phases, so the error is stashed here and answered
   * in `dispatch` — the same deferral pattern as `tooLarge`.
   */
  deferredError?: { status: ResponseStatus; message: string };

  /**
   * Parse a query-string param as an integer.
   * Throws (turned into a 400 by the central handler) when missing or NaN.
   * @example `ctx.intParam("pin")` for `/switches?pin=3`
   */
  intParam(key: string, message?: string): number;

  /**
   * Response JSON
   */
  apiError(status: ResponseStatus, message: string): Response;
  apiSend(
    status: ResponseStatus,
    body?: Record<string, any>,
    extraHeaders?: Record<string, string>,
  ): Response;
};

export type Response = {
  headers?: ResponseHeaders;
  status?: ResponseStatus;
  /**
   * The response body string, or `true` to put the Moddable server into
   * fragment mode — it then pulls the body via repeated `responseFragment`
   * callbacks (used for streaming flash resources).
   */
  body?: ResponseBody | boolean;
};

export type Handler = (ctx: Context) => Response;
export type Routes = Record<Path, Record<Method, Handler>>;

/**
 * A plugin runs before the matched route handler with full access to `ctx`
 * (headers, params, body). Return nothing to continue; **throw to reject** —
 * the request stops and the thrown error becomes the response. Use for auth,
 * header extraction, request validation, etc.
 *
 * @example
 * const auth: Plugin = (ctx) => {
 *   if (ctx.headers["authorization"] !== TOKEN)
 *     throw new HttpError(401, "Unauthorized");
 * };
 */
export type Plugin = (ctx: Context) => void;

/**
 * Throw from a plugin or handler to stop the request with a chosen status.
 * The central handler turns it into a JSON error response. A plain `Error`
 * maps to `400`; `HttpError` lets you pick `401`, `403`, etc.
 */
export class HttpError extends Error {
  constructor(
    readonly status: ResponseStatus,
    message: string,
  ) {
    super(message);
  }
}

export class Router {
  private readonly routes: Routes = {};
  private readonly plugins: Plugin[] = [];

  constructor(private readonly namespace: Path) {}

  getRoutes() {
    return this.routes;
  }

  /**
   * Register a plugin scoped to this router. When a request matches one of this
   * router's routes, these run *instead of* the Express-level plugins (override,
   * not merge). Chainable.
   */
  use(plugin: Plugin) {
    this.plugins.push(plugin);

    return this;
  }

  getPlugins() {
    return this.plugins;
  }

  /**
   * Give current namespace e.g. `/users`.
   * When prefix is provided it will be e.g. `{prefix}/users`
   */
  getNamespace(withPrefix?: Path) {
    return ((withPrefix || "") + this.namespace) as Path;
  }

  get(fn: Handler): this;
  get(path: Path, fn: Handler): this;
  get(pathOrFn: Handler | Path, fn?: Handler) {
    if (this.isPath(pathOrFn)) {
      if (isDefined(fn)) this.addRoute("GET", fn, pathOrFn); // With action /users/create
    } else this.addRoute("GET", pathOrFn); // Just namespace e.g. /users

    return this;
  }

  post(fn: Handler): this;
  post(path: Path, fn: Handler): this;
  post(pathOrFn: Handler | Path, fn?: Handler) {
    if (this.isPath(pathOrFn)) {
      if (isDefined(fn)) this.addRoute("POST", fn, pathOrFn);
    } else this.addRoute("POST", pathOrFn);

    return this;
  }

  patch(fn: Handler): this;
  patch(path: Path, fn: Handler): this;
  patch(pathOrFn: Handler | Path, fn?: Handler) {
    if (this.isPath(pathOrFn)) {
      if (isDefined(fn)) this.addRoute("PATCH", fn, pathOrFn);
    } else this.addRoute("PATCH", pathOrFn);

    return this;
  }

  put(fn: Handler): this;
  put(path: Path, fn: Handler): this;
  put(pathOrFn: Handler | Path, fn?: Handler) {
    if (this.isPath(pathOrFn)) {
      if (isDefined(fn)) this.addRoute("PUT", fn, pathOrFn);
    } else this.addRoute("PUT", pathOrFn);

    return this;
  }

  delete(fn: Handler): this;
  delete(path: Path, fn: Handler): this;
  delete(pathOrFn: Handler | Path, fn?: Handler) {
    if (this.isPath(pathOrFn)) {
      if (isDefined(fn)) this.addRoute("DELETE", fn, pathOrFn);
    } else this.addRoute("DELETE", pathOrFn);

    return this;
  }

  options(fn: Handler): this;
  options(path: Path, fn: Handler): this;
  options(pathOrFn: Handler | Path, fn?: Handler) {
    if (this.isPath(pathOrFn)) {
      if (isDefined(fn)) this.addRoute("OPTIONS", fn, pathOrFn);
    } else this.addRoute("OPTIONS", pathOrFn);

    return this;
  }

  /**
   * Supports single namespace and with action route.
   *
   * @note Limitations: No dynamic URL support or URL params.
   * Use query string instead or request body as JSON payload.
   */
  private addRoute(method: Method, handler: Handler, path?: Path) {
    path = (this.namespace + (path || "")) as Path;

    if (path.endsWith("/")) {
      path = path.substring(0, path.length - 1) as Path;
    }

    if (!this.routes[path]) this.routes[path] = {} as Record<Method, Handler>;

    this.routes[path][method] = handler;
  }

  private isPath(value: Handler | Path): value is Path {
    return isString(value) && value.startsWith("/");
  }
}
