// Single entry for the scheduler page. Order matters: the helpers below
// register themselves on `window.scheduler` before `schedules.ts` consumes them.
import "./fetch-schedules.ts";
import "./update-schedules.ts";
import "./create-schedule.ts";
import "./create-card.ts";
import "./deserialize.ts";
import "./serialize.ts";
import "./schedules.ts";
