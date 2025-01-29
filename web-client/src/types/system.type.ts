import { TimestampsType } from '/src/types/timestamps.type';
import { ComponentType } from '/src/types/component.type';

export interface SystemType extends TimestampsType {
  id: number;
  name: string;
  description: string | null;
  components: ComponentType[];
}
