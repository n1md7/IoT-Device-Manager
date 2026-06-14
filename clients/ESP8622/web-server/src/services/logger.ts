import { env } from "utils/env";

export abstract class Logger {
  private readonly label: string;

  constructor(label = "") {
    this.label = label;
  }

  log(...messages: string[]) {}
  info(...messages: string[]) {}
  warn(...messages: string[]) {}
  error(...messages: string[]) {}

  getFormat(type: string, messages: string[]) {
    if (this.label) {
      return (
        `[${new Date().toISOString()}][${type}][${this.label}] ` +
        messages.join(" ")
      );
    }

    return `[${new Date().toISOString()}][${type}] ` + messages.join(", ");
  }
}

/**
 * This logger type meant for during development time as the logs can be seen via XsBUG interface.
 */
export class ConsoleLogger extends Logger {
  log(...messages: string[]) {
    trace(this.getFormat("LOG", messages) + "\n");
  }

  info(...messages: string[]) {
    trace(this.getFormat("INFO", messages) + "\n");
  }

  warn(...messages: string[]) {
    trace(this.getFormat("WARN", messages) + "\n");
  }

  error(...messages: string[]) {
    trace(this.getFormat("ERROR", messages) + "\n");
  }
}

/**
 * This logger is meant for Production use, it does not log anything and is used to avoid unnecessary overhead of logging in production environment.
 * It can be used as a placeholder for a more sophisticated logger in the future if needed.
 */
export class HollowLogger extends Logger {}

export const createLogger = (label = "") => {
  if (env.is.production) return new HollowLogger(label);

  return new ConsoleLogger(label);
};
