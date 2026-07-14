import { type HTTPServerCallback, Server, type ServerMessages } from "http";
import Resource from "Resource";
import { Extension, type Extensions } from "express/extension";
import { getErrorMessage, getErrorStatus } from "express/utils";
import {
  type Context,
  type Method,
  type Path,
  type Plugin,
  type Response,
  type ResponseStatus,
  type Routes,
  Router,
} from "./router";

/**
 * Options for the {@link Express} server. All optional — sensible defaults are
 * applied in the constructor. These keep the library decoupled from any host
 * application: things the app used to inject implicitly (production mode, body
 * limits) are now explicit, documented inputs.
 */
export type ExpressOptions = {
  /**
   * Mount point prepended to every router path, e.g. `/api`.
   * @default "/api"
   */
  apiPrefix?: Path;
  /**
   * Emit a long-lived `Cache-Control` header on streamed static resources.
   * Enable in production builds.
   * @default false
   */
  isProduction?: boolean;
  /**
   * Parse the request body as JSON at `requestComplete` and expose it on
   * `ctx.body`. When `false`, `ctx.body` is `null` and only `ctx.rawBody` is
   * populated. The raw string is buffered (subject to `maxBodySize`) either way.
   * @default true
   */
  jsonBody?: boolean;
  /**
   * Parse the query string at `status` and expose it on `ctx.params`. When
   * `false`, `ctx.params` is `{}` (and `ctx.intParam` will throw).
   * @default true
   */
  queryParams?: boolean;
  /**
   * Client-side router paths that should serve `index.html` instead of 404
   * (the SPA shell). Framework-agnostic — list every front-end route here.
   * @default []
   */
  spaRoutes?: Path[];
  /**
   * Largest request body we'll accept, in bytes. Bodies declaring more than
   * this via `Content-Length` are discarded as they arrive (never buffered)
   * and answered with 413. Keep it small for constrained devices.
   * @default 2048
   */
  maxBodySize?: number;
  /**
   * Largest slice (in bytes) copied into RAM per `responseFragment` when
   * streaming a flash resource. The rest stays mapped in flash.
   * @default 512
   */
  maxChunkSize?: number;
};

/**
 * Internal per-path registration: the method handlers plus the plugins that
 * came from the owning router (empty if the router declared none).
 */
