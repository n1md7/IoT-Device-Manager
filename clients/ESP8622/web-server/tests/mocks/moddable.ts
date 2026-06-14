/**
 * Stubs for Moddable / XS platform built-in modules so the source can be
 * imported and unit-tested under Node + Vitest. These are aliased in
 * vitest.config.ts. They are intentionally minimal: enough to import without
 * throwing. Tests that need real behavior should vi.mock the specific module.
 */

// preference
const store = new Map<string, unknown>();
const key = (domain: string, name: string) => `${domain}::${name}`;
export const Preference = {
  get: (domain: string, name: string) => store.get(key(domain, name)),
  set: (domain: string, name: string, value: unknown) =>
    store.set(key(domain, name), value),
  delete: (domain: string, name: string) => store.delete(key(domain, name)),
  keys: (domain: string) => {
    return [...store.keys()]
      .filter((k) => k.startsWith(`${domain}::`))
      .map((k) => k.slice(domain.length + 2));
  },
};

// timer
export class Timer {
  static set(_cb: () => void, _interval?: number, _repeat?: number) {
    return 0;
  }
  static repeat(_cb: () => void, _interval: number) {
    return 0;
  }
  static clear(_id: number) {}
  static delay(_ms: number) {}
}

// pins/digital
export class Digital {
  static Input = 0;
  static Output = 8;
  constructor(_pin?: number, _mode?: number) {}

  static read(_pin: number) {
    return 0;
  }

  static write(_pin: number, _value: number) {}

  read() {
    return 0;
  }

  write(_value: number) {}
}

// net
export const Net = {
  get: (_property: string) => undefined,
  resolve: (_host: string, _cb: (host: string, address: string) => void) => {},
};

// http
export class Request {
  constructor(_dictionary?: unknown) {}
  read() {
    return undefined;
  }
  close() {}
}
export class Server {
  constructor(_dictionary?: unknown) {}
  close() {}
}

// file
export const System = {
  config: () => ({}),
  info: (_path?: string) => ({}),
};

// mdns
export class MDNS {
  constructor(_dictionary?: unknown, _cb?: unknown) {}
}

// sntp
export class SNTP {
  constructor(_dictionary?: unknown, _cb?: unknown) {}
}

// time
export const Time = {
  get set(): never {
    throw new Error("not implemented in stub");
  },
  get: () => 0,
  ticks: () => 0,
  set timezone(_value: number) {},
  get timezone() {
    return 0;
  },
};

// Resource
export class Resource {
  constructor(_path?: string) {}
  slice(_begin?: number, _end?: number) {
    return new ArrayBuffer(0);
  }
}

// mc/config
export const config = {};
