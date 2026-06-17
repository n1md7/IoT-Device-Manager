/**
 * Switches store — the single source of truth for "what pins are registered".
 * Shared by the Control, Switches and Schedules pages so a switch list fetched
 * by one page can be reused by another without re-fetching.
 */
import { signal } from '@preact/signals';
import { api, send } from '../api/client';
import type { Control, Switch } from '../api/types';

const ALL_PINS = [1, 2, 3, 4, 5, 6, 7, 8];

export const switches = signal<Switch[]>([]);

export const getSwitch = (pin: number): Switch | undefined =>
	switches.value.find((sw) => sw.pin === pin);

export const registeredPins = (): number[] => switches.value.map((sw) => sw.pin);

export const availablePins = (): number[] =>
	ALL_PINS.filter((pin) => !registeredPins().includes(pin));

/** Refresh the list from the device. Throws on failure (callers handle it). */
export async function refreshSwitches(): Promise<Switch[]> {
	switches.value = (await api<Switch[]>('/switches')) || [];
	return switches.value;
}

/**
 * Ensure switches are loaded without forcing a network round-trip when we
 * already have them (used by pages that only need the list for labels).
 */
export async function ensureSwitches(): Promise<Switch[]> {
	if (switches.value.length > 0) return switches.value;
	return refreshSwitches();
}

/** Register a switch. The device returns the created `Switch`, which we append
 *  to the store — no refetch needed. */
export async function createSwitch(
	digitalPin: number,
	control: Control,
	name: string,
): Promise<Switch | null> {
	const created = await send<Switch>('POST', '/switches', { digitalPin, control, name });
	if (created) switches.value = [...switches.value, created];
	return created;
}

/** Update a switch's control/name. The device returns no body, so we apply the
 *  fields we just sent (the 2xx confirms success). */
export async function updateSwitch(pin: number, control: Control, name: string): Promise<void> {
	await send('PATCH', `/switches?pin=${pin}`, { control, name });
	switches.value = switches.value.map((sw) => (sw.pin === pin ? { ...sw, control, name } : sw));
}

export async function removeSwitch(pin: number): Promise<void> {
	await send('DELETE', `/switches?pin=${pin}`);
	switches.value = switches.value.filter((sw) => sw.pin !== pin);
}

export const startSwitch = (digitalPin: number, stopAt: number) =>
	send('POST', '/switches/control', { digitalPin, action: 'Start', stopAt });

export const stopSwitch = (digitalPin: number) =>
	send('POST', '/switches/control', { digitalPin, action: 'Stop' });
