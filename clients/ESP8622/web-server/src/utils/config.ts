import config from "mc/config";

/**
 * Parse a build-time timezone string into an offset **east of UTC, in seconds**
 * — the unit `Time.timezone` wants. Accepts `UTC`, `UTC+3`, `UTC-7`, and
 * half/quarter-hour zones like `UTC+5:30`. Anything malformed falls back to
 * UTC (0) rather than silently shifting the clock by a garbage amount.
 */
const parseTimezone = (value: string): number => {
  const match = /^UTC(?:([+-]\d{1,2})(?::(\d{2}))?)?$/.exec(value.trim());
  if (!match || !match[1]) return 0;

  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2] ?? "0", 10);
  const sign = hours < 0 ? -1 : 1;

  return (Math.abs(hours) * 3600 + minutes * 60) * sign;
};

const portOverride = config["port"];
export const port: number = portOverride ? parseInt(portOverride, 10) : 80;
export const timezone: number = parseTimezone(config["timezone"] || "UTC+3");
export const domain: string = config["domain"] || "node-mcu";
export const code: string = config["code"] || "D0001";
export const version: string = config["version"] || "1.0.0";
export const description: string =
  config["description"] ||
  "A web server running on NodeMCU with scheduler and manual controller";
