import { apiFetch } from "../device.ts";

window.scheduler ||= {} as any;
window.scheduler.fetchSchedules = async () => {
  const response = await apiFetch("/api/schedules");

  if (response.ok) {
    return response.json();
  }

  return await Promise.reject(await response.json());
};
