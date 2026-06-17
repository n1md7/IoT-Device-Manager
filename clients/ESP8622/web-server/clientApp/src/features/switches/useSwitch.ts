import { useCallback, useState } from 'preact/hooks';
import { useMessage } from '../../hooks/useMessage';
import { confirm } from '../../store/modal';
import { removeSwitch, updateSwitch } from '../../store/switches';
import type { Control, Switch } from '../../api/types';
import { isValidName } from '../../utils/format';

/** Edit-form state for a single switch card: rename, change on-signal, remove.
 *  Both actions mutate the `switches` store in place — no reload. */
export function useSwitch(sw: Switch) {
	const [name, setName] = useState(sw.name || '');
	const [control, setControl] = useState<Control>(sw.control);
	const { message, setMessage, succeed, run } = useMessage();

	const save = useCallback(async () => {
		const trimmed = name.trim();
		if (!isValidName(trimmed)) {
			setMessage({ text: 'Name must be 2–16 characters.', kind: 'err' });
			return;
		}
		const ok = await run(() => updateSwitch(sw.pin, control, trimmed));
		if (ok) succeed('Saved.');
	}, [name, control, sw.pin, setMessage, succeed, run]);

	const remove = useCallback(async () => {
		const confirmed = await confirm(`Pin D${sw.pin} will be unregistered.`, {
			heading: `Remove switch D${sw.pin}?`,
			okText: 'Remove',
		});
		if (!confirmed) return;
		await run(() => removeSwitch(sw.pin));
	}, [sw.pin, run]);

	return { name, setName, control, setControl, message, save, remove };
}
