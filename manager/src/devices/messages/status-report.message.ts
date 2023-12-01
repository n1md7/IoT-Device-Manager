import { TimerStatus } from '/src/devices/enums/status.enum';
import { IsEnum, IsNumber, IsString } from 'class-validator';

export class StatusReportMessage {
  @IsString()
  code!: string;

  @IsEnum(TimerStatus)
  status!: TimerStatus;

  @IsString()
  name!: string;

  @IsNumber()
  time!: number;
}
