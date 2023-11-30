import { TimerStatus } from '/src/devices/enums/status.enum';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class TimerControlRequest {
  @ApiProperty({
    description: 'Device code. Must be unique',
    examples: ['D0001', 'D0002', 'D0003'],
    example: 'D0001',
    type: String,
  })
  @IsString()
  code!: string;

  @ApiProperty({
    description: 'Device state',
    example: 'ON',
    type: String,
    enum: TimerStatus,
    enumName: 'TimerStatus',
  })
  @IsEnum(TimerStatus)
  status!: TimerStatus;

  @ApiProperty({
    description:
      'Timer countdown in minutes. Only minutes [0-59] are supported.',
    example: 10,
    default: 15,
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsPositive()
  @Max(59)
  @Min(0)
  minutes: number = 15;

  @ApiProperty({
    description:
      'Timer countdown in seconds. Only seconds [0-59] are supported',
    example: 30,
    default: 0,
    type: Number,
    required: false,
  })
  @IsOptional()
  @Max(59)
  @Min(0)
  seconds: number = 0;
}
