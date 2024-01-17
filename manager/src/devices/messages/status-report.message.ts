import { DeviceStatus } from '/src/devices/enums/status.enum';
import { IsEnum, IsNumber, IsString, Length, MaxLength } from 'class-validator';
import { DeviceType } from '/src/devices/enums/type.enum';

type Status = 'ON' | 'OFF';
type Code = `D:${number}`;
type Type = DeviceType;
type Name = string;
type Version = string;
type Time = number;

export type StatusReportPayload = `${Status},${Code},${Type},${Name},${Version},${Time}`;

export class StatusReportMessage {
  @IsEnum(DeviceStatus) status!: DeviceStatus;
  @IsString() @Length(5) code!: string;
  @IsEnum(DeviceType) type!: DeviceType;
  @IsString() @MaxLength(64) name!: string;
  @IsString() @MaxLength(2) version!: string;
  @IsNumber() time!: number;

  private constructor(payload: Partial<StatusReportMessage>) {
    Object.assign(this, payload);
  }

  static fromPayload(payload: StatusReportPayload): StatusReportMessage {
    const [status, code, type, name, version, time] = payload.split(',');

    return new StatusReportMessage({
      status: status as DeviceStatus,
      code,
      type: type as DeviceType,
      name,
      version,
      time: Number(time),
    });
  }
}
