import { SystemsDetails } from './systemTypes.ts';

export type ScheduleDetails = {
  min: number;
  sec: number;
};

export type Schedule = {
  id: number;
  name: string;
  startExpression: string;
  duration: ScheduleDetails[];
  systems: SystemsDetails[];
  createdAt: string;
  updatedAt: string;
};
