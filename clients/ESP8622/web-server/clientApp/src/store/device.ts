/**
 * Device store — identity + a device-anchored clock.
 *
 * The device exposes its time via `GET /device.timestamp`. We measure the
 * device↔browser gap once and then tick off the (actually-advancing) browser
 * clock, so the display stays live and aligned to the device. Identity is
 * static, so it's fetched only once per session (no refetch on navigation).
 */
import { signal } from '@preact/signals';
import { api } from '../api/client';
import type { DeviceInfo } from '../api/types';

export const device = signal<DeviceInfo | null>(null);
/** True once a `/device` fetch has failed — the clock falls back to browser time. */
export const deviceOffline = signal(false);

let clockOffset = 0;
/** Current device time as epoch ms. */
export const deviceNow = (): number => Date.now() + clockOffset;

let loaded = false;

/** Fetch device identity once and anchor the clock; safe to call repeatedly. */
export async function loadDevice(): Promise<void> {
	if (loaded) return;
	loaded = true;
	try {
		const info = await api<DeviceInfo>('/device');
		device.value = info;
		deviceOffline.value = false;
		if (info && typeof info.timestamp === 'number') {
			clockOffset = info.timestamp - Date.now();
		}
	} catch {
		// Device unreachable: fall back to plain browser time so the clock still ticks.
		clockOffset = 0;
		deviceOffline.value = true;
		loaded = false; // allow a later retry
	}
}
