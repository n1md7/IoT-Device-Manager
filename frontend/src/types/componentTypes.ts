import { DeviceDetails } from './deviceTypes.ts';
import { SystemsDetails } from './systemTypes.ts';

export type ComponentsDetails = {
  id: number;
  inUse: boolean;
  shared: boolean;
  createdAt: string;
  updatedAt: string;
  device: DeviceDetails;
  system: SystemsDetails;
};

export type ComponentsResponseData = {
  count: number;
  components: ComponentsDetails[];
};
