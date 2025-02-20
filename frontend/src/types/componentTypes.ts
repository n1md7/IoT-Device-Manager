import { DeviceDetails } from './deviceTypes.ts';

export type ComponentsDetails = {
  id: number;
  inUse: boolean;
  shared: boolean;
  createdAt: string;
  updatedAt: string;
  device: DeviceDetails;
};

export type ComponentsResponseData = {
  count: number;
  components: ComponentsDetails[];
};
