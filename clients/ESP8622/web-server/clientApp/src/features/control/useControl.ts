import { useCallback, useEffect, useState } from "preact/hooks";
import { useMessage } from "@src/hooks/useMessage";
import { useInterval } from "@src/hooks/useInterval";
import { deviceNow } from "@src/store/device";
import { disableSchedulesForPin } from "@src/store/schedules";
import {
  getSwitch,
  refreshSwitches,
  startSwitch,
  stopSwitch,
  switches,
} from "@src/store/switches";
import { clamp, formatDuration, switchLabel } from "@src/utils/format";

/**
 * Instant-control state for the selected switch: live `active`/`stopsAt`, a
 * countdown that re-syncs when the device auto-stops, and the ON/OFF actions.
 */
export function useControl() {
  const list = switches.value;
  const message = useMessage();
  const [selectedPin, setSelectedPin] = useState<number | null>(null);
  const [minutes, setMinutes] = useState(10);
  const [seconds, setSeconds] = useState(0);
  // Bumped each second to re-render the live countdown (which reads deviceNow()).
  const [, tick] = useState(0);

  const refresh = useCallback(
    () => message.run(() => refreshSwitches().then(() => undefined)),
    [message.run],
  );

  // Pull fresh state on mount (Control needs live `active`/`stopsAt`).
  useEffect(() => void refresh(), [refresh]);

  // Keep the selection valid as the list changes, preserving the current choice.
  useEffect(() => {
    if (list.length === 0) setSelectedPin(null);
    else if (
      selectedPin === null ||
      !list.some((sw) => sw.pin === selectedPin)
    ) {
      setSelectedPin(list[0].pin);
    }
  }, [list, selectedPin]);

  const sw = selectedPin !== null ? getSwitch(selectedPin) : undefined;
  const active = !!sw?.active;
  // ON with no manual auto-off timer = the switch is being driven by a schedule.
  const scheduled = active && !sw?.stopsAt;

  // Every active switch driving a pin right now — for the overview panel.
  const running = list
    .filter((s) => s.active)
    .map((s) => ({
      pin: s.pin,
      label: switchLabel(s),
      // ON with no manual auto-off timer = driven by a schedule.
      scheduled: !s.stopsAt,
      remaining: s.stopsAt
        ? formatDuration(Math.round((s.stopsAt - deviceNow()) / 1000))
        : null,
    }));

  // Tick once a second while any switch is counting down; re-sync when one
  // elapses (the device auto-stops it).
  const anyCounting = list.some((s) => s.active && !!s.stopsAt);
  useInterval(
    () => {
      const elapsed = list.some(
        (s) =>
          s.active &&
          !!s.stopsAt &&
          Math.round((s.stopsAt - deviceNow()) / 1000) <= 0,
      );
      if (elapsed) void refresh();
      else tick((n) => n + 1);
    },
    anyCounting ? 1000 : null,
  );

  // Recomputed every render — the per-second `tick` above keeps it live.
  const clockText = (() => {
    if (!active) return "00:00:00";
    if (scheduled) return "Controlled by scheduler";
    return formatDuration(
      Math.round(((sw?.stopsAt ?? 0) - deviceNow()) / 1000),
    );
  })();

  const select = useCallback(
    (pin: number) => {
      message.clear();
      setSelectedPin(pin);
    },
    [message.clear],
  );

  const turnOn = useCallback(async () => {
    if (selectedPin === null) return;

    const current = getSwitch(selectedPin);

    if (current?.active && !current.stopsAt) return; // scheduler-controlled — ignore

    const duration =
      clamp(minutes || 0, 0, 999) * 60 + clamp(seconds || 0, 0, 59);

    message.clear();
    const ok = await message.run(async () => {
      await startSwitch(selectedPin, deviceNow() + duration * 1000);
      await refreshSwitches();
    });
    if (ok) message.succeed("Timer started.");
  }, [
    selectedPin,
    minutes,
    seconds,
    message.clear,
    message.run,
    message.succeed,
  ]);

  const turnOff = useCallback(async () => {
    if (selectedPin === null) return;

    message.clear();
    const current = getSwitch(selectedPin);
    const wasScheduled = !!current?.active && !current.stopsAt;
    const ok = await message.run(async () => {
      // A scheduler-driven switch would be switched back on at the next tick,
      // so disable its schedule(s) first, then stop it.
      if (wasScheduled) await disableSchedulesForPin(current!.pin);
      await stopSwitch(selectedPin);
      await refreshSwitches();
    });
    if (ok)
      message.succeed(
        wasScheduled ? "Schedule disabled — switch off." : "Turned off.",
      );
  }, [selectedPin, message.clear, message.run, message.succeed]);

  const stopAll = useCallback(async () => {
    message.clear();
    const activeSwitches = switches.value.filter((s) => s.active);
    if (activeSwitches.length === 0) return;
    const ok = await message.run(async () => {
      for (const s of activeSwitches) {
        // Scheduler-driven switches would be turned back on at the next tick,
        // so disable their schedule(s) before stopping.
        if (!s.stopsAt) await disableSchedulesForPin(s.pin);
        await stopSwitch(s.pin);
      }
      await refreshSwitches();
    });
    if (ok) message.succeed("All switches stopped.");
  }, [message.clear, message.run, message.succeed]);

  return {
    list,
    selectedPin,
    select,
    minutes,
    setMinutes,
    seconds,
    setSeconds,
    active,
    scheduled,
    running,
    clockText,
    message,
    turnOn,
    turnOff,
    stopAll,
  };
}
