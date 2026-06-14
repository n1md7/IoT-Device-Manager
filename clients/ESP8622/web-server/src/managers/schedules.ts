import { Switches } from "managers/switches";
import { Schedule, type SchedulerPayload } from "services/schedule";
import { IDs } from "storages/ids";
import { UniqueID } from "storages/unique-id";
import type Timer from "timer";
import { clearInterval, setInterval } from "utils/interval";
import { isBoolean } from "utils/validations";

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
    const schedule = new Schedule(`SDL:${uid}`, payload);
    this.schedules.set(uid, schedule);
    this.ids.add(uid);

    return schedule;
  }

  updateBy(
    id: number,
    { endTime, weekdays, startTime, isActive, controlPin }: UpdateSchedule,
  ) {
    const schedule = this.schedules.get(id);

    if (!schedule) throw new Error(`Schedule "${id}" not found`);

    if (endTime) schedule.setEndTime(endTime);
    if (weekdays) schedule.setWeekdays(weekdays);
    if (startTime) schedule.setStartTime(startTime);
    if (controlPin) schedule.setControlPin(controlPin);
    if (isBoolean(isActive)) schedule.setIsActive(isActive);
  }

  removeBy(id: number) {
    this.ids.remove(id);
    this.schedules.delete(id);
  }

  private onTick() {
    for (const schedule of this.schedules.values()) {
      if (schedule.isDisabled()) continue;

      const pin = schedule.getControlPin();

      switch (true) {
        case schedule.isTimeToStop():
          this.switches.stopBy(pin);
          break;
        case schedule.isTimeToStart():
          this.switches.startBy(pin);
          break;
      }
    }
  }

  private restoreFromDisk() {
    const schedules = new Map<number, Schedule>();
    const ids = this.ids.get();

    for (const id of ids) {
      const schedule = new Schedule(`SDL:${id}`);
      schedules.set(id, schedule);
    }

    return schedules;
  }
}
