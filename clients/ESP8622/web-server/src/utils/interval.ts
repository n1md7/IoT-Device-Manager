import Timer, { type TimerCallback } from "timer";
import { console } from "utils/console";
import { getErrorMessage } from "express/utils";

type N = number;
export type TC = TimerCallback;

/**
 * Timer callbacks run on their own stack — nothing wraps them, so a throw
 * inside one is an uncaught exception that resets the device. Wrap every
 * scheduled callback so a failure is logged instead of fatal. The returned
 * timer handle is unchanged, so `clearInterval`/`clearTimeout` still works.
 */
const guard = (cb: TC): TC =>
  function (this: unknown, ...args: unknown[]) {
    try {
      return (cb as Function).apply(this, args);
    } catch (e) {
      console.error(`[Timer] uncaught: ${getErrorMessage(e)}`);
    }
  };

export const setInterval = (cb: TC, ms: N) => Timer.repeat(guard(cb), ms);
export const clearInterval = (timer?: Timer) => Timer.clear(timer);

export const setTimeout = (cb: TC, ms: N) => Timer.set(guard(cb), ms);
export const clearTimeout = clearInterval;
