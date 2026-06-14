import SNTP from "sntp";
import Time from "time";
import { console } from "utils/console";

const hosts = [
  "0.pool.ntp.org",
  "1.pool.ntp.org",
  "2.pool.ntp.org",
  "3.pool.ntp.org",
];

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
