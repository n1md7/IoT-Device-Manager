import Timer, { type TimerCallback } from "timer";

type N = number;
export type TC = TimerCallback;

export const setInterval = (cb: TC, ms: N) => Timer.repeat(cb, ms);
export const clearInterval = (timer?: Timer) => Timer.clear(timer);

export const setTimeout = (cb: TC, ms: N) => Timer.set(cb, ms);
export const clearTimeout = clearInterval;
