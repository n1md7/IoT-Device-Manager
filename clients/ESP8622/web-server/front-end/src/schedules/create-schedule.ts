import { apiFetch } from "../device";

window.scheduler ||= {} as any;

window.scheduler.createSchedule = async () => {
  const response = await apiFetch("/api/schedules?action=CREATE", {
    method: "POST",
  });

  if (response.ok) return response.json();
  return await Promise.reject(await response.json());
};

window.scheduler.removeSchedule = async (id) => {
  const response = await apiFetch(`/api/schedules?action=REMOVE&id=${id}`, {
    method: "POST",
  });

  if (response.ok) return void 0;
  return await Promise.reject(await response.json());
};
