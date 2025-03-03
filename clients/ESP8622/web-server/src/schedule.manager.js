import { Scheduler } from "./scheduler";
import { clearInterval, setInterval } from "./utils";
import { ConsoleLogger } from "./logger";
import Storage from "./storage";

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

  #schedules = [
    new Scheduler("schedule1"),
    new Scheduler("schedule2"),
    new Scheduler("schedule3"),
    new Scheduler("schedule4"),
  ];

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
