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
      const mon = dom.container.querySelector(".mon") as HTMLInputElement;
      const tue = dom.container.querySelector(".tue") as HTMLInputElement;
      const wed = dom.container.querySelector(".wed") as HTMLInputElement;
      const thu = dom.container.querySelector(".thu") as HTMLInputElement;
      const fri = dom.container.querySelector(".fri") as HTMLInputElement;
      const sat = dom.container.querySelector(".sat") as HTMLInputElement;
      const sun = dom.container.querySelector(".sun") as HTMLInputElement;

      const btn = dom.container.querySelector(
        ".update-btn",
      ) as HTMLButtonElement;

      if (!btn) throw new Error("No schedule button found.");

      btn.addEventListener("click", () => {
        const [startH, startM] = dom.startTime.value.split(":").map(Number);
        const [endH, endM] = dom.endTime.value.split(":").map(Number);

        const weekdays = [
          sun.checked,
          mon.checked,
          tue.checked,
          wed.checked,
          thu.checked,
          fri.checked,
          sat.checked,
        ]
          .map((a, idx) => (a ? idx : -1))
          .filter((a) => a !== -1);

        window.scheduler
          .updateSchedule(
            window.scheduler.serialize({
              id,
              name: name.innerHTML,
              startTime: {
                hour: startH,
                minute: startM,
              },
              endTime: {
                hour: endH,
                minute: endM,
              },
              enabled: dom.enabled.value === "enable",
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
