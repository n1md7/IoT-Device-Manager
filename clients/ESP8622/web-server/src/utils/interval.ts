import Timer, { type TimerCallback } from "timer";

type N = number;
type TC = TimerCallback;
export const every = (value: N) => (current: N) => current % value === 0;
export const setInterval = (cb: TC, ms: N) => Timer.repeat(cb, ms);
export const clearInterval = (timer?: Timer) => Timer.clear(timer);
export const toSeconds = (min: N, sec: N) => min * 60 + +sec;
