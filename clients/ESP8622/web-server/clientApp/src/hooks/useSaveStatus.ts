import { useCallback, useEffect, useRef, useState } from 'preact/hooks';

/** Save lifecycle of an editable card, used to drive its badge and Save button. */
export type SaveStatus = 'idle' | 'unsaved' | 'saving' | 'saved';

/** How long the "Saved" badge lingers after a successful save. */
const SAVED_BADGE_MS = 3000;

/**
 * Derives a {@link SaveStatus} from a `dirty` flag and the in-flight state of a
 * save: "saving" while the action runs, then "saved" for a few seconds on
 * success (cleared early if the user edits again, since `dirty` wins).
 */
export function useSaveStatus(dirty: boolean) {
	const [saving, setSaving] = useState(false);
	const [saved, setSaved] = useState(false);
	const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

	useEffect(() => () => clearTimeout(timer.current), []);

	/** Run a save action; flag "saved" for a moment when it reports success. */
	const track = useCallback(async (action: () => Promise<boolean>): Promise<boolean> => {
		setSaving(true);
		setSaved(false);
		try {
			const ok = await action();
			if (ok) {
				setSaved(true);
				clearTimeout(timer.current);
				timer.current = setTimeout(() => setSaved(false), SAVED_BADGE_MS);
			}
			return ok;
		} finally {
			setSaving(false);
		}
	}, []);

	const status: SaveStatus = saving ? 'saving' : dirty ? 'unsaved' : saved ? 'saved' : 'idle';
	return { status, saving, track };
}
