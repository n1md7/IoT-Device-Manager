export class Counter {
  private readonly start;
  private readonly end;
  private value;

  constructor(start = 0, end = 0) {
    this.value = start;
    this.start = start;
    this.end = end;
  }

  setValue(value = 0) {
    this.value = value;
  }

  getValue() {
    return this.value;
  }

  increment() {
    return ++this.value;
  }

  decrement() {
    return --this.value;
  }

  isZero() {
    return this.value === 0;
  }

  isFinished() {
    return this.value === this.end;
  }

  reset() {
    this.value = this.start;
  }
}
