import { useState } from 'preact/hooks';
import { Message } from '../../components/Message';
import { availablePins } from '../../store/switches';
import { RegisterSwitchForm } from './RegisterSwitchForm';
import { SwitchCard } from './SwitchCard';
import { useSwitches } from './useSwitches';

/** Switches page — register / configure / remove switches. */
export function Switches() {
	const { list, loading, message } = useSwitches();
	const [registering, setRegistering] = useState(false);
	const allRegistered = availablePins().length === 0;

	return (
		<section>
			<Message {...message} />

			{loading ? (
				<div class="card muted">Loading switches…</div>
			) : list.length === 0 ? (
				<div class="card muted">No switches registered yet. Add one below.</div>
			) : (
				[...list]
					.sort((a, b) => a.pin - b.pin)
					.map((sw) => <SwitchCard key={sw.pin} sw={sw} />)
			)}

			{registering ? (
				<RegisterSwitchForm onAdded={() => setRegistering(false)} />
			) : (
				<button
					class="action ghost"
					type="button"
					style={{ width: '100%' }}
					disabled={allRegistered}
					onClick={() => setRegistering(true)}
				>
					{allRegistered ? 'All pins are registered' : '+ Add switch'}
				</button>
			)}
		</section>
	);
}
