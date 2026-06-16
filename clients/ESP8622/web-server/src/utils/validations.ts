import type { TimePayload, WeekPayload } from "services/schedule";

export const isDefined = <T>(value: T) => value !== undefined && value !== null;
export const isBoolean = <T>(value: T) => typeof value === "boolean";
export const isString = <T>(value: T) => typeof value === "string";
export const isNumber = <T>(value: T) => typeof value === "number";
export const isObject = <T>(value: T) => {
  return typeof value === "object" && value !== null;
};
export const hasKeyFactory = (object: object) => (key: string) => {
  return Object.hasOwn(object, key);
};

export const hasKey = <O extends object, K extends string>(
  object: O,
  ...keys: K[]
): object is O & Record<K, unknown> => {
  return keys.every((key) => Object.hasOwn(object, key));
};

/**
 * Assertion helpers for request validation. They throw on failure, which the
 * central handler in `Express` turns into a `400`. Use these only where a bad
 * input should map to `400` — for `404`/`401`/etc. return `ctx.apiError`
 * explicitly instead.
 */
export function assertObject(
  value: unknown,
  message: string,
): asserts value is Record<string, any> {
  if (!isObject(value)) throw new Error(message);
}

export function assertNumber(
  value: unknown,
  message: string,
): asserts value is number {
  if (!isNumber(value)) throw new Error(message);
}

export function assertString(
  value: unknown,
  message: string,
): asserts value is string {
  if (!isString(value)) throw new Error(message);
}

export function assertLength(
  value: string,
  min: number,
  max: number,
): asserts value is string {
  if (value.length < min) throw new Error(`Invalid length. Min: ${value}`);
  if (value.length > max) throw new Error(`Invalid length. Max: ${value}`);
}

export function assertKeys<O extends object, K extends string>(
  object: O,
  message: string,
  ...keys: K[]
): asserts object is O & Record<K, unknown> {
  if (!hasKey(object, ...keys)) throw new Error(message);
}

export function assertBoolean(
  value: unknown,
  message: string,
): asserts value is boolean {
  if (!isBoolean(value)) throw new Error(message);
}

export function assertTimePayload(
  value: unknown,
  message: string,
): asserts value is TimePayload {
  if (!isTimePayload(value as TimePayload)) throw new Error(message);
}

export function assertWeekPayload(
  value: unknown,
  message: string,
): asserts value is WeekPayload {
  if (!isWeekPayload(value as WeekPayload)) throw new Error(message);
}

export const isTimePayload = (value: object): value is TimePayload => {
  const has = hasKeyFactory(value);

  if (!isObject(value)) return false;

  return has("hh") && has("mm") && has("ss");
};

export const isWeekPayload = (value: object): value is WeekPayload => {
  const has = hasKeyFactory(value);

  if (!isObject(value)) return false;

  return (
    has("sun") &&
    has("mon") &&
    has("tue") &&
    has("wed") &&
    has("thu") &&
    has("fri") &&
    has("sat")
  );
};
