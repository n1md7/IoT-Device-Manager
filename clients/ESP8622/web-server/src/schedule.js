import Storage from "./database/storage";
import { ConsoleLogger } from "services/logger";
import { clearInterval, setInterval } from "utils/http";

class Scheduler {
  #name = "scheduler";
  /**
   * @type {Storage}
   * @desc - Whether the scheduler is active or not.
   */
  #active;

  /**
   * @type {Storage}
   * @desc - Executes at the specified hour, 24-hour format. [0-23]
   */
  #hour;
  /**
   * @type {Storage}
   * @desc - Executes at the specified minute. [0-59]
   */
  #minute;

  /**
   * @type {Storage}
   * @desc [1-7]. JS Date object getDay() returns "0" for Sunday and "1" for Monday.
   * It is used as CSV values. List of weekdays to execute. for example, "0,1,2,3,4,5,6"
   */
  #weekdays;

  /**
   * @type {Storage}
   * @desc - Activates the scheduler for the specified seconds.
   */
  #activateForSeconds;

  constructor(name) {
    this.#name = name;
    this.#active = new Storage(name, "active", false);
    this.#hour = new Storage(name, "hour", 0);
    this.#minute = new Storage(name, "minute", 0);
    this.#weekdays = new Storage(name, "weekdays", "0,1,2,3,4,5,6");
    this.#activateForSeconds = new Storage(name, "activateForSeconds", 60);
  }

  getName() {
    return this.#name;
  }

  /**
   * @param {number} value
   * @returns {Error|undefined}
   */
  setHour(value) {
    if (value < 0 || value > 23) {
      return new Error("Invalid hour. Must be between 0 and 23");
    }

    this.#hour.setValue(+value);
  }

  /**
   * @param {number} value
   * @returns {Error|undefined}
   */
  setMinute(value) {
    if (value < 0 || value > 59) {
      return new Error("Invalid minute. Must be between 0 and 59");
    }

    this.#minute.setValue(value);
  }

  /**
   * @param {string} value
   * @returns {Error|undefined}
   */
  setWeekday(value) {
    if (
      !value
        .split(",")
        .map(Number)
        .every((a) => a >= 0 && a <= 6)
    ) {
      return new Error(
        "Invalid weekdays. Must be CSV values between 0 and 6, where 0 is Sunday",
      );
    }

    this.#weekdays.setValue(value);
  }

  /**
   * @param {number} value
   * @returns {Error|undefined}
   */
  setActivateForSeconds(value) {
    if (value < 60 || value > 60 * 60) {
      // Min 60 seconds, Max 1 hour
      return new Error(
        "Invalid activateForSeconds. Must be between 60 and 3600",
      );
    }

    this.#activateForSeconds.setValue(value);
  }

  /**
   * @param {boolean} value
   * @returns {Error|undefined}
   */
  setActive(value) {
    if (typeof value !== "boolean") {
      return new Error(`Invalid active value. Must be boolean`);
    }

    this.#active.setValue(value);
  }

  getActivateForSeconds() {
    return this.#activateForSeconds.getValue();
  }

  isActive() {
    return this.#active.getValue();
  }

  isTimeToExecute(now = new Date()) {
    if (!this.#active.getValue()) return false;

    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentWeekday = now.getDay();

    const hour = this.#hour.getValue(0);
    const minute = this.#minute.getValue(0);
    const weekdays = this.#weekdays.getValue().split(",").map(Number);

    if (!weekdays.includes(currentWeekday)) return false;

    return hour === currentHour && minute === currentMinute;
  }

  toJson(id = 0) {
    return {
      id,
      name: this.#name,
      active: this.#active.getValue(),
      hour: this.#hour.getValue(0),
      minute: this.#minute.getValue(0),
      weekdays: this.#weekdays.getValue(),
      activateForSeconds: this.#activateForSeconds.getValue(),
    };
  }

  /**
   * @description Wipes every persisted value for this schedule from disk.
   */
  destroy() {
    this.#active.deleteValue();
    this.#hour.deleteValue();
    this.#minute.deleteValue();
    this.#weekdays.deleteValue();
    this.#activateForSeconds.deleteValue();
  }
}

/**
 * @callback SchedulerCallback
 * @param {number} executeForSeconds
 * @param {Logger} logger
 */

export default class ScheduleManager {
  #tickEveryMs = 10_000;

  /**
   * @desc Hard cap on concurrent schedules to stay within device memory.
   */
  #maxSchedules = 4;

  /**
   * @type {Timer}
   */
  #timer;
  #logger = new ConsoleLogger("ScheduleManager");

  /**
   * @type {{id: number, scheduler: Scheduler}[]}
   */
  #schedules = [];

  /**
   * @type {Storage}
   * @desc CSV of the ids currently in use, e.g. "1,3,4". Persists the dynamic
   * set of schedules across reboots.
   */
  #ids;

