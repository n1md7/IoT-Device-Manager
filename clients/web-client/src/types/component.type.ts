import { TimestampsType } from '../types/timestamps.type';
import { DeviceType } from '../types/device.type';

export interface ComponentType extends TimestampsType {
  id: number;
  inUse: boolean;
  shared: boolean;
  device: DeviceType;
}
