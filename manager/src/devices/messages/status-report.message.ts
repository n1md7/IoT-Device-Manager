import { TimerStatus } from '/src/devices/enums/status.enum';
import { IsEnum, IsNumber, IsString, ValidateNested } from 'class-validator';

class Time {
  @IsNumber()
  min!: number;

  @IsNumber()
  sec!: number;
}

export class StatusReportMessage {
  @IsEnum(TimerStatus)
  status!: TimerStatus;

  @IsString()
  name!: string;

  @IsString()
  code!: string;

  @ValidateNested()
  time!: Time;
}
