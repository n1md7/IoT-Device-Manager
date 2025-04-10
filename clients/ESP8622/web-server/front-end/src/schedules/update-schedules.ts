window.scheduler ||= {} as any;
window.scheduler.updateSchedule = async (payload) => {
  const response = await fetch(`/api/schedules`, {
    method: "PUT",
    headers: {
      "x-body-vars": Object.entries(payload)
        .map(([key, value]) => {
          return `${key}=${encodeURIComponent(value)}`;
        })
        .join(";"),
    },
  });

  if (response.ok) return void 0;

  return await Promise.reject(response.json());
};
