export class Counter {
  private value = 0;

  constructor(private readonly initialValue = 0, private readonly threshold = 0) {
    this.value = initialValue;
  }

  increment() {
    return ++this.value;
  }

  decrement() {
    return --this.value;
  }

  getValue() {
    return this.value;
  }

  setValue(value: number) {
    this.value = value;
  }

  reset() {
    this.value = this.initialValue;
  }


  isThresholdReached() {
    return this.value >= this.threshold;
  }

  isZero() {
    return this.value === 0;
  }

  isPositive() {
    return this.value > 0;
  }

  isNegative() {
    return this.value < 0;
  }

  isNegativeOrZero() {
    return this.isNegative() || this.isZero();
  }
}
