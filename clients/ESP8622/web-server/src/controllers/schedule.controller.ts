import { Schedules } from "managers/schedules";
import type { Switches } from "managers/switches";
import type { TimePayload, WeekPayload } from "services/schedule";
import type { Pins } from "services/switch";
import { isDefined } from "utils/validations";

type CreateSchedulePayload = {
  controlPin: number;
  startTime: TimePayload;
  endTime: TimePayload;
  weekdays: WeekPayload;
  isActive: boolean;
};

type UpdateSchedulePayload = Partial<CreateSchedulePayload>;

export class ScheduleController {
  constructor(
    private readonly schedule: Schedules,
    private readonly switches: Switches,
  ) {}

  fetch() {
    return this.schedule.toArray();
  }

  create({
    isActive,
    startTime,
    endTime,
    weekdays,
    controlPin,
  }: CreateSchedulePayload) {
    this.assertPin(controlPin);

    return this.schedule
      .create({ isActive, endTime, startTime, weekdays, controlPin })
      .toJSON();
  }

  updateBy(
    id: number,
    {
      isActive,
      startTime,
      endTime,
      weekdays,
      controlPin,
    }: UpdateSchedulePayload,
  ) {
    if (isDefined(controlPin)) this.assertPin(controlPin);

    this.schedule.updateBy(id, {
      isActive,
      endTime,
      startTime,
      weekdays,
      controlPin,
    });
  }

  removeBy(id: number) {
    this.schedule.removeBy(id);
  }

  private assertPin(pin: number): asserts pin is Pins {
    if (!this.pinIsAllowed(pin)) {
      throw new Error("Control pin not enabled/allowed");
    }
  }

  private pinIsAllowed(pin: number): pin is Pins {
    return this.switches.has(pin);
  }
}
