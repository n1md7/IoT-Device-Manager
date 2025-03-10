// @ts-ignore
window.scheduler ||= {};
const f = (v: number) => String(v).padStart(2, "0");
window.scheduler.deserialize = (options) => {
  const startTime = new Date();
  startTime.setHours(options.hour);
  startTime.setMinutes(options.minute);

  const endTime = new Date(startTime);
  const seconds = options.activateForSeconds % 60;
  const minutes = Math.floor(options.activateForSeconds / 60) % 60;
  const hours = Math.floor(options.activateForSeconds / 60 / 60);
  endTime.setHours(hours);
  endTime.setMinutes(minutes);
  endTime.setSeconds(seconds);

  const weekdays = options.weekdays.split(",").map(Number);

  return {
    id: options.id,
    name: options.name,
    startTime: `${f(startTime.getHours())}:${f(startTime.getMinutes())}`,
    endTime: `${f(endTime.getHours())}:${f(endTime.getMinutes())}`,
    weekdays,
    enabled: options.active,
  };
};
