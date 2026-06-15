import { type Switches } from "managers/switches";
import { isNumber } from "utils/validations";

type Action = "Start" | "Stop";
type Control = 0 | 1;
type Pins = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
type ManualControlPayload = {
  digitalPin: number;
  action: string;
  stopAt?: number;
};
type CreateSwitchPayload = {
  control: number;
  digitalPin: number;
};
type UpdateSwitchPayload = {
  control: number;
};

export class SwitchController {
  /** Minimum lead time (ms) a `stopAt` timestamp must be ahead of now: 10s. */
  private readonly minStopAtLeadMs = 10_000;

  private readonly actions = new Set(["Start", "Stop"]);
  private readonly controls = new Set([0, 1]);
  private readonly pins = new Set([1, 2, 3, 4, 5, 6, 7, 8]);

  constructor(private readonly switches: Switches) {}

  manualControl({ digitalPin, action, stopAt }: ManualControlPayload) {
    if (!this.pinIsAllowed(digitalPin)) throw new Error("Invalid digitalPin");
    if (!this.actionIsAllowed(action)) throw new Error("Invalid action");

    switch (action) {
      case "Start":
        // We require stopAt for start action
        if (!isNumber(stopAt)) throw new Error("Invalid stopAt value");
        // stopAt is an epoch timestamp in ms; require it at least 10s ahead.
        if (stopAt - Date.now() < this.minStopAtLeadMs) {
          throw new Error("stopAt needs to be in the future, min 10s");
        }

        return this.switches.startBy(digitalPin, stopAt);
      case "Stop":
        return this.switches.stopBy(digitalPin);
      default:
        throw new Error("Invalid action, allowed: Start, Stop");
    }
  }

  fetch() {
    return this.switches.toArray();
  }

  create({ digitalPin, control }: CreateSwitchPayload) {
    if (!this.pinIsAllowed(digitalPin)) throw new Error("Invalid digitalPin");
    if (!this.controlIsAllowed(control)) throw new Error("Invalid control");

    return this.switches.create({ digitalPin, control }).toJSON();
  }

  updateBy(pin: number, { control }: UpdateSwitchPayload) {
    if (!this.pinIsAllowed(pin)) throw new Error("Invalid digitalPin");
    if (!this.controlIsAllowed(control)) throw new Error("Invalid control");

    this.switches.updateBy(pin, { control });
  }

  removeBy(pin: number) {
    if (!this.pinIsAllowed(pin)) throw new Error("Invalid pin");

    this.switches.removeBy(pin);
  }

  private controlIsAllowed(control: number): control is Control {
    return this.controls.has(control);
  }

  private actionIsAllowed(action: string): action is Action {
    return this.actions.has(action);
  }

  private pinIsAllowed(pin: number): pin is Pins {
    return this.pins.has(pin);
  }
}
