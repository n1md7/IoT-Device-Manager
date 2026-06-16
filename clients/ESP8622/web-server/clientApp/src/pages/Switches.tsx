import { useEffect, useState } from 'preact/hooks';
import { Message, noMessage, type MessageState } from '../components/Message';
import { confirm } from '../store/modal';
import {
	availablePins,
	createSwitch,
	refreshSwitches,
	removeSwitch,
	switches,
	updateSwitch,
} from '../store/switches';
import type { Control, Switch } from '../api/types';
import { switchLabel } from '../utils/format';

const isValidName = (name: string) => name.length >= 2 && name.length <= 16;

/** One configurable switch: rename, change on-signal, or remove. */
function SwitchCard({ sw, reload }: { sw: Switch; reload: () => void }) {
	const [name, setName] = useState(sw.name || '');
	const [control, setControl] = useState<Control>(sw.control);
	const [message, setMessage] = useState<MessageState>(noMessage);

	const save = async () => {
		const trimmed = name.trim();
		if (!isValidName(trimmed)) {
			setMessage({ text: 'Name must be 2–16 characters.', kind: 'err' });
			return;
		}
		try {
			await updateSwitch(sw.pin, control, trimmed);
			setMessage({ text: 'Saved.', kind: 'ok' });
			reload();
		} catch (error) {
			setMessage({ text: (error as Error).message, kind: 'err' });
		}
	};

	const remove = async () => {
		const ok = await confirm(`Pin D${sw.pin} will be unregistered.`, {
			heading: `Remove switch D${sw.pin}?`,
			okText: 'Remove',
		});
		if (!ok) return;
		try {
			await removeSwitch(sw.pin);
			reload();
		} catch (error) {
			setMessage({ text: (error as Error).message, kind: 'err' });
		}
	};

	return (
		<div class="card">
			<h2>
				{switchLabel(sw)}{' '}
				<span class={`badge ${sw.active ? 'badge-on' : 'badge-off'}`}>
					{sw.active ? 'ON' : 'OFF'}
				</span>
			</h2>
			<div class="field">
				<label>Name</label>
				<input
					type="text"
					maxLength={16}
					placeholder="e.g. Garden Pump"
					value={name}
					onInput={(event) => setName(event.currentTarget.value)}
				/>
			</div>
			<div class="field">
				<label>On signal</label>
				<select
					value={control}
					onChange={(event) => setControl(Number(event.currentTarget.value) as Control)}
				>
					<option value={1}>HIGH (1)</option>
					<option value={0}>LOW (0)</option>
				</select>
			</div>
			<div class="card-actions">
				<button class="action" type="button" onClick={save}>
					Save
				</button>
				<button class="btn-remove" type="button" onClick={remove}>
					Remove
				</button>
			</div>
			<Message {...message} />
		</div>
	);
}

/** Switches page — register / configure / remove switches. */
export function Switches() {
	const list = switches.value;
	const [loading, setLoading] = useState(true);
	const [listMessage, setListMessage] = useState<MessageState>(noMessage);

	// Register-form state.
	const [name, setName] = useState('');
	const [pin, setPin] = useState<number | ''>('');
	const [control, setControl] = useState<Control>(1);
	const [addMessage, setAddMessage] = useState<MessageState>(noMessage);
	const [adding, setAdding] = useState(false);

	const pins = availablePins();

	const load = async () => {
		setListMessage(noMessage);
		setLoading(true);
		try {
			await refreshSwitches();
		} catch (error) {
			setListMessage({ text: (error as Error).message, kind: 'err' });
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		void load();
	}, []);

	// Default the pin dropdown to the first available pin.
	useEffect(() => {
		if (pins.length === 0) setPin('');
		else if (pin === '' || !pins.includes(pin)) setPin(pins[0]);
	}, [list]);

	const add = async () => {
		const trimmed = name.trim();
		if (!isValidName(trimmed)) {
			setAddMessage({ text: 'Name must be 2–16 characters.', kind: 'err' });
			return;
		}
		if (pin === '') return;
		setAdding(true);
		try {
			await createSwitch(pin, control, trimmed);
			setAddMessage({ text: 'Switch added.', kind: 'ok' });
			setName('');
			await load();
		} catch (error) {
			setAddMessage({ text: (error as Error).message, kind: 'err' });
		} finally {
			setAdding(false);
		}
	};

	return (
		<section>
			<Message {...listMessage} />

			{loading ? (
				<div class="card muted">Loading switches…</div>
			) : list.length === 0 ? (
				<div class="card muted">No switches registered yet. Add one below.</div>
			) : (
				list.map((sw) => <SwitchCard key={sw.pin} sw={sw} reload={load} />)
			)}

			<div class="card">
				<h2>Register a switch</h2>
				<div class="field">
					<label for="swName">Name</label>
					<input
						type="text"
						id="swName"
						maxLength={16}
						placeholder="e.g. Garden Pump"
						value={name}
						onInput={(event) => setName(event.currentTarget.value)}
					/>
				</div>
				<div class="row field">
					<div>
						<label for="swPin">Digital pin</label>
						<select
							id="swPin"
							value={pin === '' ? undefined : pin}
							disabled={pins.length === 0}
							onChange={(event) => setPin(Number(event.currentTarget.value))}
						>
							{pins.map((available) => (
								<option key={available} value={available}>
									D{available}
								</option>
							))}
						</select>
					</div>
					<div>
						<label for="swSignal">On signal</label>
						<select
							id="swSignal"
							value={control}
							onChange={(event) => setControl(Number(event.currentTarget.value) as Control)}
						>
							<option value={1}>HIGH (1)</option>
							<option value={0}>LOW (0)</option>
						</select>
					</div>
				</div>
				<p class="hint muted">
					The "on signal" is the level written to drive the switch ON. Some relays and the D2
					built-in LED are active-LOW.
				</p>
				<div class="btns">
					<button class="action" type="button" disabled={adding || pins.length === 0} onClick={add}>
						Add switch
					</button>
				</div>
				<Message
					{...(pins.length === 0 ? { text: 'All pins are registered.', kind: '' } : addMessage)}
				/>
			</div>
		</section>
	);
}
