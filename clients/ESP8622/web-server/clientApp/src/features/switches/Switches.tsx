import { Message } from '../../components/Message';
import { RegisterSwitchForm } from './RegisterSwitchForm';
import { SwitchCard } from './SwitchCard';
import { useSwitches } from './useSwitches';

/** Switches page — register / configure / remove switches. */
export function Switches() {
	const { list, loading, message } = useSwitches();

	return (
		<section>
			<Message {...message} />

			{loading ? (
				<div class="card muted">Loading switches…</div>
			) : list.length === 0 ? (
				<div class="card muted">No switches registered yet. Add one below.</div>
			) : (
				list.map((sw) => <SwitchCard key={sw.pin} sw={sw} />)
			)}

			<RegisterSwitchForm />
		</section>
	);
}
