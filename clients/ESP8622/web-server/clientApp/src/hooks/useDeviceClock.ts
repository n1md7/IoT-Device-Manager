import { useState } from 'preact/hooks';
import { deviceNow } from '../store/device';
import { useInterval } from './useInterval';

/**
 * A live `Date` anchored to the device clock, advancing once a second off the
 * browser's (actually-ticking) timer. See {@link deviceNow} for the offset.
 */
export function useDeviceClock(): Date {
	const [now, setNow] = useState(() => new Date(deviceNow()));
	useInterval(() => setNow(new Date(deviceNow())), 1000);
	return now;
}
