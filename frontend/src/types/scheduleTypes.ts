import { SystemData } from './systemTypes.ts';

export type ScheduleDetails = {
  min: number;
  sec: number;
};

export type ScheduleData = {
  id: number;
  name: string;
  startExpression: string;
  duration: ScheduleDetails;
  system: SystemData;
  createdAt: string;
  updatedAt: string;
};

export type ScheduleResponseData = {
  count: number;
  schedules: ScheduleData[];
};

export type SchedulePayload = {
  name: string;
  startExpression: string;
  duration: ScheduleDetails;
  systemId: number;
};
