import { type Control, type Pins, Switch } from "services/switch";
import { IDs } from "storages/ids";

export type CreateSwitch = {
  digitalPin: Pins;
  control: Control;
};

export type UpdateSwitch = Omit<CreateSwitch, "digitalPin">;

export class Switches {
  private readonly switches: Map<Pins, Switch>;
  private readonly pins: IDs<Pins>;

  constructor() {
    this.pins = new IDs<Pins>("Pins");
    this.switches = this.restoreFromDisk();
  }

  toArray() {
    return [...this.switches.values()].map((sw) => sw.toJSON());
  }

  startBy(index: Pins) {
    return this.getBy(index).start();
  }

  stopBy(index: Pins) {
    return this.getBy(index).stop();
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

  private restoreFromDisk() {
    const switches = new Map<Pins, Switch>();
    const pins = this.pins.get();

    for (const pin of pins) {
      switches.set(pin, new Switch(`Pin:${pin}`, { pin }));
    }

    return switches;
  }

  has(pin: number): pin is Pins {
    return this.switches.has(pin as Pins);
  }

  private getBy(pin: Pins) {
    if (!this.switches.has(pin)) {
      throw new Error(`Device pin ${pin} not found.`);
    }

    return this.switches.get(pin)!;
  }
}
