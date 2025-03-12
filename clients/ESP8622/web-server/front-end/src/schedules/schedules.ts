document.addEventListener("DOMContentLoaded", () => {
  window.scheduler.fetchSchedules().then((schedules) => {
    schedules.forEach((schedule) => {
      const dom = window.scheduler.createCard(schedule);
      const main = document.body.querySelector("main");

      if (!main) throw new Error("main tag not found");

      main.appendChild(dom.container);

      const id = +dom.container.getAttribute("data-id")!;
      const name = dom.container.querySelector(
        ".schedule-name",
      ) as HTMLDivElement;
      const startTime = dom.container.querySelector(
        ".start-time",
      ) as HTMLInputElement;
      const endTime = dom.container.querySelector(
        ".end-time",
      ) as HTMLInputElement;
      const enabled = dom.container.querySelector(
        ".status",
      ) as HTMLInputElement;
      const mon = dom.container.querySelector(".mon") as HTMLInputElement;
      const tue = dom.container.querySelector(".tue") as HTMLInputElement;
      const wed = dom.container.querySelector(".wed") as HTMLInputElement;
      const thu = dom.container.querySelector(".thu") as HTMLInputElement;
      const fri = dom.container.querySelector(".fri") as HTMLInputElement;
      const sat = dom.container.querySelector(".sat") as HTMLInputElement;
      const sun = dom.container.querySelector(".sun") as HTMLInputElement;
      const weekdays = [
        sun.checked,
        mon.checked,
        tue.checked,
        wed.checked,
        thu.checked,
        fri.checked,
        sat.checked,
      ].map((_, idx) => idx);
      const btn = dom.container.querySelector(
        ".update-btn",
      ) as HTMLButtonElement;

      if (!btn) throw new Error("No schedule button found.");
      btn.addEventListener("click", () => {
        window.scheduler
          .updateSchedule(
            window.scheduler.serialize({
              id,
              name: name.innerHTML,
              startTime: startTime.valueAsDate!,
              endTime: endTime.valueAsDate!,
              enabled: enabled.checked,
              weekdays,
            }),
          )
          .then(() => {
            alert("Schedule successfully updated.");
          })
          .catch((e) => {
            alert("Schedule error: " + e.message);
          });
      });
    });
  });
});
