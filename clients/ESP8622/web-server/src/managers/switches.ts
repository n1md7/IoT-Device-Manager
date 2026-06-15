import { type Control, type Pins, Switch } from "services/switch";
import { IDs } from "storages/ids";
import type Timer from "timer";
import { clearTimeout, setTimeout } from "utils/interval";

export type CreateSwitch = {
  digitalPin: Pins;
  control: Control;
};

export type UpdateSwitch = Omit<CreateSwitch, "digitalPin">;

export class Switches {
  private readonly stopAtTimer: Map<Pins, Timer>;
  private readonly stopAtTime: Map<Pins, number>;
  private readonly switches: Map<Pins, Switch>;
  private readonly pins: IDs<Pins>;

  constructor() {
    this.stopAtTimer = new Map();
    this.stopAtTime = new Map();
    this.pins = new IDs<Pins>("Pins");
    this.switches = this.restoreFromDisk();
  }

  toArray() {
    return [...this.switches.values()].map((sw) => {
      const { pin, control, active } = sw.toJSON();
      const stopsAt = this.stopAtTime.get(pin) || null;

      return {
        pin,
        control,
        active,
        stopsAt,
      };
    });
  }

  startBy(pin: Pins, stopAt?: number) {
    this.getBy(pin).start();

    if (!stopAt) return;

    if (this.stopAtScheduledBy(pin)) this.stopAtClearBy(pin);

    const delayMs = stopAt - Date.now();
    this.stopAtTimer.set(pin, this.scheduleStopBy(pin, delayMs));
  }

  stopBy(pin: Pins) {
    return this.getBy(pin).stop();
  }

  create({ digitalPin: pin, control: signal }: CreateSwitch) {
    const switch_ = new Switch(`Pin:${pin}`, { pin, signal });

    this.switches.set(pin, switch_);
    this.pins.add(pin);

    return switch_;
  }

  updateBy(pin: Pins, { control }: UpdateSwitch) {
    const switch_ = this.switches.get(pin);

    if (!switch_) throw new Error(`Switch with pin ${pin} not found`);

    switch_.setSignal(control);
  }

  removeBy(pin: Pins) {
    this.pins.remove(pin);
    this.switches.delete(pin);
  }

  has(pin: number): pin is Pins {
    return this.switches.has(pin as Pins);
  }

  private stopAtScheduledBy(pin: Pins) {
    return this.stopAtTimer.has(pin);
  }

  private stopAtClearBy(pin: Pins) {
    clearTimeout(this.stopAtTimer.get(pin));
    this.stopAtTimer.delete(pin);
  }

  private scheduleStopBy(pin: Pins, ms: number) {
    return setTimeout(() => {
      this.stopBy(pin);
      this.stopAtTimer.delete(pin);
    }, ms);
  }

  private restoreFromDisk() {
    const switches = new Map<Pins, Switch>();
    const pins = this.pins.get();

    for (const pin of pins) {
      switches.set(pin, new Switch(`Pin:${pin}`, { pin }));
    }

    return switches;
  }

  private getBy(pin: Pins) {
    if (!this.switches.has(pin)) {
      throw new Error(`Device pin ${pin} not found.`);
    }

    return this.switches.get(pin)!;
  }
}
