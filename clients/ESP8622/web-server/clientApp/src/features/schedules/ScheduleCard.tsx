import { useState } from "preact/hooks";
import { Message } from "@src/components/Message";
import { SaveStatusBadge } from "@src/components/SaveStatusBadge";
import { Toggle } from "@src/components/Toggle";
import { switches } from "@src/store/switches";
import { daysSummary, switchLabel, weekdays } from "@src/utils/format";
import type { ScheduleSeed } from "./mappers";
import { useSchedule } from "./useSchedule";

/** An editable schedule card — creates a new schedule or edits an existing one. */
export function ScheduleCard({
  seed,
  onChanged,
}: {
  seed: ScheduleSeed;
  onChanged?: () => void;
}) {
  const {
    isNew,
    pin,
    setPin,
    start,
    setStart,
    end,
    setEnd,
    days,
    toggleDay,
    enabled,
    setEnabled,
    message,
    status,
    saving,
    dirty,
    save,
    remove,
  } = useSchedule(seed, onChanged);
  const list = switches.value;
  // New/draft cards open for editing; existing ones start compact.
  const [expanded, setExpanded] = useState(isNew);

  return (
    <div
      class={`card schedule ${enabled ? "schedule-on" : "schedule-off"} ${
        expanded ? "" : "collapsed"
      }`}
    >
      <button
        type="button"
        class="card-head"
        aria-expanded={expanded}
        onClick={() => setExpanded((value) => !value)}
      >
        <span class="chevron" aria-hidden="true">
          ▾
        </span>
        <span class="card-title">
          {isNew ? "New schedule" : `Schedule ${seed.id}`}
        </span>
        <span class={`badge ${enabled ? "badge-on" : "badge-off"}`}>
          {enabled ? "Enabled" : "Disabled"}
        </span>
        <SaveStatusBadge status={status} />
      </button>

      {!expanded && (
        <div class="card-summary">
          <span class="sum-item">
            <strong>
              {start}–{end}
            </strong>
          </span>
          <span class="sum-item">
            {switchLabel(list.find((sw) => sw.pin === pin))}
          </span>
          <span class="sum-item">{daysSummary(days)}</span>
        </div>
      )}

      {expanded && (
        <>
          <div class="field">
        <label>Switch</label>
        <select
          value={pin}
          onChange={(event) => setPin(Number(event.currentTarget.value))}
        >
          {list.map((sw) => (
            <option key={sw.pin} value={sw.pin}>
              {switchLabel(sw)}
            </option>
          ))}
        </select>
      </div>
      <div class="row field">
        <div>
          <label>Start time</label>
          <input
            type="time"
            value={start}
            onInput={(event) => setStart(event.currentTarget.value)}
          />
        </div>
        <div>
          <label>End time</label>
          <input
            type="time"
            value={end}
            onInput={(event) => setEnd(event.currentTarget.value)}
          />
        </div>
      </div>
      <label>Repeat on</label>
      <div class="days">
        {weekdays.map((dayLabel, day) => (
          <label key={day}>
            <input
              type="checkbox"
              checked={days.has(day)}
              onChange={() => toggleDay(day)}
            />
            <span>{dayLabel}</span>
          </label>
        ))}
      </div>
      <div class="field">
        <Toggle checked={enabled} onChange={setEnabled} label="Enabled" />
      </div>
      <div class="card-actions">
        <button
          class="action"
          type="button"
          disabled={!dirty || saving}
          onClick={save}
        >
          {saving
            ? isNew
              ? "Creating…"
              : "Saving…"
            : isNew
              ? "Create"
              : "Save"}
        </button>
            {!isNew && (
              <button class="btn-remove" type="button" onClick={remove}>
                Remove
              </button>
            )}
          </div>
          <Message {...message} />
        </>
      )}
    </div>
  );
}
