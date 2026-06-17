/**
 * Conversions between the device's string schedule format and the discrete
 * fields the form edits (see `Schedule` vs `ScheduleInput` in api/types).
 */
import type { ScheduleInput, TimePayload, WeekPayload } from "@src/api/types";
import { pad, weekKeys, weekdays } from "@src/utils/format";

/** Seed a card reads its initial state from — an existing schedule or a draft. */
export interface ScheduleSeed {
  id?: number;
  digitalPin: number;
  startTime: string;
  endTime: string;
  weekdays: string;
  isActive: boolean;
}

/** "9:30:0" → "09:30" for an `<input type="time">`. */
export const toTimeInput = (value: string): string => {
  const [hh = 0, mm = 0] = String(value || "")
    .split(":")
    .map(Number);

  return `${pad(hh)}:${pad(mm)}`;
};

/** "09:30" → { hh, mm, ss: 0 } payload. */
export const toTimePayload = (value: string): TimePayload => {
  const [hh = 0, mm = 0] = String(value || "")
    .split(":")
    .map(Number);

  return { hh, mm, ss: 0 };
};

/** "0:1:1:0:0:0:0" → Set of active day indexes. */
export const activeDays = (days: string): Set<number> => {
  const bits = String(days || "")
    .split(":")
    .map(Number);

  return new Set(
    weekdays.map((_, day) => day).filter((day) => bits[day] === 1),
  );
};

/** Set of active day indexes → the `WeekPayload` mask. */
export const toWeekPayload = (days: Set<number>): WeekPayload => {
  return weekKeys.reduce((payload, key, day) => {
    payload[key] = days.has(day) ? 1 : 0;

    return payload;
  }, {} as WeekPayload);
};

/** Assemble the form fields into a `POST`/`PATCH` body. */
export const toScheduleInput = (fields: {
  pin: number;
  start: string;
  end: string;
  days: Set<number>;
  enabled: boolean;
}): ScheduleInput => ({
  isActive: fields.enabled,
  startTime: toTimePayload(fields.start),
  endTime: toTimePayload(fields.end),
  weekdays: toWeekPayload(fields.days),
  controlPin: fields.pin,
});
