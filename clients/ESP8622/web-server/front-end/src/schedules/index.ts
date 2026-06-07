// Single entry for the scheduler page. Order matters: the helpers below
// register themselves on `window.scheduler` before `schedules.ts` consumes them.
import "./fetch-schedules";
import "./update-schedules";
import "./create-card";
import "./deserialize";
import "./serialize";
import "./schedules";
