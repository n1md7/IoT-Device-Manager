import { useCallback, useState } from 'preact/hooks';
import { useMessage } from '../../hooks/useMessage';
import { useSaveStatus } from '../../hooks/useSaveStatus';
import { confirm } from '../../store/modal';
import { createSchedule, removeSchedule, updateSchedule } from '../../store/schedules';
import { activeDays, toScheduleInput, toTimeInput, type ScheduleSeed } from './mappers';

const sameDays = (a: Set<number>, b: Set<number>): boolean =>
	a.size === b.size && [...a].every((day) => b.has(day));

/**
 * Edit-form state for a single schedule card. Create/update/remove mutate the
 * `schedules` store in place; `onChanged` only fires on success so a draft card
 * can clear its placeholder.
 */
export function useSchedule(seed: ScheduleSeed, onChanged?: () => void) {
	const isNew = seed.id === undefined;

	const [pin, setPin] = useState(seed.digitalPin);
	const [start, setStart] = useState(() => toTimeInput(seed.startTime));
	const [end, setEnd] = useState(() => toTimeInput(seed.endTime));
	const [days, setDays] = useState<Set<number>>(() => activeDays(seed.weekdays));
	const [enabled, setEnabled] = useState(seed.isActive);
	const { message, run } = useMessage();

	// A draft is always "unsaved"; an existing card is dirty once any field differs.
	const dirty =
		isNew ||
		pin !== seed.digitalPin ||
		start !== toTimeInput(seed.startTime) ||
		end !== toTimeInput(seed.endTime) ||
		enabled !== seed.isActive ||
		!sameDays(days, activeDays(seed.weekdays));
	const { status, saving, track } = useSaveStatus(dirty);

	const toggleDay = useCallback((day: number) => {
		setDays((prev) => {
			const next = new Set(prev);
			next.has(day) ? next.delete(day) : next.add(day);
			return next;
		});
	}, []);

	const save = useCallback(async () => {
		const payload = toScheduleInput({ pin, start, end, days, enabled });
		const ok = await track(() =>
			run(() =>
				(isNew ? createSchedule(payload) : updateSchedule(seed.id!, payload)).then(() => undefined),
			),
		);
		if (ok) onChanged?.();
	}, [pin, start, end, days, enabled, isNew, seed.id, run, track, onChanged]);

	const remove = useCallback(async () => {
		const confirmed = await confirm(`Schedule ${seed.id} will be permanently removed.`, {
			heading: `Remove schedule ${seed.id}?`,
			okText: 'Remove',
		});
		if (!confirmed) return;
		const ok = await run(() => removeSchedule(seed.id!).then(() => undefined));
		if (ok) onChanged?.();
	}, [seed.id, run, onChanged]);

	return {
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
		status,
		saving,
		dirty,
		save,
		remove,
	};
}
