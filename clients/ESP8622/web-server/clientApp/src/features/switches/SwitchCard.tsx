import { Message } from '../../components/Message';
import type { Control, Switch } from '../../api/types';
import { switchLabel } from '../../utils/format';
import { useSwitch } from './useSwitch';

/** One configurable switch: rename, change on-signal, or remove. */
export function SwitchCard({ sw }: { sw: Switch }) {
	const { name, setName, control, setControl, message, save, remove } = useSwitch(sw);

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
