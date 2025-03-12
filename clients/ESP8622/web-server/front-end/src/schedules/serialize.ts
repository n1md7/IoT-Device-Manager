window.scheduler ||= {} as any;
window.scheduler.formatNumber = (v: number) => String(v).padStart(2, "0");
window.scheduler.formatTime = (t: Date) =>
  `${window.scheduler.formatNumber(t.getHours())}:${window.scheduler.formatNumber(t.getMinutes())}`;
window.scheduler.serialize = (options) => {
  const startTime = options.startTime;
  const hour = startTime.getHours();
  const minute = startTime.getMinutes();
  const endTime = options.endTime;
  const deltaMs = endTime.getTime() - startTime.getTime();
  const activateForSeconds = Math.floor(deltaMs / 1000);
  const weekdays = options.weekdays.join(",");

  return {
    id: options.id,
    name: options.name,
    weekdays,
    hour,
    minute,
    activateForSeconds,
    active: options.enabled,
  };
};
