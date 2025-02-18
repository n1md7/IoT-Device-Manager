import van from "./van-1.5.3.min.mjs";

const {
  body,
  header,
  main,
  div,
  h1,
  h2,
  p,
  span,
  button,
  label,
  select,
  option,
  footer,
} = van.tags;

const status = van.state("OFF");
const countdown = van.state(0);
const errorText = van.state("");
const minutes = van.state(0);
const seconds = van.state(10);
const isCounting = van.state(false);
let countdownInterval;

const getStatusText = (s) => (s ? "ON" : "OFF");
const getFormattedTime = (value) =>
  new Date(value * 1000).toISOString().slice(14, 19);

const resetState = () => {
  status.val = "OFF";
  countdown.val = 0;
  isCounting.val = false;
};

const startCountdown = () => {
  isCounting.val = true;
  countdownInterval = setInterval(() => {
    if (countdown.val > 0) {
      countdown.val -= 1;
    } else {
      clearInterval(countdownInterval);
      resetState();
    }
  }, 1000);
};

const handleClick = (path) => {
  fetch(`${path}?min=${minutes.val}&sec=${seconds.val}`)
    .then((res) => (res.ok ? res.json() : res.json().then(Promise.reject)))
    .then((data) => {
      status.val = getStatusText(data.active);
      countdown.val = data.active ? data.time : 0;
      errorText.val = "";
      if (data.active) startCountdown();
    })
    .catch((err) => (errorText.val = err.message));
};

const App = () =>
  body(
    header(h1("Home Automation")),
    main(
      h2("Smart things"),
      p("Status: ", span({ id: "status" }, status)),
      van.derive(() =>
        isCounting.val && countdown.val > 0
          ? p(
              "Auto-shutdown in: ",
              span(
                { id: "time" },
                van.derive(() => getFormattedTime(countdown.val)),
              ),
            )
          : null,
      ),
      van.derive(() =>
        isCounting.val
          ? null
          : div(
              label(
                "Minutes: ",
                select(
                  {
                    id: "minutes",
                    onchange: (e) => (minutes.val = e.target.value),
                  },
                  ...[0, 1, 2, 3, 4, 5, 10, 15, 20, 30, 45].map((m) =>
                    option({ value: m }, m),
                  ),
                ),
              ),
              label(
                "Seconds: ",
                select(
                  {
                    id: "seconds",
                    onchange: (e) => (seconds.val = e.target.value),
                  },
                  ...[0, 10, 20, 30, 45].map((s) => option({ value: s }, s)),
                ),
              ),
            ),
      ),
      div(
        {
          class: "button-container",
        },
        button({ id: "on", onclick: () => handleClick("/api/on") }, "Turn ON"),
        button(
          { id: "off", onclick: () => handleClick("/api/off") },
          "Turn OFF",
        ),
      ),
      p({ id: "error-text", style: "color:red;" }, errorText),
    ),
    footer("Smart Automation | Powered by GG-Software"),
  );

van.add(document.body, App());
