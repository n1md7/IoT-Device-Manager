import { TimestampsType } from '/src/types/timestamps.type';

export interface DeviceType extends TimestampsType {
  code: 'string'; // for example 'D0001'
  type: 'SWITCH' | 'PUMP' | 'SPRINKLER';
  name: string;
  description: string | null;
  version: '1' | '2' | '3';
}
