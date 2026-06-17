import { render } from 'preact';
import { useEffect } from 'preact/hooks';
import { LocationProvider, Route, Router } from 'preact-iso';

import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Modal } from './components/Modal';
import { Nav } from './components/Nav';
import { NotFound } from './components/NotFound';
import { Control } from './features/control/Control';
import { Schedules } from './features/schedules/Schedules';
import { Switches } from './features/switches/Switches';
import { loadDevice } from './store/device';
import './style.css';

export function App() {
	// Device identity + clock anchor: fetched once for the whole session.
	useEffect(() => {
		void loadDevice();
	}, []);

	return (
		<LocationProvider>
			<Header />
			<Nav />
			<main>
				<Router>
					<Route path="/" component={Control} />
					<Route path="/switches" component={Switches} />
					<Route path="/schedules" component={Schedules} />
					<Route default component={NotFound} />
				</Router>
			</main>
			<Footer />
			<Modal />
		</LocationProvider>
	);
}

render(<App />, document.getElementById('app')!);
