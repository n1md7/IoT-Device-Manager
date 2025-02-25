import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';
import { DeviceStatus } from '/src/devices/enums/status.enum';
import { AbstractRequest } from '/src/devices/requests/webhook/abstract.request';

export class SwitchStatusRequest extends AbstractRequest {
  @ApiProperty({
    enum: DeviceStatus,
    example: DeviceStatus.ON,
    description: 'The status of the device.',
  })
  @IsEnum(DeviceStatus)
  status!: DeviceStatus;

  @ApiProperty({
    type: Number,
    example: 60,
    description: 'Time remaining for the device to turn off.',
  })
  @IsNumber()
  timeRemaining!: number;
}