  /**
   * @type {Storage}
   * @desc Monotonic id counter. Ids are never reused, even after removal.
   */
  #nextId;

  /**
   * @type {Storage}
   * @desc Marks whether the very first schedule has been seeded.
   */
  #initialized;

  /**
   * @type {Storage}
   */
  #turnedOff;

  /**
   * @type {SchedulerCallback}
   */
  #onExecute;

  constructor() {
    this.#turnedOff = new Storage("scheduleManager", "turnedOff", false);
    this.#ids = new Storage("scheduleManager", "ids", "");
    this.#nextId = new Storage("scheduleManager", "nextId", 1);
    this.#initialized = new Storage("scheduleManager", "initialized", false);

    this.#restore();

    // Fresh device: seed exactly one (disabled) schedule to start from.
    if (!this.#initialized.getValue()) {
      this.create();
      this.#initialized.setValue(true);
    }
  }

  /**
   * @description Rebuilds the in-memory schedule list from the persisted ids.
   */
  #restore() {
    const raw = this.#ids.getValue();
    const ids = raw ? String(raw).split(",").map(Number) : [];

    for (const id of ids) {
      this.#schedules.push({ id, scheduler: new Scheduler(`schedule${id}`) });
    }
  }

  #persistIds() {
    this.#ids.setValue(this.#schedules.map((entry) => entry.id).join(","));
  }

  /**
   * @description Creates a new schedule with default values.
   * @returns {Object|Error} The created schedule as JSON, or an Error if the
   * limit is reached.
   */
  create() {
    if (this.#schedules.length >= this.#maxSchedules) {
      return new Error(`Schedule limit reached (max ${this.#maxSchedules})`);
    }

    const id = this.#nextId.getValue();
    this.#nextId.setValue(id + 1);

    const scheduler = new Scheduler(`schedule${id}`);
    this.#schedules.push({ id, scheduler });
    this.#persistIds();

    this.#logger.info(`Created schedule ${id}`);

    return scheduler.toJson(id);
  }

  /**
   * @param {number} id - Schedule id to remove
   * @returns {Error|undefined}
   */
  remove(id) {
    const index = this.#schedules.findIndex((entry) => entry.id === id);
    if (index === -1) {
      return new Error(`Invalid schedule id: ${id}`);
    }

    this.#schedules[index].scheduler.destroy();
    this.#schedules.splice(index, 1);
    this.#persistIds();

    this.#logger.info(`Removed schedule ${id}`);
  }

  /**
   * @param {number} id - Schedule id
   * @param {string} week - Schedule weekdays. CSV values between 0 and 6, where 0 is Sunday
   * @param {number} hour - Schedule hour value
   * @param {number} minute - Schedule minute value
   * @param {boolean} active - Schedule activation
   * @param {number} runForSeconds - Schedule run for seconds
   * @returns {Error|undefined}
   */
  updateScheduleById(id, week, hour, minute, active, runForSeconds) {
    const entry = this.#schedules.find((entry) => entry.id === id);
    if (!entry) {
      return new Error(`Invalid schedule id: ${id}`);
    }

    const schedule = entry.scheduler;

    for (const error of [
      schedule.setHour(hour),
      schedule.setMinute(minute),
      schedule.setWeekday(week),
      schedule.setActive(active),
      schedule.setActivateForSeconds(runForSeconds),
    ]) {
      if (error) return error;
    }

    this.#logger.info(id, week, hour, minute, active, runForSeconds);
    this.#logger.info(`Updated schedule: ${schedule.getName()}`);
  }

  initialize() {
    if (this.#turnedOff.getValue()) return this.#unsubscribe();

    return this.#subscribe();
  }

  #subscribe() {
    this.#timer = setInterval(() => {
      const now = new Date();
      for (const { scheduler } of this.#schedules) {
        if (scheduler.isActive() && scheduler.isTimeToExecute(now)) {
          this.#logger.info(`Executing schedule: ${scheduler.getName()}`);
          if (this.#onExecute) {
            this.#onExecute(scheduler.getActivateForSeconds(), this.#logger);
          }
        }
      }
    }, this.#tickEveryMs);
  }

  #unsubscribe() {
    if (this.#timer) {
      clearInterval(this.#timer);
      this.#timer = null;
    }
  }

  /**
   * @param {SchedulerCallback} callback
   */
  setOnExecute(callback) {
    this.#onExecute = callback;

    return this;
  }

  turnOff() {
    this.#turnedOff.setValue(true);
    this.#unsubscribe();
  }

  turnOn() {
    this.#turnedOff.setValue(false);
    this.#subscribe();
  }

  toJson() {
    return this.#schedules.map(({ id, scheduler }) => scheduler.toJson(id));
  }
}
