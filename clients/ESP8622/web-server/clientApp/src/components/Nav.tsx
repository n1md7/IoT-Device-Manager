import { useLocation } from 'preact-iso';

const TABS = [
	{ path: '/', label: 'Control' },
	{ path: '/switches', label: 'Switches' },
	{ path: '/schedules', label: 'Schedules' },
] as const;

/** Top tab bar — routes between Control, Switches and Schedules. */
export function Nav() {
	const { path } = useLocation();

	return (
		<nav>
			{TABS.map((tab) => (
				<a key={tab.path} href={tab.path} class={path === tab.path ? 'active' : ''}>
					{tab.label}
				</a>
			))}
		</nav>
	);
}
