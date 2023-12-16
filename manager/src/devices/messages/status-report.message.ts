import { TimerStatus } from '/src/devices/enums/status.enum';
import { IsEnum, IsNumber, IsString, Length, MaxLength } from 'class-validator';

export class StatusReportMessage {
  @IsEnum(TimerStatus)
  status!: TimerStatus;

  @IsString()
  @Length(5)
  code!: string;

  @IsString()
  @MaxLength(32)
  type!: string;

  @IsString()
  @MaxLength(64)
  name!: string;

  @IsString()
  @MaxLength(2)
  version!: string;

  @IsNumber()
  time!: number;
}
