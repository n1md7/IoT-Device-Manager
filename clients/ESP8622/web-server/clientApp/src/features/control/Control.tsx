import { useLocation } from "preact-iso";
import { Message } from "@src/components/Message";
import { switchLabel } from "@src/utils/format";
import { DurationPicker } from "./DurationPicker";
import { useControl } from "./useControl";

/**
 * Control page — instant ON/OFF for a selected switch, with a live countdown
 * driven by the server's `stopsAt`.
 */
export function Control() {
  const { route } = useLocation();
  const {
    list,
    selectedPin,
    select,
    minutes,
    setMinutes,
    seconds,
    setSeconds,
    active,
    scheduled,
    clockText,
    message,
    turnOn,
    turnOff,
  } = useControl();

  if (list.length === 0) {
    return (
      <section>
        <div class="card empty">
          <h2>No switches yet</h2>
          <p>Register a switch (a digital pin) before you can control it.</p>
          <button
            class="action"
            type="button"
            onClick={() => route("/switches")}
          >
            Create a switch
          </button>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div class="card">
        <h2>Instant control</h2>
        <div class="field">
          <label for="ctlSelect">Switch</label>
          <select
            id="ctlSelect"
            value={selectedPin ?? undefined}
            onChange={(event) => select(Number(event.currentTarget.value))}
          >
            {list.map((option) => (
              <option key={option.pin} value={option.pin}>
                {switchLabel(option)}
              </option>
            ))}
          </select>
        </div>

        <div class="status-line">
          Status:{" "}
          <span class={`pill ${active ? "on" : "off"}`}>
            {active ? "ON" : "OFF"}
          </span>
        </div>
        <div class={`clock ${scheduled ? "small" : ""}`.trim()}>
          {clockText}
        </div>

        {!active && (
          <DurationPicker
            minutes={minutes}
            seconds={seconds}
            onMinutes={setMinutes}
            onSeconds={setSeconds}
          />
        )}

        <div class="btns">
          {!active && (
            <button
              class="action"
              type="button"
              disabled={scheduled}
              onClick={turnOn}
            >
              Turn ON
            </button>
          )}
          {active && (
            <button class="action danger" type="button" onClick={turnOff}>
              {scheduled ? "Stop & disable schedule" : "Turn OFF"}
            </button>
          )}
        </div>
        {scheduled && (
          <p class="muted">
            Controlled by a schedule. Pressing Stop disables that schedule and
            turns the switch off.
          </p>
        )}
        <Message {...message.get} />
      </div>
    </section>
  );
}
