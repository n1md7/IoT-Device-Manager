window.scheduler ||= {} as any;
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
    startTime,
    endTime,
    weekdays,
    enabled: options.active,
  };
};
