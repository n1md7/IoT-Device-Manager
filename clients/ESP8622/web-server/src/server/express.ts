import { type HTTPServerCallback, Server, type ServerMessages } from "http";
import { Extension, type Extensions } from "services/extension";
import { hostName } from "services/mdns";
import { getErrorMessage } from "utils/http";
import { env } from "utils/env";
import Resource from "Resource";
import Net from "net";
import {
  type Context,
  type Method,
  type Path,
  type Response,
  type ResponseStatus,
  type Routes,
  Router,
} from "./router";

/**
 * Attached to each `ctx` so handlers can read numeric query params via
 * `ctx.intParam("pin")`. Bound to the request through `this`, not the Express
 * instance — it needs the per-request `params`. Throws on missing/NaN, which
 * the central handler in `handleResponse` turns into a 400.
 */
function intParam(this: Context, key: string, message?: string): number {
  const raw = this.params[key];
  const value = raw ? parseInt(raw, 10) : NaN;

  if (isNaN(value)) throw new Error(message ?? `Invalid ${key} query`);

  return value;
}

export class Express {
  /**
   * @example {
   *   "/api/schedules": {
   *     "GET": [Function],
   *     "POST": [Function],
   *     "DELETE": [Function],
   *   },
   *   "/api/schedules/control": {
   *     "POST": [Function],
   *   },
   * }
   * @private
   */
  private readonly routes: Routes;
  private readonly maxChunkSize = 512;
  /**
   * Largest request body we'll accept, in bytes. Bodies declaring more than
   * this via `Content-Length` are discarded as they arrive (never buffered)
   * and answered with 413. Keep it small — this device only takes tiny control
   * payloads like `{ digitalPin, control, action, stopAt }`.
   */
  private readonly maxBodySize = 2048;
  private readonly extension: Extension;

  constructor(
    private readonly prefix: Path,
    private readonly port: number,
  ) {
    this.routes = {};
    this.extension = new Extension();

    if (prefix.endsWith("/")) {
      this.prefix = prefix.substring(0, prefix.length - 1) as Path;
    }
  }

  getRoutes() {
    return this.routes;
  }

  use(router: Router) {
    this.routes[router.getNamespace(this.prefix)] =
      router.getRoutes()[router.getNamespace()];

    return this;
  }

  start() {
    const server = new Server({ port: this.port });

    server.callback = this.callback();

    return server;
  }

  private getQueryParams(query = "") {
    return decodeURIComponent(query)
      .replaceAll("+", " ")
      .split("&")
      .reduce(
        (params, param) => {
          const [key, value] = param.split("=");
          params[key] = value;
          return params;
        },
        {} as Record<string, string>,
      );
  }

  private apiError(status: ResponseStatus, message: string): Response {
    return {
      headers: ["Content-type", "application/json"],
      body: JSON.stringify({ message }),
      status,
    };
  }

  private apiSend(
    status: ResponseStatus,
    body?: Record<string, any>,
    extraHeaders?: Record<string, string>,
  ): Response {
    const headers = ["Content-type", "application/json"];

    Object.entries(extraHeaders || {}).forEach(([key, value]) => {
      headers.push(key);
      headers.push(value);
    });

    return {
      headers,
      body: body ? JSON.stringify(body) : body,
      status,
    };
  }

  private callback() {
    const handleRequestStatus = this.handleRequestStatus.bind(this);
    const handleRequestHeader = this.handleRequestHeader.bind(this);
    const handleHeadersComplete = this.handleHeadersComplete.bind(this);
    const handleRequestBody = this.handleRequestBody.bind(this);
    const handleResponseFragment = this.handleResponseFragment.bind(this);
    const handleResponseComplete = this.handleResponseComplete.bind(this);
    const handleResponse = this.handleResponse.bind(this);
    const apiError = this.apiError.bind(this);
    const apiSend = this.apiSend.bind(this);

    /**
     * The Moddable HTTP server calls this once per protocol phase, binding the
     * connection to `this`. `this: Context` is intentional TS feature, not extra param.
     * In JavaScript, it is omitted
     */
    return function (
      this: Context,
      message: ServerMessages,
      value?: any,
      etc?: any,
    ) {
      const ctx = this;

      ctx.headers ||= {};
      ctx.body ||= {};
      ctx.apiError = apiError;
      ctx.apiSend = apiSend;
      ctx.intParam = intParam;

      switch (message) {
        case Server.status:
          return handleRequestStatus(ctx, value, etc);
        case Server.header:
          return handleRequestHeader(ctx, value, etc);
        case Server.headersComplete:
          return handleHeadersComplete(ctx);
        case Server.requestComplete:
          return handleRequestBody(ctx, value);
        case Server.responseFragment:
          return handleResponseFragment(ctx, value);
        case Server.responseComplete:
          return handleResponseComplete(ctx);
        case Server.prepareResponse:
          return handleResponse(ctx);
        case Server.error:
          return apiError(500, "Internal Server Error");
        default:
          return apiError(404, "Not Found");
      }
    } as HTTPServerCallback;
  }

