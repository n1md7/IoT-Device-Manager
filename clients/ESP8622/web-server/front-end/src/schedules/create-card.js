const checked = (v) => (v ? `checked=""` : "");
const selected = (s) => (s ? `selected=""` : "");
window.scheduler ||= {};
window.scheduler.createCard = (options) => {
    const deserialized = window.scheduler.deserialize(options);
    const container = document.createElement("div");
    container.classList.add("schedule-container");
    const sun = deserialized.weekdays.includes(0);
    const mon = deserialized.weekdays.includes(1);
    const tue = deserialized.weekdays.includes(2);
    const wed = deserialized.weekdays.includes(3);
    const thu = deserialized.weekdays.includes(4);
    const fri = deserialized.weekdays.includes(5);
    const sat = deserialized.weekdays.includes(6);
    container.innerHTML = `
    <div class="schedule-wrapper">
      <div class="schedule-form">
        <div class="schedule-name">${deserialized.name}</div>
        <div class="form-group">
          <label for="id${deserialized.id}-start-time">Start Time: </label>
          <input type="time" id="id${deserialized.id}-start-time" value="${deserialized.startTime}" class="timepicker">
        </div>
        <div class="form-group">
          <label for="id${deserialized.id}-end-time">End Time: </label>
          <input type="time" id="id${deserialized.id}-end-time" value="${deserialized.endTime}" class="timepicker">
        </div>
        <div class="form-group">
          <label for="id${deserialized.id}-weekdays">Repeat:</label>
          <div class="weekdays" id="id${deserialized.id}-weekdays">
            <div class="column">
              <div class="weekday">
                <label for="id${deserialized.id}-mon">Mon</label>
                <input type="checkbox" id="id${deserialized.id}-mon" ${checked(mon)}>
              </div>
              <div class="weekday">
                <label for="id${deserialized.id}-tue">Tue</label>
                <input type="checkbox" id="id${deserialized.id}-tue" ${checked(tue)}>
              </div>
              <div class="weekday">
                <label for="id${deserialized.id}-wed">Wed</label>
                <input type="checkbox" id="id${deserialized.id}-wed" ${checked(wed)}>
              </div>
              <div class="weekday">
                <label for="id${deserialized.id}-thu">Thu</label>
                <input type="checkbox" id="id${deserialized.id}-thu" ${checked(thu)}>
              </div>
            </div>
            <div class="column">
              <div class="weekday">
                <label for="id${deserialized.id}-fri">Fri</label>
                <input type="checkbox" id="id${deserialized.id}-fri" ${checked(fri)}>
              </div>
              <div class="weekday">
                <label for="id${deserialized.id}-sat">Sat</label>
                <input type="checkbox" id="id${deserialized.id}-sat" ${checked(sat)}>
              </div>
              <div class="weekday">
                <label for="id${deserialized.id}-sun">Sun</label>
                <input type="checkbox" id="id${deserialized.id}-sun" ${checked(sun)}>
              </div>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label for="id${deserialized.id}-enabled">Status: </label>
          <select id="id${deserialized.id}-enabled">
            <option value="disable" ${selected(!deserialized.enabled)}>Disable</option>
            <option value="enable"${selected(deserialized.enabled)}>Enable</option>
          </select>
        </div>
        <div class="button-container">
          <button id="id${deserialized.id}-save-schedule">Save</button>
        </div>
      </div>
    </div>`;
    const weekdays = container.querySelectorAll(`#id${deserialized.id}-weekdays .weekday`);
    const startTime = container.querySelector(`#id${deserialized.id}-start-time`);
    const endTime = container.querySelector(`#id${deserialized.id}-end-time`);
    const enabled = container.querySelector(`#id${deserialized.id}-enabled`);
    return {
        container: container,
        weekdays: weekdays,
        startTime: startTime,
        endTime: endTime,
        enabled: enabled,
    };
};
export {};
