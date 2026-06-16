window.scheduler ||= {} as any;
window.scheduler.deserialize = (options) => {
  const minutes = Math.floor(options.activateForSeconds / 60) % 60;
  const hours = Math.floor(options.activateForSeconds / 60 / 60);

  const endM = (options.minute + minutes) % 60;
  const extra = Math.floor((options.minute + minutes) / 60);
  const endH = options.hour + hours + extra;

  const weekdays = options.weekdays.split(",").map(Number);

  return {
    id: options.id,
    name: options.name,
    startTime: {
      hour: options.hour,
      minute: options.minute,
    },
    endTime: {
      hour: endH,
      minute: endM,
    },
    weekdays,
    active: !!options.active,
  };
};
