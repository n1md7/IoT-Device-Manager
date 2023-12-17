import { DeviceStatus } from '/src/devices/enums/status.enum';
import { IsEnum, IsNumber, IsString, Length, MaxLength } from 'class-validator';
import { DeviceType } from '/src/devices/enums/type.enum';

export class StatusReportMessage {
  @IsEnum(DeviceStatus)
  status!: DeviceStatus;

  @IsString()
  @Length(5)
  code!: string;

  @IsEnum(DeviceType)
  type!: DeviceType;

  @IsString()
  @MaxLength(64)
  name!: string;

  @IsString()
  @MaxLength(2)
  version!: string;

  @IsNumber()
  time!: number;
}
