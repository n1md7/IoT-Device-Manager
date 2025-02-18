import Timer from "timer";
import { Console, FileLogger } from "./logger";

export const setInterval = (callback, delay) => Timer.repeat(callback, delay);
export const clearInterval = (timer) => Timer.clear(timer);

export const console = new Console();
export const logger = new FileLogger();

export const HIGH = 1;
export const LOW = 0;
