import { ComponentsDetails } from './componentTypes.ts';

export type DeviceDetails = {
  ipAddress: string | null;
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
