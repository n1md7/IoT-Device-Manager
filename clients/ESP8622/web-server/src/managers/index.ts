import { Schedules } from "managers/schedules";
import { Switches } from "managers/switches";

export const switches = new Switches();
export const schedules = new Schedules(switches, 1000);
