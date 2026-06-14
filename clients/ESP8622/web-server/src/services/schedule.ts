import { Storage } from "database/storage";
import type { Pins } from "services/switch";
import { isBoolean, isNumber } from "utils/validations";

type SDLKey = `SDL:${number}`;

type HH = number;
type MM = number;
type SS = number;
export type TimePayload = {
  hh: HH;
  mm: MM;
  ss: SS;
};
export type TimeValue = `${HH}:${MM}:${SS}`;

type Bit = 0 | 1;
type MON = Bit;
type TUE = Bit;
type WED = Bit;
type THU = Bit;
type FRI = Bit;
type SAT = Bit;
type SUN = Bit;
export type WeekPayload = {
  sun: SUN;
  mon: MON;
  tue: TUE;
  wed: WED;
  thu: THU;
  fri: FRI;
  sat: SAT;
};
// Sunday-first to line up with JS `Date.getDay()` (Sun=0 .. Sat=6).
export type Weekdays = `${SUN}:${MON}:${TUE}:${WED}:${THU}:${FRI}:${SAT}`;

export type SchedulerPayload = {
  controlPin: Pins;
  startTime: TimePayload;
  endTime: TimePayload;
  weekdays: WeekPayload;
  isActive: boolean;
};

/**
 * Unique name per scheduler. Name is used as domain for Storage
 */
export class Schedule {
  private readonly startTime: Storage<TimeValue>;
  private readonly endTime: Storage<TimeValue>;
  private readonly weekdays: Storage<Weekdays>;
  private readonly isActive: Storage<boolean>;
  private readonly controlPin: Storage<Pins>;

  constructor(
    private readonly key: SDLKey,
    {
      startTime,
      endTime,
      weekdays,
      isActive,
      controlPin,
    }: Partial<SchedulerPayload> = {},
  ) {
    this.startTime = new Storage(key, "startTime");
    this.endTime = new Storage(key, "endTime");
    this.weekdays = new Storage(key, "weekdays");
    this.isActive = new Storage(key, "isActive");
    this.controlPin = new Storage(key, "digitalPin");

    if (startTime) this.startTime.setValue(this.toTimeValue(startTime));
    if (endTime) this.endTime.setValue(this.toTimeValue(endTime));
    if (weekdays) this.weekdays.setValue(this.toWeekValue(weekdays));
    if (isBoolean(isActive)) this.isActive.setValue(isActive);
    if (isNumber(controlPin)) this.controlPin.setValue(controlPin);
  }

  setControlPin(digitalPin: Pins) {
    this.controlPin.setValue(digitalPin);
  }

  getControlPin() {
    return this.controlPin.getValue();
  }

  setStartTime(time: TimePayload) {
    this.startTime.setValue(this.toTimeValue(time));

    return this;
  }

  setEndTime(time: TimePayload) {
    this.endTime.setValue(this.toTimeValue(time));

    return this;
  }

  setWeekdays(week: WeekPayload) {
    this.weekdays.setValue(this.toWeekValue(week));

    return this;
  }

  setIsActive(isActive: boolean) {
    this.isActive.setValue(isActive);

    return this;
  }

  isDisabled() {
    return !this.isActive.getValue();
  }

  toJSON() {
    return {
      id: this.key,
      startTime: this.startTime.getValue(),
      endTime: this.endTime.getValue(),
      weekdays: this.weekdays.getValue(),
      isActive: this.isActive.getValue(),
      digitalPin: this.controlPin.getValue(),
    };
  }

  /**
   * Should the device be running right now? True only when today is an active weekday,
   * and the time-of-day falls inside the `[startTime, endTime)` window.
   */
  isTimeToStart(now = new Date()): boolean {
    return this.isWithinWindow(now);
  }

  /**
   * Should the device be off right now? True when
   * `now` is outside the window (wrong weekday or outside the time range).
   */
  isTimeToStop(now = new Date()): boolean {
    return !this.isWithinWindow(now);
  }

  /**
   * Whether `now` falls inside the active window: an enabled weekday AND the
   * time-of-day in `[startTime, endTime)`. Windows are same-day, so `startTime`
   * must be earlier than `endTime` — a misconfigured (or empty) window simply
   * reads as "outside", keeping the device off.
   */
  private isWithinWindow(now: Date): boolean {
    const startTime = this.startTime.getValue();
    const endTime = this.endTime.getValue();

    if (!startTime || !endTime) return false;
    if (!this.isActiveWeekday(now)) return false;

    const [startHH, startMM, startSS] = startTime.split(":").map(Number);
    const [endHH, endMM, endSS] = endTime.split(":").map(Number);

    const nowSec = this.toSecondsOfDay(
      now.getHours(),
      now.getMinutes(),
      now.getSeconds(),
    );
    const startSec = this.toSecondsOfDay(startHH, startMM, startSS);
    const endSec = this.toSecondsOfDay(endHH, endMM, endSS);

    return this.inBetween(nowSec, startSec, endSec);
  }

  /**
   * The weekday mask is Sunday-first, the same order as JS `Date.getDay()`
   * (Sun=0 ... Sat=6), so the day index is used directly.
   */
  private isActiveWeekday(now: Date): boolean {
    const weekdays = this.weekdays.getValue();
    if (!weekdays) return false;

    const bits = weekdays.split(":").map(Number);
    if (bits.length !== 7) return false;

    return bits[now.getDay()] === 1;
  }

  private toSecondsOfDay(hh: number, mm: number, ss: number): number {
    return hh * 3600 + mm * 60 + ss;
  }

  private inBetween(value: number, min: number, max: number) {
    return value >= min && value < max;
  }

  private toTimeValue({ hh, mm, ss }: TimePayload): TimeValue {
    return `${hh}:${mm}:${ss}`;
  }

  private toWeekValue({
    sun,
    mon,
    tue,
    wed,
    thu,
    fri,
    sat,
  }: WeekPayload): Weekdays {
    return `${sun}:${mon}:${tue}:${wed}:${thu}:${fri}:${sat}`;
  }
}
