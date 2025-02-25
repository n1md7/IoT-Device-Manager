import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';
import { DeviceStatus } from '/src/devices/enums/status.enum';
import { AbstractRequest } from '/src/devices/requests/webhook/abstract.request';

export class SensorStatusRequest extends AbstractRequest {
  @ApiProperty({
    description: 'The reading value of the sensor.',
    example: 1.234567,
  })
  @IsNumber()
  reading!: number;
}
