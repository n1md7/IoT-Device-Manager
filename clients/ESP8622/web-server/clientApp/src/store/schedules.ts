/**
 * Schedules store — daily on/off windows that drive a switch.
 * `GET /schedules` → [{ id, startTime, endTime, weekdays, isActive, digitalPin }]
 */
import { signal } from "@preact/signals";
import { api, send } from "../api/client";
import type {
  Schedule,
  ScheduleInput,
  ScheduleUpdate,
  TimePayload,
  WeekPayload,
} from "../api/types";
import { weekKeys } from "../utils/format";

export const schedules = signal<Schedule[]>([]);

/** Refresh the list from the device. Throws on failure (callers handle it). */
export async function refreshSchedules(): Promise<Schedule[]> {
  schedules.value = (await api<Schedule[]>("/schedules")) || [];
  return schedules.value;
}

/** Map an update payload's discrete fields back onto the stored string shape
 *  (the inverse of the form mappers), so a PATCH can update the store locally. */
const timeToString = (time: TimePayload): string =>
  `${time.hh}:${time.mm}:${time.ss}`;
const weekToString = (week: WeekPayload): string =>
  weekKeys.map((key) => week[key]).join(":");

const toStoredFields = (update: ScheduleUpdate): Partial<Schedule> => {
  const fields: Partial<Schedule> = {};
  if (update.isActive !== undefined) fields.isActive = update.isActive;
  if (update.controlPin !== undefined) fields.digitalPin = update.controlPin;
  if (update.startTime) fields.startTime = timeToString(update.startTime);
  if (update.endTime) fields.endTime = timeToString(update.endTime);
  if (update.weekdays) fields.weekdays = weekToString(update.weekdays);
  return fields;
};

/** Create a schedule. The device returns the created `Schedule`, which we append
 *  to the store — no refetch needed. */
export async function createSchedule(
  payload: ScheduleInput,
): Promise<Schedule | null> {
  const created = await send<Schedule>("POST", "/schedules", payload);
  if (created) schedules.value = [...schedules.value, created];
  return created;
}

/** Update a schedule. The device returns no body, so we merge the fields we just
 *  sent into the store (the 2xx confirms success). */
export async function updateSchedule(
  id: number,
  payload: ScheduleUpdate,
): Promise<void> {
  await send("PATCH", `/schedules?id=${id}`, payload);
  const fields = toStoredFields(payload);
  schedules.value = schedules.value.map((s) =>
    s.id === id ? { ...s, ...fields } : s,
  );
}

export async function removeSchedule(id: number): Promise<void> {
  await send("DELETE", `/schedules?id=${id}`);
  schedules.value = schedules.value.filter((s) => s.id !== id);
}

/**
 * Disable every enabled schedule driving `pin`, so the scheduler stops
 * re-running it (used before manually stopping a scheduler-driven switch).
 */
export async function disableSchedulesForPin(pin: number): Promise<void> {
  const all = (await api<Schedule[]>("/schedules")) || [];
  const targeting = all.filter((s) => s.digitalPin === pin && s.isActive);
  for (const schedule of targeting) {
    await updateSchedule(schedule.id, { isActive: false });
  }
}
