import { Message } from '../../components/Message';
import type { Control } from '../../api/types';
import { useRegisterSwitch } from './useRegisterSwitch';

/** Form to register a new switch on one of the free digital pins. */
export function RegisterSwitchForm({ onAdded }: { onAdded?: () => void }) {
	const { name, setName, pin, setPin, control, setControl, adding, pins, message, add } =
		useRegisterSwitch(onAdded);
	const allRegistered = pins.length === 0;

	return (
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
						disabled={allRegistered}
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
				<button class="action" type="button" disabled={adding || allRegistered} onClick={add}>
					Add switch
				</button>
			</div>
			<Message {...(allRegistered ? { text: 'All pins are registered.', kind: '' } : message)} />
		</div>
	);
}
