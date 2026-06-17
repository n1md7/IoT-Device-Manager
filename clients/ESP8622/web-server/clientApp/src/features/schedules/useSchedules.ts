import { useCallback, useEffect, useState } from "preact/hooks";
import { useMessage } from "@src/hooks/useMessage";
import { refreshSchedules, schedules } from "@src/store/schedules";
import { ensureSwitches, registeredPins } from "@src/store/switches";

/**
 * Schedules-page state: load the list (plus the switches it references) and
 * track unsaved "new schedule" drafts by a local key.
 */
export function useSchedules() {
  const list = schedules.value;
  const pins = registeredPins();
  const { message, clear, fail } = useMessage();

  const [loading, setLoading] = useState(true);
  const [drafts, setDrafts] = useState<number[]>([]);
  const [draftSeq, setDraftSeq] = useState(0);

  const load = useCallback(async () => {
    clear();
    setLoading(true);
    try {
      // Schedules reference a switch pin, so we need the switch list too —
      // reuse it from the store when already loaded.
      await ensureSwitches();
      await refreshSchedules();
    } catch (error) {
      fail(error);
    } finally {
      setLoading(false);
    }
  }, [clear, fail]);

  useEffect(() => void load(), [load]);

  const addDraft = useCallback(() => {
    setDrafts((prev) => [...prev, draftSeq]);
    setDraftSeq((n) => n + 1);
  }, [draftSeq]);

  const removeDraft = useCallback(
    (key: number) => setDrafts((prev) => prev.filter((k) => k !== key)),
    [],
  );

  return {
    list,
    pins,
    loading,
    message,
    drafts,
    addDraft,
    removeDraft,
  };
}
