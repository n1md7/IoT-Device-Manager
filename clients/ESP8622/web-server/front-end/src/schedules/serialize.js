window.scheduler ||= {};
window.scheduler.serialize = (options) => {
    const startTime = options.startTime.valueAsDate;
    const hour = startTime.getHours();
    const minute = startTime.getMinutes();
    const endTime = options.endTime.valueAsNumber;
    const deltaMs = endTime - startTime.getTime();
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
export {};
