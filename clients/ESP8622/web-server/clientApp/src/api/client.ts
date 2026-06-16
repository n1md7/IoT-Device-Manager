/**
 * Device API client — the single place that talks to `/api`.
 * Every endpoint is mounted under `/api` and responds with JSON; failures carry
 * the device's `{ message }` (or status text).
 */

const BASE = '/api';

/**
 * Call a device endpoint under `/api`.
 * @returns parsed JSON, or null when the response has no body (e.g. 204).
 * @throws  Error carrying the device's `{ message }` (or status text) on failure.
 */
export async function api<T>(path: string, init?: RequestInit): Promise<T | null> {
	const response = await fetch(`${BASE}${path}`, init);

	if (!response.ok) {
		const message = await response.json().then(
			(body) => (body as { message?: string }).message,
			() => null,
		);
		throw new Error(message || response.statusText || 'Request failed');
	}

	return response.json().catch(() => null) as Promise<T | null>;
}

/** Send a JSON request (or a bodiless one) and return the parsed response. */
export const send = <T>(method: string, path: string, body?: unknown): Promise<T | null> =>
	api<T>(path, {
		method,
		headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
		body: body === undefined ? undefined : JSON.stringify(body),
	});
