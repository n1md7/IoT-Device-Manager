import { IsInt, IsString, Matches, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateScheduleRequest {
  @ApiProperty({
    type: Number,
    example: 1,
    description: 'The unique identifier of the system.',
  })
  @IsInt()
  systemId!: number;

  @ApiProperty({
    type: String,
    example: 'Timer schedule',
    description: 'The name of the schedule.',
  })
  @IsString()
  @MaxLength(32)
  name!: string;

  @ApiProperty({
    type: String,
    example: '5 * * * * *',
    description: 'The cron expression of the schedule to START.',
  })
  @IsString()
  @MaxLength(32)
  startExpression!: string;

  @ApiProperty({
    type: String,
    example: '5 * * * * *',
    description: 'The cron expression of the schedule to STOP.',
  })
  @IsString()
  @MaxLength(32)
  stopExpression!: string;

  @ApiProperty({
    type: Number,
    example: -1,
    description: 'The number of times the schedule will run. -1 means infinite. It will be removed after the last run.',
  })
  @Type(() => Number)
  @Matches(/^-?([1-9]\d{0,2}|99)$/)
  removeAfterCount!: number;
}
