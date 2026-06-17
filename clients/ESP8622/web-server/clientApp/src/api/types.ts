/**
 * Shared API types, mirroring the device's REST contract (see docs/rest.yaml).
 * Note: schedules serialize times/weekdays as strings on read, but create/update
 * accept them as discrete-field objects.
 */

/** Control signal written to drive a switch ON — 0 (LOW) or 1 (HIGH). */
export type Control = 0 | 1;

/** A switch as returned by `GET /switches`. */
export interface Switch {
	/** Digital pin number, also the switch identifier. */
	pin: number;
	name: string;
	control: Control;
	/** Whether the switch is currently driven on. */
	active: boolean;
	/** Epoch ms when a manual auto-off fires, or null (off / schedule-driven). */
	stopsAt: number | null;
}

/** Build-time device identity plus the current device clock. */
export interface DeviceInfo {
	name?: string;
	code?: string;
	version?: string;
	description?: string;
	/** Current device time as epoch ms — used to anchor the UI clock. */
	timestamp?: number;
}

/** A schedule as returned by `GET /schedules` (times/weekdays as strings). */
export interface Schedule {
	/** Numeric schedule identifier. */
	id: number;
	/** Start of the window, "hh:mm:ss". */
	startTime: string;
	/** End of the window, "hh:mm:ss". */
	endTime: string;
	/** Active-weekday mask "sun:mon:tue:wed:thu:fri:sat". */
	weekdays: string;
	isActive: boolean;
	/** Pin of the switch this schedule drives. */
	digitalPin: number;
}

/** Time of day as discrete fields (24-hour clock). */
export interface TimePayload {
	hh: number;
	mm: number;
	ss: number;
}

/** Active-weekday mask, Sunday-first (matches JS `Date.getDay()`). */
export interface WeekPayload {
	sun: Control;
	mon: Control;
	tue: Control;
	wed: Control;
	thu: Control;
	fri: Control;
	sat: Control;
}

/** Body for `POST /schedules`. */
export interface ScheduleInput {
	isActive: boolean;
	startTime: TimePayload;
	endTime: TimePayload;
	weekdays: WeekPayload;
	controlPin: number;
}

/** Body for `PATCH /schedules` — every field optional. */
export type ScheduleUpdate = Partial<ScheduleInput>;