type RouteEntry = {
  handlers: Routes[Path];
  plugins: Plugin[];
};

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
   *     handlers: { GET: [Function], POST: [Function] },
   *     plugins: [],
   *   },
   * }
   * @private
   */
  private readonly routes: Record<Path, RouteEntry> = {};
  /** Global plugins, applied unless a matched router overrides them. */
  private readonly plugins: Plugin[] = [];
  private readonly prefix: Path;
  private readonly maxChunkSize: number;
  private readonly maxBodySize: number;
  private readonly spaRoutes: Path[];
  private readonly cache: boolean;
  private readonly jsonBody: boolean;
  private readonly queryParams: boolean;
  private readonly extension: Extension;

  constructor(
    private readonly port: number,
    options: ExpressOptions = {},
  ) {
    this.extension = new Extension();
    this.cache = options.isProduction ?? false;
    this.jsonBody = options.jsonBody ?? true;
    this.queryParams = options.queryParams ?? true;
    this.spaRoutes = options.spaRoutes ?? [];
    this.maxBodySize = options.maxBodySize ?? 2048;
    this.maxChunkSize = options.maxChunkSize ?? 512;

    let prefix: string = options.apiPrefix ?? "/api";
    if (prefix.endsWith("/")) prefix = prefix.substring(0, prefix.length - 1);
    this.prefix = prefix as Path;
  }

  getRoutes() {
    return this.routes;
  }

  /**
   * Mount a router. A single Router can register several paths under its
   * namespace, e.g. `/switches` *and* `/switches/control`. Copy every one of
   * them (prefixed) along with the router's plugins — otherwise sub-action
   * routes are silently dropped and resolve to "Not Found". Chainable.
   */
  route(router: Router) {
    const routes = router.getRoutes();
    const plugins = router.getPlugins();

    for (const path of Object.keys(routes) as Path[]) {
      this.routes[(this.prefix + path) as Path] = {
        handlers: routes[path],
        plugins,
      };
    }

    return this;
  }

  /**
   * Register a global plugin. Runs before the route handler on every request,
   * unless the matched router declares its own plugins (which override these).
   * Throw from a plugin to reject the request. Chainable.
   */
  use(plugin: Plugin) {
    this.plugins.push(plugin);

    return this;
  }

  start() {
    const server = new Server({ port: this.port });

    server.callback = this.callback();

    return server;
  }

  private getQueryParams(query = "") {
    const params: Record<string, string> = {};
    if (!query) return params;

    for (const pair of decodeURIComponent(query)
      .replaceAll("+", " ")
      .split("&")) {
      if (!pair) continue; // skip empty segments (no query, trailing/double "&")

      const [key, value = ""] = pair.split("=");
      if (key) params[key] = value; // ignore stray "=value" with an empty key
    }

    return params;
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
      // `undefined` (not `body`) in the empty case: keeps the type `string |
      // undefined` under non-strict builds too, where the `Record` would
      // otherwise leak into the response `body` type.
      body: body ? JSON.stringify(body) : undefined,
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
      // `??=` (not `||=`) so an explicit `null` from handleRequestBody — an
      // empty body, or `jsonBody: false` — survives into the response phase
      // instead of being silently reset to `{}` on the next callback tick.
      ctx.body ??= null;
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
          return apiError(404, `${ctx.route} Not Found`);
      }
    } as HTTPServerCallback;
  }

  private handleRequestStatus(ctx: Context, value: Path, etc: Method) {
    const [route, query] = value.split("?");
    ctx.path = value;
    ctx.query = query;
    ctx.route = route;
    ctx.method = etc;

    if (!this.queryParams) {
      ctx.params = {};
      return;
    }

    try {
      ctx.params = this.getQueryParams(ctx.query);
    } catch (e) {
      // Returning here is ineffective (this phase's return value is ignored);
      // defer the 400 to the response phase. See `deferredError`.
      ctx.params = {};
      ctx.deferredError = {
        status: 400,
        message: "Invalid query string: " + getErrorMessage(e),
      };
    }
  }

  private handleRequestHeader(ctx: Context, name: string, value: string) {
    // The server emits this once per header; `name` is already lower-cased.
    // Store every header so plugins/handlers can read them (e.g. auth); the
    // Moddable `Request` does not expose a headers map on its own.
    ctx.headers[name] = value;

    // Also capture the declared body size for the size guard below.
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
    // Keep the raw string regardless — plugins may want it (signatures,
    // non-JSON payloads) even when JSON parsing is off.
    ctx.rawBody = body || undefined;

    if (!this.jsonBody) {
      ctx.body = null;

      return;
    }

    try {
      ctx.body = body ? JSON.parse(body) : null;
    } catch (e) {
      // Returning here is ineffective (this phase's return value is ignored);
      // defer the 400 to the response phase. See `deferredError`.
      ctx.body = null;
      ctx.deferredError = {
        status: 400,
        message: "Invalid JSON body: " + getErrorMessage(e),
      };
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

  /**
   * Run a plugin set in order. Plugins reject by throwing; the throw propagates
   * to the single try/catch in `handleResponse` (below), so there's nothing to
   * return — reaching the end means every plugin passed.
   */
  private runPlugins(ctx: Context, plugins: Plugin[]) {
    for (const plugin of plugins) plugin(ctx);
  }

  /**
   * Single funnel for the response phase: any throw from a plugin, a handler,
   * or `ctx.intParam` becomes a JSON error response here. `HttpError` carries
   * its own status (e.g. 401 from an auth plugin); anything else maps to 400.
   * This is why handlers and plugins never need their own try/catch.
   */
  private handleResponse(ctx: Context) {
    try {
      return this.dispatch(ctx);
    } catch (error) {
      return this.apiError(getErrorStatus(error, 400), getErrorMessage(error));
    }
  }

  private dispatch(ctx: Context): Response {
    // Body was refused at headersComplete and discarded; answer 413 now.
    if (ctx.tooLarge) {
      return this.apiError(413, `Body exceeds ${this.maxBodySize} bytes`);
    }

    // A parse failure from an earlier phase (invalid query / JSON) was deferred
    // here because those phases can't return a response. Answer it now.
    if (ctx.deferredError) {
      return this.apiError(ctx.deferredError.status, ctx.deferredError.message);
    }

    // We stream index.html by default when file not specified
    if (!ctx.route || ctx.route === "/" || this.isSpaRoute(ctx)) {
      this.runPlugins(ctx, this.plugins);

      return this.streamResource(ctx, "index.html", "html");
    }

    // Handle api endpoints
    // /{prefix}/{namespace} -> /api/users
    const namespaces = Object.keys(this.routes) as Path[];

    for (const namespace of namespaces) {
      if (ctx.route === namespace) {
        const entry = this.routes[namespace];
        // Router plugins override the global set; fall back to global otherwise.
        const plugins = entry.plugins.length ? entry.plugins : this.plugins;

        this.runPlugins(ctx, plugins);

        // The path exists but may not implement this method. Answer 405 with an
        // `Allow` header rather than calling `undefined` (which would surface as
        // an opaque 400 "…is not a function").
        const handler = entry.handlers[ctx.method];
        if (!handler) {
          return {
            status: 405,
            headers: [
              "Content-type",
              "application/json",
              "Allow",
              Object.keys(entry.handlers).join(", "),
            ],
            body: JSON.stringify({
              message: `Method ${ctx.method} not allowed for ${ctx.route}`,
            }),
          };
        }

        // Exact match, `/api/users`. A throw past here (plugin reject, domain
        // validation in a controller, bad intParam) is caught by handleResponse.
        return handler(ctx);
      }
    }

    // Handle manually specified files, e.g. /favicon.ico, /logo.svg, /data.json
    const [filename, type] = ctx.route.split(".", 2);
    if (filename && type) {
      if (!this.extension.isValid(type)) {
        return this.apiError(400, "Unsupported file type");
      }

      this.runPlugins(ctx, this.plugins);

      return this.streamResource(ctx, ctx.route, type);
    }

    // Path is not a known route, SPA route, or servable file — genuinely absent.
    return this.apiError(404, "Not Found");
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

      if (this.cache) {
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

  private isSpaRoute(ctx: Context) {
    for (const route of this.spaRoutes) {
      if (ctx.route === route) return true;
    }

    return false;
  }
}
