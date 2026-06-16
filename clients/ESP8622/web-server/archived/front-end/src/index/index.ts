import { apiFetch, onDeviceStatus } from "../device.ts";
import { find } from "../dom.utils.ts";
import { on, off, status, time } from "./elements.ts";
import { counter, handleClick, startCountdown } from "./events.ts";
import {
  getFormattedTime,
  getStatusText,
  hideSelect,
  showSelect,
} from "./functions.ts";
import showError from "./error.ts";

const controls = find("#device-controls");
const offline = find("#device-offline");

// Buttons are wired once; they target whatever device is currently configured.
on.addEventListener("click", handleClick);
off.addEventListener("click", handleClick);

const renderTimer = (timer: { active: boolean; time: number }) => {
  if (counter.id) clearInterval(counter.id);

  status.innerText = getStatusText(timer.active);
  status.classList.remove("text-success");
  time.innerText = getFormattedTime(timer.time);

  if (timer.active) {
    status.classList.add("text-success");
    counter.countdown = timer.time;
    startCountdown();
    hideSelect();
  } else showSelect();
};

const showOffline = (message: string) => {
  if (counter.id) clearInterval(counter.id);
  controls.classList.add("hidden");
  offline.classList.remove("hidden");
  offline.innerHTML = message;
};

onDeviceStatus(async (state) => {
  if (!state.online) {
    showOffline(
      "Not connected to a device. Enter the address above and press <b>Connect</b>.",
    );
    return;
  }

  try {
    const res = await apiFetch("/api/status");
    if (!res.ok) throw new Error(res.statusText);
    const timer = await res.json();

    offline.classList.add("hidden");
    controls.classList.remove("hidden");
    renderTimer(timer);
  } catch (error) {
    showError(error);
  }
});
