/**
 * Generic payload assertions and type guards for request validation.
 *
 * Assertions throw a plain `Error` on failure. Because the Express response
 * funnel maps any non-`HttpError` throw to `400`, a failed assertion inside a
 * handler or plugin becomes a `400 Bad Request` automatically — no try/catch
 * needed. Throw `HttpError` (from `express/router`) if you need another status.
 *
 * Scope is deliberately generic: primitives, plain objects, arrays, key
 * presence. Domain-specific shapes (nested arrays, business rules) are left to
 * the caller, who composes them on top of `assertArray` + `assertKeys`.
 *
 * @example
 * import { assertObject, assertNumber, assertArray } from "express/assertion";
 *
 * function createSwitch(ctx: Context) {
 *   const body = ctx.body;
 *   assertObject(body, "Body required");
 *   assertNumber(body.pin, "pin must be a number");
 *   assertArray(body.tags, "tags must be an array");
 *   // body.tags is now unknown[] — validate the elements yourself
 * }
 */

export const isDefined = <T>(value: T): value is NonNullable<T> =>
  value !== undefined && value !== null;

export const isBoolean = (value: unknown): value is boolean =>
  typeof value === "boolean";

export const isString = (value: unknown): value is string =>
  typeof value === "string";

export const isNumber = (value: unknown): value is number =>
  typeof value === "number";

export const isArray = (value: unknown): value is unknown[] =>
  Array.isArray(value);

/** Plain object — excludes `null` and arrays (use {@link isArray} for those). */
export const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const hasKey = <O extends object, K extends string>(
  object: O,
  keys: K[],
): object is O & Record<K, unknown> =>
  keys.every((key) => Object.hasOwn(object, key));

export function assertDefined<T>(
  value: T,
  message: string,
): asserts value is NonNullable<T> {
  if (!isDefined(value)) throw new Error(message);
}

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

export function assertBoolean(
  value: unknown,
  message: string,
): asserts value is boolean {
  if (!isBoolean(value)) throw new Error(message);
}

export function assertArray(
  value: unknown,
  message: string,
): asserts value is unknown[] {
  if (!isArray(value)) throw new Error(message);
}

export function assertLength(
  value: string,
  min: number,
  max: number,
  message?: string,
): asserts value is string {
  if (value.length < min) throw new Error(message ?? `Too short. Min: ${min}`);
  if (value.length > max) throw new Error(message ?? `Too long. Max: ${max}`);
}

export function assertKeys<O extends object, K extends string>(
  object: O,
  message: string,
  ...keys: K[]
): asserts object is O & Record<K, unknown> {
  if (!hasKey(object, keys)) throw new Error(message);
}
