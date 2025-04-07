window.scheduler ||= {} as any;
window.scheduler.formatNumber = (v: number) => String(v).padStart(2, "0");
window.scheduler.formatTime = (t: { hour: number; minute: number }) =>
  `${window.scheduler.formatNumber(t.hour ?? 0)}:${window.scheduler.formatNumber(t.minute ?? 0)}`;
window.scheduler.serialize = (options) => {
  console.info("Serializing schedule", options);
  const startTime = options.startTime;
  const endTime = options.endTime;
  const deltaMinutes = endTime.minute - startTime.minute;
  const calcMinutes = deltaMinutes < 0 ? 60 + deltaMinutes : deltaMinutes;
  const deltaHours =
    endTime.hour - startTime.hour + (deltaMinutes < 0 ? -1 : 0);
  const activateForSeconds = (deltaHours * 60 + calcMinutes) * 60;
  const weekdays = options.weekdays.join(",");

  return {
    id: options.id,
    name: options.name,
    weekdays,
    hour: startTime.hour,
    minute: startTime.minute,
    activateForSeconds,
    active: options.enabled ? "enable" : "",
  };
};
