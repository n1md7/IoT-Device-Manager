import { Message } from '../../components/Message';
import { switches } from '../../store/switches';
import { switchLabel, WEEKDAYS } from '../../utils/format';
import type { ScheduleSeed } from './mappers';
import { useSchedule } from './useSchedule';

/** An editable schedule card — creates a new schedule or edits an existing one. */
export function ScheduleCard({
	seed,
	onChanged,
}: {
	seed: ScheduleSeed;
	onChanged?: () => void;
}) {
	const {
		isNew,
		pin,
		setPin,
		start,
		setStart,
		end,
		setEnd,
		days,
		toggleDay,
		enabled,
		setEnabled,
		message,
		save,
		remove,
	} = useSchedule(seed, onChanged);
	const list = switches.value;

	return (
		<div class={`card schedule ${enabled ? 'schedule-on' : 'schedule-off'}`}>
			<h2>
				{isNew ? 'New schedule' : `Schedule ${seed.id}`}{' '}
				<span class={`badge ${enabled ? 'badge-on' : 'badge-off'}`}>
					{enabled ? 'Enabled' : 'Disabled'}
				</span>
			</h2>
			<div class="field">
				<label>Switch</label>
				<select value={pin} onChange={(event) => setPin(Number(event.currentTarget.value))}>
					{list.map((sw) => (
						<option key={sw.pin} value={sw.pin}>
							{switchLabel(sw)}
						</option>
					))}
				</select>
			</div>
			<div class="row field">
				<div>
					<label>Start time</label>
					<input type="time" value={start} onInput={(event) => setStart(event.currentTarget.value)} />
				</div>
				<div>
					<label>End time</label>
					<input type="time" value={end} onInput={(event) => setEnd(event.currentTarget.value)} />
				</div>
			</div>
			<label>Repeat on</label>
			<div class="days">
				{WEEKDAYS.map((dayLabel, day) => (
					<label key={day}>
						<input type="checkbox" checked={days.has(day)} onChange={() => toggleDay(day)} />
						<span>{dayLabel}</span>
					</label>
				))}
			</div>
			<div class="switch field">
				<input
					type="checkbox"
					checked={enabled}
					onChange={(event) => setEnabled(event.currentTarget.checked)}
				/>
				<label style={{ margin: 0 }}>Enabled</label>
			</div>
			<div class="card-actions">
				<button class="action" type="button" onClick={save}>
					{isNew ? 'Create' : 'Save'}
				</button>
				{!isNew && (
					<button class="btn-remove" type="button" onClick={remove}>
						Remove
					</button>
				)}
			</div>
			<Message {...message} />
		</div>
	);
}
