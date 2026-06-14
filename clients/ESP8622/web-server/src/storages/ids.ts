import { Storage } from "database/storage";

export class IDs<T = number> {
  private readonly ids: Storage<string>;

  constructor(domain: string) {
    this.ids = new Storage(domain, "ids", "");
  }

  get(): T[] {
    const rawValue = this.ids.getValue();

    if (!rawValue) return [];

    return rawValue.split(",").map(Number) as T[];
  }

  add(id: T) {
    const ids = this.get();

    if (ids.includes(id)) return;

    ids.push(id);
    this.set(ids);
  }

  set(ids: T[]) {
    this.ids.setValue(ids.join(","));
  }

  remove(id: T) {
    const ids = this.get();

    if (ids.includes(id)) return;

    this.ids.setValue(ids.filter((i) => i !== id).join(","));
  }
}
