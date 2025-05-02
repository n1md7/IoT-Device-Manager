import { DeviceDetails } from '@src/types/deviceTypes';
import { SystemData } from '@src/types/systemTypes';

export type ComponentsData = {
  id: number;
  inUse: boolean;
  shared: boolean;
  createdAt: string;
  updatedAt: string;
  device: DeviceDetails;
  system: SystemData;
};

export type ComponentsResponseData = {
  count: number;
  components: ComponentsData[];
};

export type ComponentPayloadData = {
  deviceCode: string;
  systemId: number;
  shared?: boolean;
};
