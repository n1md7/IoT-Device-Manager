import { Message } from "@src/components/Message";
import { ScheduleCard } from "./ScheduleCard";
import type { ScheduleSeed } from "./mappers";
import { useSchedules } from "./useSchedules";

/** Schedules page — daily on/off windows that drive a switch. */
export function Schedules() {
  const { list, pins, loading, message, drafts, addDraft, removeDraft } =
    useSchedules();

  if (loading) {
    return (
      <section>
        <div class="card muted">Loading schedules…</div>
      </section>
    );
  }

  if (pins.length === 0) {
    return (
      <section>
        <Message {...message} />
        <div class="card muted">
          Register a switch first — a schedule needs a switch to drive.
        </div>
      </section>
    );
  }

  const draftSeed = (): ScheduleSeed => ({
    digitalPin: pins[0],
    startTime: "08:00:0",
    endTime: "09:00:0",
    weekdays: "0:0:0:0:0:0:0",
    isActive: true,
  });

  return (
    <section>
      <Message {...message} />

      {list.length === 0 && drafts.length === 0 && (
        <div class="card muted">No schedules yet. Add one below.</div>
      )}

      {list.map((schedule) => (
        <ScheduleCard key={schedule.id} seed={schedule} />
      ))}

      {drafts.map((key) => (
        <ScheduleCard
          key={`draft-${key}`}
          seed={draftSeed()}
          onChanged={() => removeDraft(key)}
        />
      ))}

      <button
        class="action ghost"
        type="button"
        style={{ width: "100%" }}
        onClick={addDraft}
      >
        + Add schedule
      </button>
    </section>
  );
}
