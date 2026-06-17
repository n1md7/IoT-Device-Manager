import { Switches } from "managers/switches";
import { Schedule, type SchedulerPayload } from "services/schedule";
import { IDs } from "storages/ids";
import { UniqueID } from "storages/unique-id";
import type Timer from "timer";
import { clearInterval, setInterval } from "utils/interval";
import { isBoolean, isNumber } from "utils/validations";

export type CreateSchedule = SchedulerPayload & {};
export type UpdateSchedule = Partial<CreateSchedule>;

export class Schedules {
  private readonly switches: Switches;
  private readonly schedules: Map<number, Schedule>;
  private readonly id: UniqueID;
  private readonly ids: IDs;
  private timer?: Timer;

  constructor(switches: Switches, checkEveryMs: number) {
    this.switches = switches;
    this.id = new UniqueID("Schedules");
    this.ids = new IDs("Schedules");
    this.schedules = this.restoreFromDisk();
    this.timer = setInterval(() => this.onTick(), checkEveryMs);
  }

  unsubscribe() {
    clearInterval(this.timer);
    this.timer = undefined;
  }

  toArray() {
    return [...this.schedules.values()].map((schedule) => schedule.toJSON());
  }

  create(payload: CreateSchedule) {
    const uid = this.id.getNext();
    const schedule = new Schedule(uid, payload);
    this.schedules.set(uid, schedule);
    this.ids.add(uid);

    return schedule;
  }

  updateBy(
    uid: number,
    { endTime, weekdays, startTime, isActive, controlPin }: UpdateSchedule,
  ) {
    const schedule = this.schedules.get(uid);

    if (!schedule) throw new Error(`Schedule "${uid}" not found`);

    if (endTime) schedule.setEndTime(endTime);
    if (weekdays) schedule.setWeekdays(weekdays);
    if (startTime) schedule.setStartTime(startTime);
    if (isBoolean(isActive)) schedule.setIsActive(isActive);
    if (isNumber(controlPin)) {
      if (this.switches.has(controlPin)) {
        // Turn off Pin that was re-assigned
        // If not running, stopBy will skip it
        this.switches.stopBy(controlPin);
      }

      schedule.setControlPin(controlPin);
    }

    // Window/active state may have moved; reassert correct state on the next tick.
    schedule.markStale();
  }

  removeBy(uid: number) {
    this.ids.remove(uid);
    this.schedules.delete(uid);
  }

  private onTick() {
    for (const schedule of this.schedules.values()) {
      // A disabled schedule must reassert once when re-enabled, not pick up
      // mid-window as if it had been polling all along.
      if (schedule.isDisabled()) {
        schedule.markStale();
        continue;
      }

      // Act only on window transitions; a stable window emits no action, so a
      // manual start/stop holds until the next start/end boundary.
      const action = schedule.pollTransition();
      if (!action) continue;

      const pin = schedule.getControlPin();
      if (action === "start") this.switches.startBy(pin);
      else this.switches.stopBy(pin);
    }
  }

  private restoreFromDisk() {
    const schedules = new Map<number, Schedule>();
    const ids = this.ids.get();

    for (const uid of ids) {
      const schedule = new Schedule(uid);
      schedules.set(uid, schedule);
    }

    return schedules;
  }
}
