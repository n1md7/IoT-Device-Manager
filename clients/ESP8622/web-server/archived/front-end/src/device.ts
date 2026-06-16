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

/* -------------------------------------------------------------------------- */
/* Connection state                                                           */
/* -------------------------------------------------------------------------- */

export interface DeviceInfo {
  code: string;
  version: string;
  current: {
    name: string;
    description: string;
    startTime: number;
    managerUrl: string;
  };
  defaults: {
    name: string;
    description: string;
    startTime: number;
    managerUrl: string;
  };
  disk: { used: number; total: number; occupied: string };
  time: { now: number; str: string; iso: string };
}

export interface DeviceStatus {
  online: boolean;
  info?: DeviceInfo;
  error?: string;
}

/** Probe a specific address for the config endpoint (does not persist it). */
export const pingDevice = async (url: string): Promise<DeviceInfo> => {
  const base = clean(url);
  if (!base) throw new Error("No device address set");

  const response = await fetch(`${base}/api/info`);
  if (!response.ok) {
    throw new Error(`Device responded ${response.status}`);
  }

  return response.json();
};

let lastStatus: DeviceStatus | null = null;
const listeners = new Set<(status: DeviceStatus) => void>();

const broadcast = (status: DeviceStatus): void => {
  lastStatus = status;
  listeners.forEach((listener) => listener(status));
};

/**
 * Subscribe to connection-state changes. The callback fires immediately with
 * the last known status (if any), so subscribers never miss an early check.
 * Returns an unsubscribe function.
 */
export const onDeviceStatus = (
  listener: (status: DeviceStatus) => void,
): (() => void) => {
  listeners.add(listener);
  if (lastStatus) listener(lastStatus);
  return () => listeners.delete(listener);
};

/** Re-check the currently configured device and notify all subscribers. */
export const refreshConnection = async (): Promise<DeviceStatus> => {
  try {
    const info = await pingDevice(getDeviceUrl());
    const status: DeviceStatus = { online: true, info };
    broadcast(status);
    return status;
  } catch (error) {
    const status: DeviceStatus = {
      online: false,
      error: error instanceof Error ? error.message : "Device unreachable",
    };
    broadcast(status);
    return status;
  }
};