/** Small formatting + date helpers shared across pages. */

import type { Switch } from '../api/types';

export const pad = (value: number): string => String(value).padStart(2, '0');

export const clamp = (value: number, min: number, max: number): number =>
	Math.min(max, Math.max(min, value));

/** 0=Sun, matching `Date.getDay()`. */
export const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
/** Matches the `WeekPayload` keys (Sunday-first). */
export const WEEK_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;
export const MONTHS = [
	'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
	'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
] as const;

/** Seconds → "HH:MM:SS" (never negative). */
export const formatDuration = (totalSeconds: number): string => {
	const seconds = Math.max(0, totalSeconds | 0);
	return [seconds / 3600, (seconds / 60) % 60, seconds % 60]
		.map((part) => pad(part | 0))
		.join(':');
};

/** Human label for a switch: "Garden Pump (D2)", falling back to "Pin D2". */
export const switchLabel = (sw?: Pick<Switch, 'name' | 'pin'>): string =>
	sw && sw.name ? `${sw.name} (D${sw.pin})` : `Pin D${sw ? sw.pin : '?'}`;
