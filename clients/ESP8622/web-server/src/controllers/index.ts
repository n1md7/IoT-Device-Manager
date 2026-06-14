import { ScheduleController } from "controllers/schedule.controller";
import { SwitchController } from "controllers/switch.controller";
import { schedules, switches } from "managers/index";

export const switchController = new SwitchController(switches);
export const schedulesController = new ScheduleController(schedules, switches);
