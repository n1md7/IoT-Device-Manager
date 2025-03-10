document.addEventListener("DOMContentLoaded", () => {
  window.scheduler.fetchSchedules().then((schedules) => {
    schedules.forEach((schedule) => {
      const dom = window.scheduler.createCard(schedule);
      const main = document.body.querySelector("main");

      if (!main) throw new Error("main tag not found");

      main.appendChild(dom.container);
    });
  });
});
