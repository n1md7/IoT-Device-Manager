import { ComponentsDetails } from './componentTypes.ts';

export type SystemData = {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  components: ComponentsDetails[];
};

export type SystemsResponseData = {
  count: number;
  systems: SystemData[];
};

export type SystemPayload = {
  name: string;
  description: string;
};
