/**
 * Central resolver for the IoT device (microcontroller) base URL.
 *
 * Resolution order:
 *   1. A custom address the user saved from the UI (localStorage)
 *   2. The IOT_DEVICE_URL default baked in at build time via `.env`
 *
 * Every API call goes through `api()` / `apiFetch()` so the whole app
 * targets a single, user-configurable host — the UI can now be hosted
 * anywhere (it no longer has to be served by the device itself).
 */

const STORAGE_KEY = "iot.device-url";

const clean = (url: string) => url.trim().replace(/\/+$/, "");

/** Build-time default coming from `.env` (IOT_DEVICE_URL). */
export const DEFAULT_DEVICE_URL = clean(import.meta.env.IOT_DEVICE_URL ?? "");

/** The address currently in effect (custom override, else the default). */
export const getDeviceUrl = (): string => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved !== null ? clean(saved) : DEFAULT_DEVICE_URL;
};

/** True when the user has overridden the build-time default. */
export const hasCustomDeviceUrl = (): boolean =>
  localStorage.getItem(STORAGE_KEY) !== null;

export const setDeviceUrl = (url: string): void => {
  localStorage.setItem(STORAGE_KEY, clean(url));
};

export const resetDeviceUrl = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

/** Prefix an API path with the resolved device URL. */
export const api = (path: string): string => {
  const base = getDeviceUrl();
  const suffix = path.startsWith("/") ? path : `/${path}`;
  // No base configured → stay relative so the Vite dev proxy can take over.
  return base ? `${base}${suffix}` : suffix;
};

/** `fetch` against the resolved device URL. */
export const apiFetch = (path: string, init?: RequestInit) =>
  fetch(api(path), init);