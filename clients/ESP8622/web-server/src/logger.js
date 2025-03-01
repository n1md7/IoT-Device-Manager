import config from "mc/config";
import { File } from "file";

export const getLoggerPath = () => config.file.root + "log.txt";

export class Logger {
  #label = null;

  constructor(label = "") {
    this.#label = label;
  }

  log(...messages) {}
  info(...messages) {}
  warn(...messages) {}
  error(...messages) {}

  getFormat(type, ...message) {
    if (this.#label) {
      return (
        `[${new Date().toISOString()}][${type}][${this.#label}] ` +
        message.join(" ")
      );
    }

    return `[${new Date().toISOString()}][${type}] ` + message.join(", ");
  }
}

export class FileLogger extends Logger {
  /**
   * @type {File}
   */
  #file;
  /**
   * Write threshold in bytes, it's set to 2KB
   * @type {number}
   * @constant
   */
  #writeThreshold = 2 * 1024;

  constructor(label = "") {
    super(label);

    this.#file = new File(getLoggerPath(), true);
  }

  #write(type, ...messages) {
    if (this.#file?.length >= this.#writeThreshold) {
      this.#reduceFileSize(1024);
    }
    this.#file.write(this.getFormat(type, messages) + "\n");
  }

  /**
   * @param {number} size - Keep content size in bytes
   */
  #reduceFileSize(size) {
    trace("Reducing file size to " + size + " bytes");
    const content = this.#file.read(String);
    this.#file = new File(getLoggerPath(), true);
    this.#write(content.slice(content.length - size));
  }

  log(...messages) {
    this.#write("LOG", ...messages);
  }

  info(...messages) {
    this.#write("INFO", ...messages);
  }

  error(...messages) {
    this.#write("ERROR", ...messages);
  }

  warn(...messages) {
    this.#write("WARN", ...messages);
  }
}

export class ConsoleLogger extends Logger {
  log(...messages) {
    trace(this.getFormat("LOG", messages) + "\n");
  }

  info(...messages) {
    trace(this.getFormat("INFO", messages) + "\n");
  }

  warn(...messages) {
    trace(this.getFormat("WARN", messages) + "\n");
  }

  error(...messages) {
    trace(this.getFormat("ERROR", messages) + "\n");
  }
}
