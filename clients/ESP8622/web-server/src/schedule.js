import Storage from "./storage";
import { ConsoleLogger } from "./logger";
import { clearInterval, setInterval } from "./utils";

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
   * @returns {number}
   */
  setHour(value) {
    if (value < 0 || value > 23) {
      throw new Error("Invalid hour. Must be between 0 and 23");
    }

    return this.#hour.setValue(+value);
  }

  /**
   * @param {number} value
   * @returns {number}
   */
  setMinute(value) {
    if (value < 0 || value > 59) {
      throw new Error("Invalid minute. Must be between 0 and 59");
    }

    return this.#minute.setValue(value);
  }

  /**
   * @param {string} value
   * @returns {string}
   */
  setWeekday(value) {
    if (
      !value
        .split(",")
        .map(Number)
        .every((a) => a >= 0 && a <= 6)
    ) {
      throw new Error(
        "Invalid weekdays. Must be CSV values between 0 and 6, where 0 is Sunday",
      );
    }

    return this.#weekdays.setValue(value);
  }

  /**
   * @param {number} value
   * @returns {number}
   */
  setActivateForSeconds(value) {
    if (value < 60 || value > 60 * 60) {
      // Min 60 seconds, Max 1 hour
      throw new Error(
        "Invalid activateForSeconds. Must be between 60 and 3600",
      );
    }

    return this.#activateForSeconds.setValue(value);
  }

  /**
   * @param {boolean} value
   * @returns {boolean}
   */
  setActive(value) {
    return this.#active.setValue(value);
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

    const hour = this.#hour.getValue();
    const minute = this.#minute.getValue();
    const weekdays = this.#weekdays.getValue().split(",").map(Number);

    if (!weekdays.includes(currentWeekday)) return false;

    return hour === currentHour && minute === currentMinute;
  }

  toJson(id = 0) {
    return {
      id,
      name: this.#name,
      active: this.#active.getValue(),
      hour: this.#hour.getValue(),
      minute: this.#minute.getValue(),
      weekdays: this.#weekdays.getValue(),
      activateForSeconds: this.#activateForSeconds.getValue(),
    };
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
   * @type {Timer}
   */
  #timer;
  #logger = new ConsoleLogger("ScheduleManager");

  #schedules = [new Scheduler("schedule1"), new Scheduler("schedule2")];

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
  }

  /**
   * @param {number} index - Schedule array index
   * @param {string} week - Schedule weekdays. CSV values between 0 and 6, where 0 is Sunday
   * @param {number} hour - Schedule hour value
   * @param {number} minute - Schedule minute value
   * @param {boolean} active - Schedule activation
   * @param {number} runForSeconds - Schedule run for seconds
   */
  updateScheduleByIndex(index, week, hour, minute, active, runForSeconds) {
    const schedule = this.#schedules[index];
    if (!schedule) {
      throw new Error(`Invalid schedule index: ${index}`);
    }

    schedule.setHour(hour);
    schedule.setMinute(minute);
    schedule.setWeekday(week);
    schedule.setActive(active);
    schedule.setActivateForSeconds(runForSeconds);

    this.#logger.info(`Updated schedule: ${schedule.getName()}`);
  }

  initialize() {
    if (this.#turnedOff.getValue()) return this.#unsubscribe();

    return this.#subscribe();
  }

  #subscribe() {
    this.#timer = setInterval(() => {
      const now = new Date();
      for (const schedule of this.#schedules) {
        if (schedule.isActive() && schedule.isTimeToExecute(now)) {
          this.#logger.info(`Executing schedule: ${schedule.getName()}`);
          if (this.#onExecute) {
            this.#onExecute(schedule.getActivateForSeconds(), this.#logger);
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
    return this.#schedules.map((schedule, id) => schedule.toJson(id));
  }
}
