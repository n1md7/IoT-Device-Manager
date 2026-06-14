import { Storage } from "database/storage";

export class UniqueID {
  private readonly key: Storage<number>;

  constructor(private readonly domain: string) {
    this.key = new Storage(domain, "key", 1);
  }

  getNext() {
    return this.key.setValue(this.key.getValue()! + 1);
  }
}
