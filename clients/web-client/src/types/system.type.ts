import { TimestampsType } from '../types/timestamps.type';
import { ComponentType } from '../types/component.type';

export interface SystemType extends TimestampsType {
  id: number;
  name: string;
  description: string | null;
  components: ComponentType[];
}
