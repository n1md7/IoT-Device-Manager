import { type Control, type Pins, Switch } from "services/switch";
import { IDs } from "storages/ids";
import type Timer from "timer";
import { clearTimeout, setTimeout } from "utils/interval";

export type CreateSwitch = {
  digitalPin: Pins;
  control: Control;
  name: string;
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
      const { pin, name, control, active } = sw.toJSON();
      const stopsAt = this.stopAtTime.get(pin) || null;

      return {
        pin,
        name,
        control,
        active,
        stopsAt,
      };
    });
  }

  startBy(pin: Pins, stopAt?: number) {
    const switch_ = this.getSwitchBy(pin);

    // Scheduler start (no stopAt) adopts an already-on pin: clear any manual
    // auto-off so a leftover one-shot can't switch it off mid-window.
    if (!stopAt && switch_.isActive()) return this.clearStopAt(pin);

    if (switch_.isActive()) return;

    switch_.start();

    // No stopAt? -> scheduler controls it
    if (!stopAt) return this.clearStopAt(pin);

    // Manual control: (re)arm a one-shot auto-off and remember when it fires.
    this.clearStopAt(pin); // Just in case if we had some timer references, to avoid memory-leaks
    this.stopAtTime.set(pin, stopAt);
    this.stopAtTimer.set(pin, this.scheduleStopBy(pin, stopAt - Date.now()));
  }

  stopBy(pin: Pins) {
    const switch_ = this.getSwitchBy(pin);

    if (!switch_.isActive()) return;

    this.clearStopAt(pin);

    return switch_.stop();
  }

  create({ name, digitalPin: pin, control: signal }: CreateSwitch) {
    const switch_ = new Switch(`Pin:${pin}`, { name, pin, signal });

    this.switches.set(pin, switch_);
    this.pins.add(pin);

    return switch_;
  }

  updateBy(pin: Pins, { name, control }: UpdateSwitch) {
    const switch_ = this.switches.get(pin);

    if (!switch_) throw new Error(`Switch with pin ${pin} not found`);

    switch_.setName(name);
    switch_.setSignal(control);
  }

  removeBy(pin: Pins) {
    this.pins.remove(pin);
    this.switches.delete(pin);
  }

  has(pin: number): pin is Pins {
    return this.switches.has(pin as Pins);
  }

  /** Cancel any pending auto-off and forget when it would have fired. */
  private clearStopAt(pin: Pins) {
    clearTimeout(this.stopAtTimer.get(pin));
    this.stopAtTimer.delete(pin);
    this.stopAtTime.delete(pin);
  }

  private scheduleStopBy(pin: Pins, ms: number) {
    return setTimeout(() => this.stopBy(pin), ms);
  }

  private restoreFromDisk() {
    const switches = new Map<Pins, Switch>();
    const pins = this.pins.get();

    for (const pin of pins) {
      switches.set(pin, new Switch(`Pin:${pin}`, { pin }));
    }

    return switches;
  }

  private getSwitchBy(pin: Pins) {
    if (!this.switches.has(pin)) {
      throw new Error(`Device pin ${pin} not found.`);
    }

    return this.switches.get(pin)!;
  }
}
