import express from "express";

const app = express();
const port = 1234;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let timerActive = false;
let timerTime = 0;
let info = { used: 512, total: 1024 };
let config = {
  name: "Default Name",
  description: "Default Description",
  startTime: 10,
  managerUrl: "http://localhost",
};
let schedules = [];

function apiError(message) {
  return { status: 400, error: message };
}

app.post("/api/on", (req, res) => {
  const { min = 0, sec = 0 } = req.body;
  if (min < 0 || sec < 0)
    return res.json(apiError("Invalid query parameters."));

  timerTime = min * 60 + sec || 10;
  if (timerTime < 10)
    return res.json(apiError("Minimum duration is 10 seconds!"));

  timerActive = true;
  res.json({ active: true, time: timerTime });
});

app.post("/api/off", (req, res) => {
  timerActive = false;
  res.json({ active: false });
});

app.get("/api/status", (req, res) => {
  res.json({ active: timerActive, time: timerTime });
});

app.get("/api/info", (req, res) => {
  res.json({
    code: "D0001",
    version: "1.0.0",
    current: config,
    defaults: config,
    disk: {
      used: info.used,
      total: info.total,
      occupied: `${((info.used / info.total) * 100).toFixed(2)}%`,
    },
    time: {
      now: Date.now(),
      str: new Date().toString(),
      iso: new Date().toISOString(),
    },
  });
});

app.get("/api/config-reset", (req, res) => {
  config = {
    ...config,
    name: "Default Name",
    description: "Default Description",
    startTime: 10,
    managerUrl: "http://localhost",
  };
  res.sendStatus(204);
});

app.get("/api/config-update", (req, res) => {
  const { managerUrl, startTime, name, description } = req.params;
  if (managerUrl && !managerUrl.startsWith("http"))
    return res.json(apiError("Invalid managerUrl."));
  if (startTime && startTime < 10)
    return res.json(apiError("startTime must be at least 10 seconds."));

  config = { ...config, managerUrl, startTime, name, description };
  res.sendStatus(204);
});

app
  .route("/api/schedules")
  .get((req, res) => res.json(schedules))
  .post((req, res) => {
    const { action } = req.body;
    if (action === "ON") return res.sendStatus(200);
    if (action === "OFF") return res.sendStatus(200);
    res.json(apiError("Invalid action."));
  })
  .put((req, res) => {
    const { id, weekdays, hour, minute, active, activateForSeconds } = req.body;
    if (!id) return res.json(apiError("Missing schedule ID."));
    res.sendStatus(204);
  });

app.listen(port, () => console.log(`Mock API running on port ${port}`));