  private handleRequestStatus(ctx: Context, value: Path, etc: Method) {
    const [route, query] = value.split("?");
    ctx.path = value;
    ctx.query = query;
    ctx.route = route;
    ctx.method = etc;
    try {
      ctx.params = this.getQueryParams(ctx.query);
    } catch (e) {
      return this.apiError(400, "Invalid query string");
    }
  }

  private handleRequestHeader(ctx: Context, name: string, value: string) {
    // The server emits this once per header; `name` is already lower-cased.
    // We only care about the declared body size for the guard below.
    if (name === "content-length") {
      ctx.contentLength = parseInt(value, 10) || 0;
    }
  }

  private handleHeadersComplete(ctx: Context) {
    // The server uses our return value as the body's output type. If the
    // declared body is larger than we're willing to buffer, return `false`:
    // that makes the server DISCARD the body as it streams in (via internal
    // `socket.read(null, …)`) instead of allocating it in RAM. We flag the
    // request so `handleResponse` can answer 413 once the body is drained.
    if ((ctx.contentLength ?? 0) > this.maxBodySize) {
      ctx.tooLarge = true;
      return false;
    }

    // Otherwise: collect the whole body and deliver it as one string at
    // `requestComplete`, where `handleRequestBody` runs JSON.parse. Without a
    // return here the body phase would abort with "unsupported output type".
    return String;
  }

  private handleRequestBody(ctx: Context, body: string) {
    try {
      ctx.body = body ? JSON.parse(body) : null;
    } catch (e) {
      return this.apiError(400, "Invalid JSON body");
    }
  }

  private handleResponseFragment(ctx: Context, bytes: number) {
    // Server is asking for the next slice of a streamed body (body: true).
    // `bytes` is how many bytes it can take right now.
    const stream = ctx.stream;

    if (!stream) return undefined;

    const { resource, position } = stream;
    const remaining = resource.byteLength - position;

    if (remaining <= 0) {
      ctx.stream = undefined;

      return undefined; // end of body
    }

    // Slice only a small chunk into RAM; the rest stays mapped in flash.
    const count = Math.min(bytes, remaining, this.maxChunkSize);
    stream.position = position + count;

    return resource.slice(position, position + count);
  }

  private handleResponseComplete(ctx: Context) {
    // Drop the cursor once the body is fully sent (or the connection ends).
    ctx.stream = undefined;
  }

  private handleResponse(ctx: Context) {
    // Body was refused at headersComplete and discarded; answer 413 now.
    if (ctx.tooLarge) {
      return this.apiError(413, `Body exceeds ${this.maxBodySize} bytes`);
    }

    // We stream index.html by default when file not specified
    if (!ctx.route || ctx.route === "/") {
      return this.streamResource(ctx, "index.html", "html");
    }

    // Handle api endpoints
    // /{prefix}/{namespace} -> /api/users
    const namespaces = Object.keys(this.routes) as Path[];

    for (const namespace of namespaces) {
      if (ctx.route === namespace) {
        // Exact match, `/api/users`. Handlers validate the request shape and
        // return early on bad input; any error thrown past that (e.g. domain
        // validation in a controller) is turned into a 400 here so individual
        // handlers don't each need their own try/catch.
        try {
          return this.routes[namespace][ctx.method](ctx);
        } catch (error) {
          return this.apiError(400, getErrorMessage(error));
        }
      }
    }

    // Handle manually specified files, e.g. /favicon.ico, /logo.svg, /data.json
    const [filename, type] = ctx.route.split(".", 2);
    if (filename && type) {
      if (!this.extension.isValid(type)) {
        return this.apiError(400, "Unsupported file type");
      }

      return this.streamResource(ctx, ctx.route, type);
    }

    return this.apiError(400, "Not Found");
  }

  /**
   * Serves a flash resource but hands it to the HTTP server in small
   * slices instead of one big body. Returning `body: true` puts the server into
   * fragment mode: it then pulls the body via repeated `responseFragment`
   * callbacks (handled in `requestHandler`). `Resource` is memory-mapped from
   * flash (zero-copy), and each fragment only slices a small chunk into RAM — so
   * the served size is bounded by flash, not by free contiguous RAM. This is what
   * lifts the ~2.75 KB whole-body limit; no zipping needed.
   */
  private streamResource(ctx: Context, path: string, type: Extensions) {
    if (path.startsWith("/")) path = path.substring(1, path.length); // Remove leading slash

    try {
      const resource = new Resource(path); // flash-mapped, read-only
      const headers: string[] = [];

      headers.push("Content-Length", String(resource.byteLength)); // total size up front
      headers.push("Content-type", this.extension.getContentTypeBy(type));

      if (env.is.production) {
        headers.push("Cache-Control", "public, max-age=31536000");
      }

      // Per-connection cursor, picked up by the responseFragment handler below.
      ctx.stream = { resource, position: 0 };

      return {
        headers,
        body: true,
      };
    } catch (error) {
      return this.apiError(
        404,
        `Resource not found: ${getErrorMessage(error)}`,
      );
    }
  }
}
