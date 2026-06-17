import SNTP from "sntp";
import Time from "time";
import { console } from "utils/console";

const hosts = [
  "0.pool.ntp.org",
  "1.pool.ntp.org",
  "2.pool.ntp.org",
  "3.pool.ntp.org",
];

/**
 * SNTP only ever gives us absolute UTC. The local-time getters used by the
 * scheduler (`Date#getHours`, `getDay`, …) localise through `Time.timezone`
 * (+ `Time.dst`), which default to 0 — so without this the device evaluates
 * windows in UTC while users author them in wall-clock time. We fold the whole
 * offset into `timezone` and keep `dst` at 0; the offset comes from the
 * build-time `timezone` config and is re-bumped when the zone flips.
 *
 * @param offsetSeconds offset east of UTC, e.g. UTC+3 -> 10800
 */
export const applyTimezone = (offsetSeconds: number) => {
  Time.timezone = offsetSeconds;
  Time.dst = 0;
};

export const adjustSystemTime = () => {
  const host = hosts.shift();
  if (!host) return console.error("[SNTP] No more hosts to try.");

  new SNTP({ host }, (message, value) => {
    switch (message) {
      case SNTP.time:
        if (value) {
          Time.set(value); // seconds since 1970, as Time.set expects
          console.info(
            `[SNTP] Time set from ${host}: ${new Date().toISOString()}`,
          );
        }
        return;

      case SNTP.retry:
        // Informational: the same client is already retrying on its own.
        return console.info("[SNTP] Retrying current request…");

      case SNTP.error: {
        console.error(`[SNTP] ${host} failed: ${String(value)}`);
        const next = hosts.shift();
        if (next) {
          console.info(`[SNTP] Falling back to ${next}`);
          return next; // SAME instance retries with this host
        }

        return console.error("[SNTP] No more hosts to try.");
      }
    }
  });
};
