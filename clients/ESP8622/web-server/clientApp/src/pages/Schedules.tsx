import { useEffect, useState } from 'preact/hooks';
import { Message, noMessage, type MessageState } from '../components/Message';
import { confirm } from '../store/modal';
import {
	createSchedule,
	refreshSchedules,
	removeSchedule,
	schedules,
	updateSchedule,
} from '../store/schedules';
import { ensureSwitches, registeredPins, switches } from '../store/switches';
import type { ScheduleInput, TimePayload, WeekPayload } from '../api/types';
import { pad, switchLabel, WEEK_KEYS, WEEKDAYS } from '../utils/format';

/** Seed a card reads its initial state from — an existing schedule or a draft. */
interface ScheduleSeed {
	id?: number;
	digitalPin: number;
	startTime: string;
	endTime: string;
	weekdays: string;
	isActive: boolean;
}

/** "9:30:0" → "09:30" for an <input type="time">. */
const toTimeInput = (value: string): string => {
	const [hh = 0, mm = 0] = String(value || '').split(':').map(Number);
	return `${pad(hh)}:${pad(mm)}`;
};
/** "09:30" → { hh, mm, ss: 0 } payload. */
const toTimePayload = (value: string): TimePayload => {
	const [hh = 0, mm = 0] = String(value || '').split(':').map(Number);
	return { hh, mm, ss: 0 };
};
/** "0:1:1:0:0:0:0" → Set of active day indexes. */
const activeDays = (weekdays: string): Set<number> => {
	const bits = String(weekdays || '').split(':').map(Number);
	return new Set(WEEKDAYS.map((_, day) => day).filter((day) => bits[day] === 1));
};

/** An editable schedule card — creates a new schedule or edits an existing one. */
function ScheduleCard({
	seed,
	onChanged,
}: {
	seed: ScheduleSeed;
	onChanged: () => void;
}) {
	const isNew = seed.id === undefined;
	const [pin, setPin] = useState(seed.digitalPin);
	const [start, setStart] = useState(toTimeInput(seed.startTime));
	const [end, setEnd] = useState(toTimeInput(seed.endTime));
	const [days, setDays] = useState<Set<number>>(() => activeDays(seed.weekdays));
	const [enabled, setEnabled] = useState(seed.isActive);
	const [message, setMessage] = useState<MessageState>(noMessage);

	const toggleDay = (day: number) => {
		setDays((prev) => {
			const next = new Set(prev);
			next.has(day) ? next.delete(day) : next.add(day);
			return next;
		});
	};

	const buildPayload = (): ScheduleInput => {
		const weekdays = {} as WeekPayload;
		WEEK_KEYS.forEach((key, day) => {
			weekdays[key] = days.has(day) ? 1 : 0;
		});
		return {
			isActive: enabled,
			startTime: toTimePayload(start),
			endTime: toTimePayload(end),
			weekdays,
			controlPin: pin,
		};
	};

	const save = async () => {
		try {
			if (isNew) await createSchedule(buildPayload());
			else await updateSchedule(seed.id!, buildPayload());
			onChanged();
		} catch (error) {
			setMessage({ text: (error as Error).message, kind: 'err' });
		}
	};

	const remove = async () => {
		const ok = await confirm(`Schedule ${seed.id} will be permanently removed.`, {
			heading: `Remove schedule ${seed.id}?`,
			okText: 'Remove',
		});
		if (!ok) return;
		try {
			await removeSchedule(seed.id!);
			onChanged();
		} catch (error) {
			setMessage({ text: (error as Error).message, kind: 'err' });
		}
	};

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
					<input
						type="time"
						value={start}
						onInput={(event) => setStart(event.currentTarget.value)}
					/>
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

/** Schedules page — daily on/off windows that drive a switch. */
export function Schedules() {
	const list = schedules.value;
	const pins = registeredPins();
	const [loading, setLoading] = useState(true);
	const [pageMessage, setPageMessage] = useState<MessageState>(noMessage);
	// Unsaved "new schedule" cards, identified by a local key.
	const [drafts, setDrafts] = useState<number[]>([]);
	const [draftSeq, setDraftSeq] = useState(0);

	const load = async () => {
		setPageMessage(noMessage);
		setLoading(true);
		try {
			// Schedules reference a switch pin, so we need the switch list too —
			// reuse it from the store when already loaded.
			await ensureSwitches();
			await refreshSchedules();
		} catch (error) {
			setPageMessage({ text: (error as Error).message, kind: 'err' });
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		void load();
	}, []);

	const addDraft = () => {
		setDrafts((prev) => [...prev, draftSeq]);
		setDraftSeq((n) => n + 1);
	};

	const removeDraft = (key: number) => setDrafts((prev) => prev.filter((k) => k !== key));

	const onExistingChanged = () => void load();

	if (loading) {
		return (
			<section>
				<div class="card muted">Loading schedules…</div>
			</section>
		);
	}

	if (pins.length === 0) {
		return (
			<section>
				<Message {...pageMessage} />
				<div class="card muted">
					Register a switch first — a schedule needs a switch to drive.
				</div>
			</section>
		);
	}

	const draftSeed = (): ScheduleSeed => ({
		digitalPin: pins[0],
		startTime: '08:00:0',
		endTime: '09:00:0',
		weekdays: '0:0:0:0:0:0:0',
		isActive: true,
	});

	return (
		<section>
			<Message {...pageMessage} />

			{list.length === 0 && drafts.length === 0 && (
				<div class="card muted">No schedules yet. Add one below.</div>
			)}

			{list.map((schedule) => (
				<ScheduleCard key={schedule.id} seed={schedule} onChanged={onExistingChanged} />
			))}

			{drafts.map((key) => (
				<ScheduleCard
					key={`draft-${key}`}
					seed={draftSeed()}
					onChanged={() => {
						removeDraft(key);
						void load();
					}}
				/>
			))}

			<button class="action ghost" type="button" style={{ width: '100%' }} onClick={addDraft}>
				+ Add schedule
			</button>
		</section>
	);
}
