import { apiFetch } from "../device";
import { on, off, status, time } from "./elements";
import { counter, handleClick, startCountdown } from "./events";
import {
  getFormattedTime,
  getStatusText,
  hideSelect,
  showSelect,
} from "./functions";
import showError from "./error";

apiFetch("/api/status")
  .then((res) => (res.ok ? res.json() : Promise.reject(res.statusText)))
  .then((timer) => {
    on.addEventListener("click", handleClick);
    off.addEventListener("click", handleClick);

    status.innerText = getStatusText(timer.active);
    time.innerText = getFormattedTime(timer.time);
    if (timer.active) {
      status.classList.add("text-success");
      counter.countdown = timer.time;
      startCountdown();
      hideSelect();
    } else showSelect();
  })
  .catch((error) => showError(error));