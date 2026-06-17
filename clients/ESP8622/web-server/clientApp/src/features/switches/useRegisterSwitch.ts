import { useCallback, useEffect, useState } from 'preact/hooks';
import { useMessage } from '../../hooks/useMessage';
import { availablePins, createSwitch, switches } from '../../store/switches';
import type { Control } from '../../api/types';
import { isValidName } from '../../utils/format';

/** Register-form state: pick a free pin + on-signal, name it, and create it.
 *  `createSwitch` appends to the store, so the list updates without a reload.
 *  `onAdded` fires only on success, so the caller can hide the form again. */
export function useRegisterSwitch(onAdded?: () => void) {
	const list = switches.value;
	const pins = availablePins();

	const [name, setName] = useState('');
	const [pin, setPin] = useState<number | ''>('');
	const [control, setControl] = useState<Control>(1);
	const [adding, setAdding] = useState(false);
	const { message, setMessage, succeed, run } = useMessage();

	// Default the pin dropdown to the first available pin as the list changes.
	useEffect(() => {
		if (pins.length === 0) setPin('');
		else if (pin === '' || !pins.includes(pin)) setPin(pins[0]);
	}, [list]);

	const add = useCallback(async () => {
		const trimmed = name.trim();
		if (!isValidName(trimmed)) {
			setMessage({ text: 'Name must be 2–16 characters.', kind: 'err' });
			return;
		}
		if (pin === '') return;
		setAdding(true);
		const ok = await run(() => createSwitch(pin, control, trimmed).then(() => undefined));
		setAdding(false);
		if (ok) {
			succeed('Switch added.');
			setName('');
			onAdded?.();
		}
	}, [name, pin, control, setMessage, succeed, run, onAdded]);

	return { name, setName, pin, setPin, control, setControl, adding, pins, message, add };
}
