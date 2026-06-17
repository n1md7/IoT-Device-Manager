import { useCallback, useEffect, useState } from 'preact/hooks';
import { useMessage } from '../../hooks/useMessage';
import { refreshSwitches, switches } from '../../store/switches';

/**
 * Loads the switch list once on mount. Subsequent create/update/remove mutate
 * the `switches` store in place, so the page re-renders without refetching.
 */
export function useSwitches() {
	const list = switches.value;
	const [loading, setLoading] = useState(true);
	const { message, clear, fail } = useMessage();

	const load = useCallback(async () => {
		clear();
		setLoading(true);
		try {
			await refreshSwitches();
		} catch (error) {
			fail(error);
		} finally {
			setLoading(false);
		}
	}, [clear, fail]);

	useEffect(() => {
		void load();
	}, [load]);

	return { list, loading, message };
}
