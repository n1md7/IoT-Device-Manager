import Storage from "./storage";

export class Scheduler {
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
    if (!value.match(/^([0-6],?)+$/)) {
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
