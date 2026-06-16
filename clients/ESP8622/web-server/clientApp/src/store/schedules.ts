/**
 * Schedules store — daily on/off windows that drive a switch.
 * `GET /schedules` → [{ id, startTime, endTime, weekdays, isActive, digitalPin }]
 */
import { signal } from '@preact/signals';
import { api, send } from '../api/client';
import type { Schedule, ScheduleInput, ScheduleUpdate } from '../api/types';

export const schedules = signal<Schedule[]>([]);

/** Refresh the list from the device. Throws on failure (callers handle it). */
export async function refreshSchedules(): Promise<Schedule[]> {
	schedules.value = (await api<Schedule[]>('/schedules')) || [];
	return schedules.value;
}

/** "SDL:5" → 5, the numeric id the schedule PATCH/DELETE expects. */
export const scheduleNumericId = (id: string): number => Number(String(id).split(':')[1]);

export const createSchedule = (payload: ScheduleInput) => send('POST', '/schedules', payload);

export const updateSchedule = (id: string, payload: ScheduleUpdate) =>
	send('PATCH', `/schedules?id=${scheduleNumericId(id)}`, payload);

export const removeSchedule = (id: string) =>
	send('DELETE', `/schedules?id=${scheduleNumericId(id)}`);

/**
 * Disable every enabled schedule driving `pin`, so the scheduler stops
 * re-running it (used before manually stopping a scheduler-driven switch).
 */
export async function disableSchedulesForPin(pin: number): Promise<void> {
	const all = (await api<Schedule[]>('/schedules')) || [];
	const targeting = all.filter((s) => s.digitalPin === pin && s.isActive);
	for (const schedule of targeting) {
		await updateSchedule(schedule.id, { isActive: false });
	}
}
