import { ComponentsDetails } from './componentTypes.ts';

export type SystemsDetails = {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  components: ComponentsDetails[];
};

export type SystemsResponseData = {
  count: number;
  systems: SystemsDetails[];
};
