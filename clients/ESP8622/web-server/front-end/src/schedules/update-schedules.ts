window.scheduler ||= {} as any;
window.scheduler.updateSchedule = async (payload) => {
  const params = new URLSearchParams(payload as any);
  const response = await fetch(`/api/schedules?${params.toString()}`, {
    method: "PUT",
  });

  if (response.ok) return void 0;

  return await Promise.reject(response.json());
};
