import { useCallback, useEffect, useState } from 'preact/hooks';
import { useMessage } from '../../hooks/useMessage';
import { useInterval } from '../../hooks/useInterval';
import { deviceNow } from '../../store/device';
import { disableSchedulesForPin } from '../../store/schedules';
import {
	getSwitch,
	refreshSwitches,
	startSwitch,
	stopSwitch,
	switches,
} from '../../store/switches';
import { clamp, formatDuration } from '../../utils/format';

const MIN_DURATION_SECONDS = 10;

/**
 * Instant-control state for the selected switch: live `active`/`stopsAt`, a
 * countdown that re-syncs when the device auto-stops, and the ON/OFF actions.
 */
export function useControl() {
	const list = switches.value;
	const { message, setMessage, clear, succeed, run } = useMessage();

	const [selectedPin, setSelectedPin] = useState<number | null>(null);
	const [minutes, setMinutes] = useState(10);
	const [seconds, setSeconds] = useState(0);
	// Bumped each second to re-render the live countdown (which reads deviceNow()).
	const [, tick] = useState(0);

	const refresh = useCallback(() => run(() => refreshSwitches().then(() => undefined)), [run]);

	// Pull fresh state on mount (Control needs live `active`/`stopsAt`).
	useEffect(() => {
		void refresh();
	}, [refresh]);

	// Keep the selection valid as the list changes, preserving the current choice.
	useEffect(() => {
		if (list.length === 0) setSelectedPin(null);
		else if (selectedPin === null || !list.some((sw) => sw.pin === selectedPin)) {
			setSelectedPin(list[0].pin);
		}
	}, [list, selectedPin]);

	const sw = selectedPin !== null ? getSwitch(selectedPin) : undefined;
	const active = !!sw?.active;
	// ON with no manual auto-off timer = the switch is being driven by a schedule.
	const scheduled = active && !sw?.stopsAt;
	const counting = active && !scheduled && !!sw?.stopsAt;

	// Manual auto-off: tick down to stopsAt; re-sync when it elapses (device auto-stops).
	useInterval(() => {
		if (!sw?.stopsAt) return;
		if (Math.round((sw.stopsAt - deviceNow()) / 1000) <= 0) void refresh();
		else tick((n) => n + 1);
	}, counting ? 1000 : null);

	// Recomputed every render — the per-second `tick` above keeps it live.
	const clockText = (() => {
		if (!active) return '00:00:00';
		if (scheduled) return 'Controlled by scheduler';
		return formatDuration(Math.round(((sw?.stopsAt ?? 0) - deviceNow()) / 1000));
	})();

	const select = useCallback(
		(pin: number) => {
			clear();
			setSelectedPin(pin);
		},
		[clear],
	);

	const turnOn = useCallback(async () => {
		if (selectedPin === null) return;
		const current = getSwitch(selectedPin);
		if (current?.active && !current.stopsAt) return; // scheduler-controlled — ignore
		const duration = clamp(minutes || 0, 0, 999) * 60 + clamp(seconds || 0, 0, 59);
		if (duration < MIN_DURATION_SECONDS) {
			setMessage({ text: `Minimum duration is ${MIN_DURATION_SECONDS} seconds.`, kind: 'err' });
			return;
		}
		clear();
		const ok = await run(async () => {
			await startSwitch(selectedPin, deviceNow() + duration * 1000);
			await refreshSwitches();
		});
		if (ok) succeed('Timer started.');
	}, [selectedPin, minutes, seconds, setMessage, clear, run, succeed]);

	const turnOff = useCallback(async () => {
		if (selectedPin === null) return;
		clear();
		const current = getSwitch(selectedPin);
		const wasScheduled = !!current?.active && !current.stopsAt;
		const ok = await run(async () => {
			// A scheduler-driven switch would be switched back on at the next tick,
			// so disable its schedule(s) first, then stop it.
			if (wasScheduled) await disableSchedulesForPin(current!.pin);
			await stopSwitch(selectedPin);
			await refreshSwitches();
		});
		if (ok) succeed(wasScheduled ? 'Schedule disabled — switch off.' : 'Turned off.');
	}, [selectedPin, clear, run, succeed]);

	return {
		list,
		selectedPin,
		select,
		minutes,
		setMinutes,
		seconds,
		setSeconds,
		active,
		scheduled,
		clockText,
		message,
		turnOn,
		turnOff,
	};
}
