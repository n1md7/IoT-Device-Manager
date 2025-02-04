import { Status } from '../enums/status.enum.ts';

export type TimerCb = () => void;
type TimerId = ReturnType<typeof setInterval>;
type StartParams = {
  initialRun: boolean;
};

export class Timer {
  private callback?: TimerCb;
  private nextTick?: number;
  private timerId?: TimerId;
  private isRunning = false;

  constructor(nextTick?: number) {
    this.nextTick = nextTick;
  }

  isActive() {
    return this.isRunning;
  }

  getStatus() {
    return this.isRunning ? Status.ON : Status.OFF;
  }

  /**
   * @description Schedule a callback to be executed every `nextTick` milliseconds
   *
   * @param {Boolean} params.initialRun - If true, the callback will be executed immediately
   */
  start(params?: StartParams) {
    this.validate();
    this.scheduleCallback();

    if (params?.initialRun) this.executeCallback();
  }

  resume() {
    this.start();
  }

  stop() {
    this.isRunning = false;
    this.clearTimer();
  }

  setCallback(callback: TimerCb) {
    this.callback = callback;

    return this;
  }

  /**
   * @param {number} nextTick - Time in milliseconds
   */
  setNextTick(nextTick: number) {
    this.clearTimer();
    this.nextTick = nextTick;

    return this;
  }

  private executeCallback() {
    this.isRunning = true;
    if (this.callback) this.callback();
  }

  private scheduleCallback() {
    this.clearTimer();

    if (this.nextTick) {
      this.timerId = setInterval(() => {
        this.executeCallback();
      }, this.nextTick);
    }
  }

  private clearTimer() {
    if (this.timerId) clearInterval(this.timerId);
  }

  private validate() {
    if (!this.nextTick) throw new Error('Next tick is not set');
    if (!this.callback) throw new Error('Callback is not set');
  }
}
