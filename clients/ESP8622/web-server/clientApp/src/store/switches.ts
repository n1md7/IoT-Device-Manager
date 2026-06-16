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

export const createSwitch = (digitalPin: number, control: Control, name: string) =>
	send('POST', '/switches', { digitalPin, control, name });

export const updateSwitch = (pin: number, control: Control, name: string) =>
	send('PATCH', `/switches?pin=${pin}`, { control, name });

export const removeSwitch = (pin: number) => send('DELETE', `/switches?pin=${pin}`);

export const startSwitch = (digitalPin: number, stopAt: number) =>
	send('POST', '/switches/control', { digitalPin, action: 'Start', stopAt });

export const stopSwitch = (digitalPin: number) =>
	send('POST', '/switches/control', { digitalPin, action: 'Stop' });
