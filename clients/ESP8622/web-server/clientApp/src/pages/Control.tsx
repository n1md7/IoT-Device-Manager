import { useEffect, useState } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import { Message, noMessage, type MessageState } from '../components/Message';
import { deviceNow } from '../store/device';
import { disableSchedulesForPin } from '../store/schedules';
import {
	getSwitch,
	refreshSwitches,
	startSwitch,
	stopSwitch,
	switches,
} from '../store/switches';
import { clamp, formatDuration, switchLabel } from '../utils/format';

/**
 * Control page — instant ON/OFF for a selected switch, with a live countdown
 * driven by the server's `stopsAt`.
 */
export function Control() {
	const list = switches.value;
	const { route } = useLocation();

	const [selectedPin, setSelectedPin] = useState<number | null>(null);
	const [minutes, setMinutes] = useState(10);
	const [seconds, setSeconds] = useState(0);
	const [message, setMessage] = useState<MessageState>(noMessage);
	const [, forceTick] = useState(0);

	const refresh = async () => {
		try {
			await refreshSwitches();
		} catch (error) {
			setMessage({ text: (error as Error).message, kind: 'err' });
		}
	};

	// Pull fresh state on mount (Control needs live `active`/`stopsAt`).
	useEffect(() => {
		void refresh();
	}, []);

	// Keep the selection valid as the list changes, preserving the current choice.
	useEffect(() => {
		if (list.length === 0) {
			setSelectedPin(null);
		} else if (selectedPin === null || !list.some((sw) => sw.pin === selectedPin)) {
			setSelectedPin(list[0].pin);
		}
	}, [list]);

	const sw = selectedPin !== null ? getSwitch(selectedPin) : undefined;
	const active = !!sw?.active;
	// ON with no manual auto-off timer = the switch is being driven by a schedule.
	const scheduled = active && !sw?.stopsAt;

	// Manual auto-off: count down to stopsAt; re-sync when it elapses (device auto-stops).
	useEffect(() => {
		if (!active || scheduled || !sw?.stopsAt) return;
		const ticker = setInterval(() => {
			if (Math.round((sw.stopsAt! - deviceNow()) / 1000) <= 0) void refresh();
			else forceTick((n) => n + 1);
		}, 1000);
		return () => clearInterval(ticker);
	}, [active, scheduled, sw?.stopsAt]);

	const clockText = (() => {
		if (!active) return '00:00:00';
		if (scheduled) return 'Controlled by scheduler';
		return formatDuration(Math.round(((sw?.stopsAt ?? 0) - deviceNow()) / 1000));
	})();

	const turnOn = async () => {
		if (selectedPin === null) return;
		const current = getSwitch(selectedPin);
		if (current?.active && !current.stopsAt) return; // scheduler-controlled — ignore
		const duration = clamp(minutes || 0, 0, 999) * 60 + clamp(seconds || 0, 0, 59);
		if (duration < 10) {
			setMessage({ text: 'Minimum duration is 10 seconds.', kind: 'err' });
			return;
		}
		setMessage(noMessage);
		try {
			await startSwitch(selectedPin, deviceNow() + duration * 1000);
			await refresh();
			setMessage({ text: 'Timer started.', kind: 'ok' });
		} catch (error) {
			setMessage({ text: (error as Error).message, kind: 'err' });
		}
	};

	const turnOff = async () => {
		if (selectedPin === null) return;
		setMessage(noMessage);
		const current = getSwitch(selectedPin);
		const wasScheduled = !!current?.active && !current.stopsAt;
		try {
			// A scheduler-driven switch would be switched back on at the next tick,
			// so disable its schedule(s) first, then stop it.
			if (wasScheduled) await disableSchedulesForPin(current!.pin);
			await stopSwitch(selectedPin);
			await refresh();
			setMessage({
				text: wasScheduled ? 'Schedule disabled — switch off.' : 'Turned off.',
				kind: 'ok',
			});
		} catch (error) {
			setMessage({ text: (error as Error).message, kind: 'err' });
		}
	};

	if (list.length === 0) {
		return (
			<section>
				<div class="card empty">
					<h2>No switches yet</h2>
					<p>Register a switch (a digital pin) before you can drive it.</p>
					<button class="action" type="button" onClick={() => route('/switches')}>
						Create a switch
					</button>
				</div>
			</section>
		);
	}

	return (
		<section>
			<div class="card">
				<h2>Instant control</h2>
				<div class="field">
					<label for="ctlSelect">Switch</label>
					<select
						id="ctlSelect"
						value={selectedPin ?? undefined}
						onChange={(event) => {
							setMessage(noMessage);
							setSelectedPin(Number(event.currentTarget.value));
						}}
					>
						{list.map((option) => (
							<option key={option.pin} value={option.pin}>
								{switchLabel(option)}
							</option>
						))}
					</select>
				</div>

				<div class="status-line">
					Status: <span class={`pill ${active ? 'on' : 'off'}`}>{active ? 'ON' : 'OFF'}</span>
				</div>
				<div class={`clock ${scheduled ? 'small' : ''}`.trim()}>{clockText}</div>

				{!active && (
					<div>
						<div class="row field">
							<div>
								<label for="ctlMin">Minutes</label>
								<input
									type="number"
									id="ctlMin"
									min={0}
									max={999}
									value={minutes}
									onInput={(event) => setMinutes(Number(event.currentTarget.value))}
								/>
							</div>
							<div>
								<label for="ctlSec">Seconds</label>
								<input
									type="number"
									id="ctlSec"
									min={0}
									max={59}
									value={seconds}
									onInput={(event) => setSeconds(Number(event.currentTarget.value))}
								/>
							</div>
						</div>
						<p class="muted">
							Minimum duration is 10 seconds. The device turns the switch off automatically when
							it elapses.
						</p>
					</div>
				)}

				<div class="btns">
					<button class="action" type="button" disabled={scheduled} onClick={turnOn}>
						Turn ON
					</button>
					<button class="action danger" type="button" onClick={turnOff}>
						{scheduled ? 'Stop & disable schedule' : 'Turn OFF'}
					</button>
				</div>
				{scheduled && (
					<p class="muted">
						Controlled by a schedule. Pressing Stop disables that schedule and turns the switch
						off.
					</p>
				)}
				<Message {...message} />
			</div>
		</section>
	);
}
