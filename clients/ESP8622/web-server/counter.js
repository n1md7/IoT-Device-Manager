export default class Counter {
  #count = 0;

  constructor(start = 0) {
    this.#count = start;
  }

  setValue(value) {
    this.#count = value;
  }

  getValue() {
    return this.#count;
  }

  increment() {
    return ++this.#count;
  }

  decrement() {
    return --this.#count;
  }

  isZero() {
    return this.#count === 0;
  }

  isFinished() {
    return this.#count <= 0;
  }
}
