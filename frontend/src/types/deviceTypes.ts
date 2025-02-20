import { ComponentsDetails } from './componentTypes.ts';

export type DeviceDetails = {
  code: string;
  type: string;
  name: string;
  description: string | null;
  version: string;
  createdAt: string;
  updatedAt: string;
  components: ComponentsDetails[];
};

export type DevicesResponseData = {
  count: number;
  devices: DeviceDetails[];
};
