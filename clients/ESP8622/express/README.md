# moddable-express

A tiny Express-like HTTP server + router for [Moddable](https://www.moddable.com/) (XS),
written in TypeScript. Built for memory-constrained devices (ESP8266/ESP32): request bodies
are size-capped and discarded if oversized, and static assets are streamed from flash in
small slices instead of being buffered whole.

Moddable has no npm. A library here is just a folder with a `manifest.json`; consumers pull
it in through their own manifest's `include` array. `npm install` in this repo is **dev
tooling only** (TypeScript + types for editor/typecheck) — it is never used at build time.

## Modules

| Import specifier    | What it is                                      |
|---------------------|-------------------------------------------------|
| `express`           | `Express` server class + `ExpressOptions`       |
| `express/router`    | `Router`, `HttpError`, request/response `type`s |
| `express/assertion` | generic payload assertions + type guards        |
| `express/extension` | MIME / file-extension helper                    |
| `express/utils`     | `getErrorMessage`, `getErrorStatus`             |

## Quick start

```ts
import { Express } from "express";
import { Router } from "express/router";
import { assertNumber, assertObject } from "express/assertion";

const switches = new Router("/switches")
  .get((ctx) => ctx.apiSend(200, { pins: [] }))            // GET  /api/switches
  .post((ctx) => {                                          // POST /api/switches
    assertObject(ctx.body, "Body required");
    assertNumber(ctx.body.pin, "pin must be a number");
    return ctx.apiSend(201, { pin: ctx.body.pin });
  });

const server = new Express(80, {
  apiPrefix: "/api",
  isProduction: false,
  spaRoutes: ["/dashboard", "/settings"],
});

server.route(switches);
server.start();
```

## `ExpressOptions`

| Option         | Default | Purpose                                                                                   |
|----------------|---------|-------------------------------------------------------------------------------------------|
| `apiPrefix`    | `/api`  | Prepended to every router path.                                                           |
| `isProduction` | `false` | When `true`, emit `Cache-Control: public, max-age=31536000` on streamed static files.     |
| `jsonBody`     | `true`  | Parse the body as JSON into `ctx.body`. When `false`, only `ctx.rawBody` is set.          |
| `queryParams`  | `true`  | Parse the query string into `ctx.params`. When `false`, `ctx.params` is `{}`.             |
| `spaRoutes`    | `[]`    | Client-side routes that should serve `index.html` instead of 404 (the SPA shell).         |
| `maxBodySize`  | `2048`  | Max request body in bytes. Larger bodies are discarded as they arrive and answered `413`. |
| `maxChunkSize` | `512`   | RAM slice per fragment when streaming a flash resource.                                   |

## Routing

`server.route(router)` mounts a router; every path is prefixed with `apiPrefix`. Each verb
method accepts either a handler (the router's namespace) or a `path` + handler (a sub-route).

```ts
const users = new Router("/users")
  .get((ctx) => ctx.apiSend(200, {}))          // GET    /api/users
  .post((ctx) => ctx.apiSend(201, ctx.body))   // POST   /api/users
  .get("/active", (ctx) => ctx.apiSend(200, {}))   // GET   /api/users/active
  .delete((ctx) => ctx.apiSend(204));          // DELETE /api/users
```

> **No dynamic path params.** Routes match exactly (namespace, or namespace + one action
> segment). Use the query string (`/users?id=3` → `ctx.intParam("id")`) or a JSON body.

<details>
<summary>Query params &amp; <code>ctx.intParam</code></summary>

```ts
// GET /api/switches?pin=3&label=lamp
const switches = new Router("/switches").get((ctx) => {
  const pin = ctx.intParam("pin");        // 3   (throws → 400 if missing/NaN)
  const label = ctx.params.label;         // "lamp"  (always a string, or undefined)
  const note = ctx.intParam("note", "note is required"); // custom 400 message
  return ctx.apiSend(200, { pin, label });
});
```

`ctx.params` is the parsed query (`Record<string, string>`); everything in it is a string.
`ctx.intParam(key, message?)` parses one as an integer and throws (→ 400) on missing/NaN.
With `queryParams: false`, `ctx.params` is `{}` and `intParam` will always throw.
</details>

## Responses

```ts
ctx.apiSend(200, { ok: true });                       // JSON body + status
ctx.apiSend(204);                                     // status only, no body
ctx.apiSend(201, { id }, { Location: "/api/x/1" });   // extra headers
ctx.apiError(404, "Not found");                       // JSON { "message": "Not found" }
```

<details>
<summary>Returning a raw <code>Response</code> (without <code>apiSend</code>/<code>apiError</code>)</summary>

`apiSend`/`apiError` only build a `Response` object — a handler can return anything that
satisfies the `Response` type directly. Useful for non-JSON payloads or when you want full
control over headers.

```ts
// equivalent to ctx.apiSend(200, { ok: true })
const json = (ctx) => ({
  status: 200,
  headers: ["Content-type", "application/json"],
  body: JSON.stringify({ ok: true }),
});

// plain text — body is just a string
const text = (ctx) => ({
  status: 200,
  headers: ["Content-type", "text/plain"],
  body: "OK",
});

// the whole Response is optional — every field defaults
const minimal = (ctx) => ({ status: 204 });   // no headers, no body
const bare = (ctx) => ({ body: "pong" });      // body only (status defaults to 200)
```

`Response` is `{ status?, headers?, body? }`, where `body` is a string (or `true` to stream a
flash resource in fragments). So the minimal valid handler return is `{}`.
</details>

## Plugins

A plugin is `(ctx) => void`. It runs **before** the route handler with full access to `ctx`
(headers, params, body). **Return nothing to continue; throw to reject** — the request stops
and the thrown error becomes the response. `HttpError` carries its status; any other error
maps to `400`.

```ts
import { HttpError } from "express/router";

// Global: runs on every request unless a matched router overrides it.
server.use((ctx) => {
  if (ctx.headers["authorization"] !== TOKEN) throw new HttpError(401, "Unauthorized");
});
```

- **`server.use(plugin)`** — global plugins.
- **`router.use(plugin)`** — router-scoped. If a router declares *any* plugins, they run
  **instead of** the global ones for that router's routes (override, not merge). Multiple
  `use()` calls on one router all run.

<details>
<summary>More plugin examples — router override, header extraction, CORS, public paths</summary>

**Router override** — `/admin` uses its own auth; global logging does not apply to it:

```ts
server.use((ctx) => log(`${ctx.method} ${ctx.route}`));   // global

const admin = new Router("/admin")
  .use((ctx) => {                                         // overrides global for /admin
    if (!isAdmin(ctx)) throw new HttpError(403, "Forbidden");
  })
  .use((ctx) => rateLimit(ctx))                           // stacks with the auth plugin
  .get((ctx) => ctx.apiSend(200, {}));

server.route(admin);
```

**Header extraction** — stash a parsed value on `ctx` for the handler (augment `Context`):

```ts
server.use((ctx) => {
  const raw = ctx.headers["x-device-id"];
  if (!raw) throw new HttpError(400, "Missing X-Device-Id");
  (ctx as any).deviceId = raw;     // or declare it on a Context augmentation
});
```

**CORS-ish headers / short-circuit OPTIONS** — a plugin can answer by throwing, or let the
handler add headers via `apiSend`'s third argument:

```ts
const cors = { "Access-Control-Allow-Origin": "*" };
const ping = new Router("/ping").get((ctx) => ctx.apiSend(200, { ok: true }, cors));
```

**Excluding public paths** — global plugins also run for `/`, `spaRoutes`, and static files.
To keep the login page/assets public, return early instead of throwing:

```ts
server.use((ctx) => {
  if (ctx.route === "/" || ctx.route.startsWith("/api/public")) return; // public
  if (!authed(ctx)) throw new HttpError(401, "Unauthorized");
});
```

</details>

## Assertions (`express/assertion`)

Assertions throw a plain `Error` on failure, which the response funnel turns into a `400` —
so handlers never need their own try/catch. Throw `HttpError` if you want another status.

```ts
import { assertObject, assertNumber, assertString, assertArray } from "express/assertion";

const create = (ctx) => {
  assertObject(ctx.body, "Body required");
  assertString(ctx.body.name, "name must be a string");
  assertNumber(ctx.body.pin, "pin must be a number");
  assertArray(ctx.body.tags, "tags must be an array");
  // ctx.body is now narrowed; ctx.body.tags is unknown[]
  return ctx.apiSend(201, {});
};
```

**Type guards** (narrowing booleans): `isDefined`, `isString`, `isNumber`, `isBoolean`,
`isArray`, `isObject`, `hasKey`.
**Assertions** (throw → 400): `assertDefined`, `assertObject`, `assertNumber`, `assertString`,
`assertBoolean`, `assertArray`, `assertLength`, `assertKeys`.

<details>
<summary>More assertion examples — keys, length, arrays, building domain validators</summary>

```ts
import {
  assertObject, assertKeys, assertString, assertLength,
  assertArray, assertNumber, hasKey, isNumber,
} from "express/assertion";

// Required keys (variadic) + per-field checks
const register = (ctx) => {
  assertObject(ctx.body, "Body required");
  assertKeys(ctx.body, "name and pin are required", "name", "pin");
  assertString(ctx.body.name, "name must be a string");
  assertLength(ctx.body.name, 1, 32, "name must be 1–32 chars");
  assertNumber(ctx.body.pin, "pin must be a number");
  return ctx.apiSend(201, {});
};

// hasKey takes an ARRAY of keys (guard, returns boolean)
if (hasKey(ctx.body, ["min", "sec"])) {
  // ctx.body.min / ctx.body.sec exist
}

// Nested / array-of-objects validation — assertArray gets you in, you do the rest
const setSchedule = (ctx) => {
  assertObject(ctx.body, "Body required");
  assertArray(ctx.body.slots, "slots must be an array");
  for (const slot of ctx.body.slots) {
    assertObject(slot, "each slot must be an object");
    assertNumber(slot.hh, "slot.hh must be a number");
    assertNumber(slot.mm, "slot.mm must be a number");
  }
  return ctx.apiSend(200, {});
};
```

> `isObject` (and `assertObject`) treat arrays as **not** objects — use `assertArray` for
> arrays. Build domain-specific validators (time payloads, week schedules, …) in your app on
> top of these primitives.
</details>

## Static files & SPA

- `/` and any path in `spaRoutes` stream `index.html`.
- `/favicon.ico`, `/logo.svg`, `/app.css`, … stream the matching flash resource (only known
  extensions — see `express/extension`).
- Files are memory-mapped from flash and sent in `maxChunkSize` slices, so served size is
  bounded by flash, not free RAM.

## Errors

Anything thrown during the response phase becomes a JSON error `{ "message": ... }`:

| Condition                        | Status            |
|----------------------------------|-------------------|
| `new HttpError(401, "…")` thrown | `401` (its value) |
| `new Error("…")` / assertion     | `400`             |
| oversized body (`maxBodySize`)   | `413`             |
| known path, method not registered| `405` (+ `Allow`) |
| unknown route                    | `404`             |
| unsupported file extension       | `400`             |
| missing static resource          | `404`             |

```ts
import { getErrorMessage, getErrorStatus } from "express/utils";
// getErrorStatus(err, fallback=500) → err.status if HttpError, else fallback
```

## Using it in a project

<details open>
<summary>1. Link the manifest</summary>

Paths in `include` resolve relative to the including manifest. Pick one:

**Vendored / submodule** (pinned, reproducible):

```jsonc
// your-app/manifest.json
{
  "include": [
    "$(MODDABLE)/examples/manifest_base.json",
    "$(MODDABLE)/examples/manifest_net.json",   // provides the `http` server module
    "../express/manifest.json"                  // <-- this library
  ],
  "preload": [
    "express", "express/router", "express/assertion",
    "express/extension", "express/utils"
  ]
}
```

**Env-var path** (clone once, reuse everywhere — how Moddable references its own libs):

```sh
export EXPRESS=~/moddable-libs/express
```

```jsonc
{ "include": ["$(EXPRESS)/manifest.json"] }
```

> This library does **not** declare the Moddable `http` server module itself (to avoid
> double-defining it). Your app already provides it via `manifest_net.json` or by globbing
> `$(MODULES)/network/http/*` — make sure one of those is present.
</details>

<details>
<summary>2. Point TypeScript at the source</summary>

The manifest handles the build; `tsc`/your editor need a parallel `paths` entry. Both this
library and the consumer need `@moddable/typings` for the ambient `http` / `Resource` globals.

```jsonc
// your-app/tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "express": ["../express/src/express.ts"],
      "express/*": ["../express/src/*"]
    }
  },
  "include": [
    "src/**/*",
    "../express/src/**/*",
    "node_modules/@moddable/typings/**/*.d.ts"
  ]
}
```

</details>

## Development

```sh
npm install        # dev tooling only (tsc, types, prettier)
npm run typecheck
```

## Limitations (how it differs from Express.js)

This is an Express-*like* shape for a microcontroller, not a port. The name and the
`Router`/`use`/verb-method feel are familiar, but the model is intentionally much smaller.

**Routing**

- **No dynamic path params** (`/users/:id`), wildcards, or regex routes. Matching is exact:
  a router namespace, or namespace + **one** action segment (`/users`, `/users/active`). Use
  the query string (`/users?id=3` → `ctx.intParam("id")`) or a JSON body instead.
- **One handler per method+path** — no handler arrays / chained handlers per route.
- **Methods are fixed**: `GET POST PUT PATCH DELETE OPTIONS`. No automatic `HEAD`/`OPTIONS`
  responses — register `OPTIONS` yourself if you need it. A request to a known path with an
  unregistered method gets a `405` with an `Allow` header (not an auto-handler).

**Plugins ≠ Express middleware**

- A plugin is `(ctx) => void` that runs **before** the handler. There is **no `next()`**, no
  `res` object, and **nothing runs after** the handler — you can't wrap, buffer, or rewrite a
  response from a plugin. A plugin either passes (returns) or rejects (throws).
- Router-level plugins **override** the global set for that router (replace, not stack) —
  unlike Express, where middleware always accumulates.

**Request / response**

- **JSON bodies only** (toggle via `jsonBody`). No `urlencoded`, multipart, or streamed
  request bodies; the body is size-capped (`maxBodySize`, default 2 KB) and oversized
  requests get `413`.
- **Simple query parsing**: flat `key=value&…` into `ctx.params` (all strings). No nested or
  array syntax (`a[]=1`, `a.b=2`).
- **Handlers return a value**, they don't write to a response. No `res.write()` streaming for
  dynamic content — streaming exists only for static flash resources (`body: true`).

**Not included** (bring your own, or skip): cookies, sessions, content negotiation, view
engines, sub-app mounting, `app.set`/settings, error-handling middleware, and the npm
middleware ecosystem (CORS, helmet, …) — though small ones are easy to write as plugins.

**What it *does* give you**

Namespaced routers with a prefix · global + router-scoped plugins (auth / validation / header
extraction, reject-by-throw with `HttpError` status) · JSON body + query parsing toggles ·
`ctx.intParam` · generic `assertion` helpers · memory-bounded static-file streaming from
flash · SPA fallback routes · a body-size guard and a single error funnel.
