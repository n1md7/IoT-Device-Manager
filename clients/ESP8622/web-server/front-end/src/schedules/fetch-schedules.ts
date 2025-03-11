// @ts-ignore
window.scheduler ||= {};
window.scheduler.fetchSchedules = async () => {
  const response = await fetch("/api/schedules");

  if (response.ok) {
    return response.json();
  }
  return await Promise.reject(response.json());
};
