import { useState } from 'preact/hooks';
import { Message } from '../../components/Message';
import { SaveStatusBadge } from '../../components/SaveStatusBadge';
import type { Control, Switch } from '../../api/types';
import { switchLabel } from '../../utils/format';
import { useSwitch } from './useSwitch';

/** One configurable switch: rename, change on-signal, or remove. */
export function SwitchCard({ sw }: { sw: Switch }) {
	const { name, setName, control, setControl, message, status, saving, dirty, save, remove } =
		useSwitch(sw);
	const [expanded, setExpanded] = useState(false);

	return (
		<div class={`card ${expanded ? '' : 'collapsed'}`}>
			<button
				type="button"
				class="card-head"
				aria-expanded={expanded}
				onClick={() => setExpanded((value) => !value)}
			>
				<span class="chevron" aria-hidden="true">
					▾
				</span>
				<span class="card-title">{switchLabel(sw)}</span>
				<span class={`badge ${sw.active ? 'badge-on' : 'badge-off'}`}>
					{sw.active ? 'ON' : 'OFF'}
				</span>
				<SaveStatusBadge status={status} />
			</button>

			{!expanded && (
				<div class="card-summary">
					<span class="sum-item">
						Signal <strong>{control ? 'HIGH (1)' : 'LOW (0)'}</strong>
					</span>
				</div>
			)}

			{expanded && (
				<>
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
						<button class="action" type="button" disabled={!dirty || saving} onClick={save}>
							{saving ? 'Saving…' : 'Save'}
						</button>
						<button class="btn-remove" type="button" onClick={remove}>
							Remove
						</button>
					</div>
					<Message {...message} />
				</>
			)}
		</div>
	);
}
