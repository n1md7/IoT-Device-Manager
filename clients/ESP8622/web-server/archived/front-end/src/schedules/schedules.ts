import { onDeviceStatus } from "../device.ts";
import type { ScheduleType } from "../vite-env";

const main = document.body.querySelector("main");
if (!main) throw new Error("main tag not found");

main.innerHTML = "";

const message = document.createElement("div");
message.className = "schedule-message hidden";
main.appendChild(message);

const board = document.createElement("div");
board.className = "schedule-board";
main.appendChild(board);

const addTile = document.createElement("button");
addTile.type = "button";
addTile.className = "add-card";
addTile.innerHTML = `
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
  </svg>
  <span>Add schedule</span>
`;
board.appendChild(addTile);

// Mirror the device's hard cap (see ScheduleManager#maxSchedules).
const MAX_SCHEDULES = 4;
const refreshAddState = () => {
  const count = board.querySelectorAll(".schedule-container").length;
  addTile.classList.toggle("hidden", count >= MAX_SCHEDULES);
};

const showMessage = (html: string) => {
  message.innerHTML = html;
  message.classList.remove("hidden");
};

const clearCards = () =>
  board
    .querySelectorAll(".schedule-container")
    .forEach((card) => card.remove());

const wireCard = (schedule: ScheduleType) => {
  const dom = window.scheduler.createCard(schedule);
  const card = dom.container;

  const name = card.querySelector(".schedule-name") as HTMLDivElement;
  const day = (cls: string) => card.querySelector(cls) as HTMLInputElement;
  const [sun, mon, tue, wed, thu, fri, sat] = [
    ".sun",
    ".mon",
    ".tue",
    ".wed",
    ".thu",
    ".fri",
    ".sat",
  ].map(day);

  const saveBtn = card.querySelector(".update-btn") as HTMLButtonElement;
  const removeBtn = card.querySelector(".remove-btn") as HTMLButtonElement;

  saveBtn.addEventListener("click", () => {
    const [startH, startM] = dom.startTime.value.split(":").map(Number);
    const [endH, endM] = dom.endTime.value.split(":").map(Number);

    const weekdays = [sun, mon, tue, wed, thu, fri, sat]
      .map((input, idx) => (input.checked ? idx : -1))
      .filter((idx) => idx !== -1);

    window.scheduler
      .updateSchedule(
        window.scheduler.serialize({
          id: dom.id,
          name: name.innerHTML,
          startTime: { hour: startH, minute: startM },
          endTime: { hour: endH, minute: endM },
          active: !!dom.active.value,
          weekdays,
        }),
      )
      .then(() => alert("Schedule successfully updated."))
      .catch((e) => alert("Schedule error: " + (e?.message ?? e)));
  });

  removeBtn.addEventListener("click", () => {
    if (!confirm(`Remove Schedule #${dom.id}?`)) return;

    removeBtn.disabled = true;
    window.scheduler
      .removeSchedule(dom.id)
      .then(() => {
        card.remove();
        refreshAddState();
      })
      .catch((e) => {
        alert("Could not remove schedule: " + (e?.message ?? e));
        removeBtn.disabled = false;
      });
  });

  board.insertBefore(card, addTile);
  refreshAddState();
};

addTile.addEventListener("click", () => {
  addTile.disabled = true;
  window.scheduler
    .createSchedule()
    .then((schedule) => {
      wireCard(schedule);
      addTile.scrollIntoView({ behavior: "smooth", inline: "end" });
    })
    .catch((e) => alert("Could not add schedule: " + (e?.message ?? e)))
    .finally(() => (addTile.disabled = false));
});

onDeviceStatus((state) => {
  clearCards();

  if (!state.online) {
    addTile.classList.add("hidden");
    showMessage(
      "Not connected to a device. Enter the address above and press <b>Connect</b>.",
    );
    return;
  }

  message.classList.add("hidden");
  addTile.classList.remove("hidden");

  window.scheduler
    .fetchSchedules()
    .then((schedules) => schedules.forEach(wireCard))
    .catch(() => showMessage("Failed to load schedules."));
});
