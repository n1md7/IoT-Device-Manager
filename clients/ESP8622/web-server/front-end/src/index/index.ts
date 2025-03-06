const elements = import("./elements.ts");
const events = import("./events.ts");
const functions = import("./functions.ts");

fetch("/api/status")
  .then((res) => (res.ok ? res.json() : Promise.reject(res.statusText)))
  .then(async (timer) => {
    const { on, off, status, time } = await elements;
    const { counter, handleClick, startCountdown } = await events;
    const { getFormattedTime, getStatusText, showSelect, hideSelect } =
      await functions;

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
  .catch((error) => import("./error.ts").then((fn) => fn.default(error)));
