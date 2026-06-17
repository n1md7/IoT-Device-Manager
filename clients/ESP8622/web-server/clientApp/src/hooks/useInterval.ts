import { useEffect, useRef } from 'preact/hooks';

/**
 * Declarative `setInterval`. The latest `callback` is always invoked without
 * resetting the timer, and passing `delay = null` pauses it (clearing the timer).
 */
export function useInterval(callback: () => void, delay: number | null): void {
	const saved = useRef(callback);
	saved.current = callback;

	useEffect(() => {
		if (delay === null) return;
		const id = setInterval(() => saved.current(), delay);
		return () => clearInterval(id);
	}, [delay]);
}
