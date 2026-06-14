import Preference from "preference";

type StorageType = ArrayBuffer | string | number | boolean;

/**
 * > Note: On embedded devices, preferences are stored in SPI flash which has a limited number of erase cycles.
 * > Applications should minimize the number of write operations (set and delete).
 * > In practice, this isn't a significant concern.
 * > However, an application that updates preferences once per minute,
 * > for example, could eventually exceed the available erase cycles for the preference storage area in SPI flash.
 *
 * Basically we should not overuse this memory bank for reoccurring operations :(
 * I was using it for a timer to update every tick and such things are red flag, it will kill the chip very soon.
 */
export class Storage<ValueType extends StorageType> {
  private readonly domain: string = "no-domain";
  private readonly name: string = "no-name";

  /**
   * Persistent on-disk storage (SPI flash)
   */
  constructor(domain: string, name: string, defaultValue?: ValueType) {
    this.domain = this.validated(domain, 32);
    this.name = this.validated(name, 32);

    if (!this.hasValue()) {
      // Only write value when it is not set, should happen only 1st time.
      // We don't want after device restart the old disk values to be replaced by default values.
      if (defaultValue !== undefined) this.setValue(defaultValue);
    }
  }

  hasValue(): boolean {
    return this.getValue() !== undefined;
  }

  getValue() {
    return Preference.get(this.domain, this.name) as ValueType;
  }

  /**
   * Sets a value in the preference storage.
   * Be mindful of the number of write operations,
   * as it can wear out the flash memory over time.
   */
  setValue(value: ValueType): ValueType {
    Preference.set(this.domain, this.name, value);

    return value;
  }

  /**
   * Removes the value from the SPI flash storage.
   * Be mindful of the number of delete operations.
   */
  deleteValue() {
    Preference.delete(this.domain, this.name);
  }

  /**
   * Validates max characters
   * @throws {Error}
   */
  private validated(value: string, maxChars: number): string {
    if (value.length > maxChars) {
      throw new Error(`Max length exceeds ${maxChars} characters`);
    }

    return value;
  }
}
