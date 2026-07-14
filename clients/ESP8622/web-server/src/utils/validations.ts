import type { TimePayload, WeekPayload } from "services/schedule";
import { isObject } from "express/assertion";

/**
 * Generic guards and assertions now live in the reusable `express/assertion`
 * module — re-export them so existing `utils/validations` imports keep working
 * without duplicating the implementations here. Only the domain-specific
 * payload validators (time/week schedules) are defined locally, built on top of
 * those primitives.
 */
export * from "express/assertion";

const hasKeyFactory = (object: object) => (key: string) => {
  return Object.hasOwn(object, key);
};

export const isTimePayload = (value: object): value is TimePayload => {
  if (!isObject(value)) return false;

  const has = hasKeyFactory(value);

  return has("hh") && has("mm") && has("ss");
};

export const isWeekPayload = (value: object): value is WeekPayload => {
  if (!isObject(value)) return false;

  const has = hasKeyFactory(value);

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
