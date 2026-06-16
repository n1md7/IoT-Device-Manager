import { Storage } from "database/storage";
import Digital from "pins/digital";
import { createLogger, type Logger } from "services/logger";
import { isDefined } from "utils/validations";

/**
 * HIGH or LOW values.
 * HIGH=1 and LOW=0 for controlling the switch.
 * Some devices are controller by HIGH or LOW signals.
 * Pin 2(D2) has built-in status light and that is being controlled by LOW signal
 * @example ```ts
 *   const status = new Switch({ pin: 2, signal: LOW });
 *
 *   status.start();
 *   status.stop();
 * ```
 * @default HIGH(1)
 */
export type Control = 0 | 1;

/**
 * Available DigitalPins in ESP8266
 * We only support digital pins for simple switch 👻
 */
export type Pins = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

type PinKey = `Pin:${number}`;
type Options = {
  /**
   * @description Digital number of the pin from the device.
   * @example 1 is D1, 2 is D2, etc.
   */
  pin: Pins;
  /**
   * @description Logger label
   * @example Switch
   * @default Switch
   */
  name?: string;
  /**
   * @description Either HIGH(1) or LOW(0) to control with.
   * Some devices are controller by HIGH or LOW signals.
   * @default HIGH(1)
   */
  signal?: Control;
};

export class Switch {
  private readonly pin: Digital;
  private readonly id: Pins;
  private readonly onSignal: Storage<1 | 0>;
  private readonly name: Storage<string>;
  private readonly logger: Logger;
  private currentlyActive: boolean;

  constructor(
    private readonly key: PinKey,
    options: Options,
  ) {
    this.id = options.pin;
    this.pin = new Digital({
      pin: options.pin,
      mode: Digital.Output,
    });
    this.currentlyActive = false;
    this.logger = createLogger(this.key);
    this.onSignal = new Storage(key, "signal");
    this.name = new Storage(key, "name");

    if (isDefined(options.signal)) {
      this.onSignal.setValue(options.signal);
    }

    if (isDefined(options.name)) {
      this.name.setValue(options.name);
    }

    this.stop();
  }

  private get offSignal() {
    return this.flip(this.onSignal.getValue());
  }

  isActive() {
    return this.currentlyActive;
  }

  setSignal(signal: 0 | 1) {
    this.onSignal.setValue(signal);
  }

  setName(name: string) {
    this.name.setValue(name);
  }

  toJSON() {
    return {
      pin: this.id,
      name: this.name.getValue(),
      control: this.getControl(),
      active: this.currentlyActive,
    };
  }

  start() {
    this.currentlyActive = true;
    this.pin.write(this.onSignal.getValue());
    this.logger.log(`ON signal written.`);
  }

  stop() {
    this.currentlyActive = false;
    this.pin.write(this.offSignal);
    this.logger.log(`OFF signal written.`);
  }

  private getControl() {
    return this.onSignal.getValue();
  }

  private flip(bit: 0 | 1) {
    return (bit ^ 1) as 0 | 1;
  }
}
