import { TimerStatus } from '/src/devices/enums/status.enum';

export class StatusReportMessage {
  status!: TimerStatus;
  name!: string;
  code!: string;
  time!: {
    min: number;
    sec: number;
  };
}
