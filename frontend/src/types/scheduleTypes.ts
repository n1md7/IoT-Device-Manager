import { SystemsDetails } from './systemTypes.ts';
import { ComponentsDetails } from './componentTypes.ts';

export type ScheduleDetails = {
  min: number;
  sec: number;
};

export type ScheduleData = {
  id: number;
  name: string;
  startExpression: string;
  duration: ScheduleDetails;
  system: SystemsDetails;
  components: ComponentsDetails[];
  createdAt: string;
  updatedAt: string;
};

export type ScheduleResponseData = {
  count: number;
  schedules: ScheduleData[];
};
