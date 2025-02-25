import { ApiProperty } from '@nestjs/swagger';
import { DeviceType } from '../enums/type.enum';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateDeviceRequest {
  @ApiProperty({
    type: String,
    example: 'D0001',
    description: 'The unique identifier of the device.',
  })
  @IsString()
  @MaxLength(5)
  code!: string;

  @ApiProperty({
    enum: DeviceType,
    example: DeviceType.SWITCH,
    description: 'The type of the device. This will be used to determine the configuration of the device',
  })
  @IsEnum(DeviceType)
  type!: DeviceType;

  @ApiProperty({
    type: String,
    example: 'Timer',
    description: 'The name of the device.',
  })
  @IsString()
  @MaxLength(64)
  name!: string;

  @ApiProperty({
    type: String,
    example: 'A timer device.',
    description: 'The description of the device.',
  })
  @IsString()
  @IsOptional()
  @MaxLength(256)
  description?: string;

  @ApiProperty({
    type: String,
    example: '1',
    examples: ['1', '2', '3'],
    description: 'The version of the device.',
  })
  @IsString()
  @MaxLength(2)
  version!: string;

  @ApiProperty({
    type: String,
    example: '192.168.1.7',
    description:
      'The IP address of the device. ' +
      'When it is set it will use HTTP request otherwise it fallbacks to MQTT protocol. ' +
      'Omit this property if the device supposed to communicate over MQTT messages.',
  })
  @IsString()
  @MaxLength(15)
  @IsOptional()
  ipAddress?: string;
}
