import { TimestampsType } from '/src/types/timestamps.type';
import { DeviceType } from '/src/types/device.type';

export interface ComponentType extends TimestampsType {
  id: number;
  inUse: boolean;
  shared: boolean;
  device: DeviceType;
}
